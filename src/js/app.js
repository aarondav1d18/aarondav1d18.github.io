import { isMobileUI } from "./lib/mobile.js";
import { FILE_MAP, FILE_NAMES } from "./data/filesystem.js";
import { createCommands } from "./data/commands.js";

import { createWindows } from "./ui/windows.js";
import { createViewer } from "./ui/viewer.js";
import { createTerminal } from "./ui/terminal.js";
import { createFilesGrid } from "./ui/files.js";
import { startClock } from "./ui/clock.js";

function updateHeightVar() {
  document.documentElement.style.setProperty("--real-height", window.innerHeight + "px");
}

updateHeightVar();
window.addEventListener("resize", updateHeightVar);

const windows = createWindows();
const viewer = createViewer();

let terminal = null;

function setViewer(title, lines) {
  viewer.setViewer(title, lines);
  const win = windows.openWindow("viewer");
  windows.bringToFront(win);
}

function openVirtualFile(fileName, commands) {
  const key = String(fileName || "").toLowerCase();
  const cmdName = FILE_MAP[key];

  if (!cmdName || !commands[cmdName]) {
    setViewer("Viewer", `Error: ${fileName} not found in virtual filesystem.`);
    return;
  }

  const output = commands[cmdName].run();
  setViewer(fileName, output);
}

const commands = createCommands({
  clearOutput: () => terminal && terminal.clearOutput(),
  openVirtualFile: (name) => openVirtualFile(name, commands),
  closeWindow: (name) => {
    if (name === "terminal" && terminal) terminal.resetTerminal();
    windows.closeWindow(name);
  }
});

terminal = createTerminal({
  commands,
  fileNames: FILE_NAMES,
  openVirtualFile: (name) => openVirtualFile(name, commands),
  closeWindow: (name) => {
    if (name === "terminal") terminal.resetTerminal();
    windows.closeWindow(name);
  }
});

const files = createFilesGrid({
  fileNames: FILE_NAMES,
  openVirtualFile: (name) => openVirtualFile(name, commands),
  windows
});

files.render();
terminal.bindTerminalEvents();
startClock();

windows.enableResizing();
windows.enableDragging();

document.addEventListener("keydown", (ev) => files.handleKeydown(ev));

document.addEventListener("click", (e) => {
  const closeBtn = e.target.closest("[data-close]");
  if (closeBtn) {
    const name = closeBtn.dataset.close;
    if (name === "terminal") terminal.resetTerminal();
    windows.closeWindow(name);
    return;
  }

  const icon = e.target.closest(".icon");
  if (icon) {
    const target = icon.dataset.open;

    if (target === "terminal" || target === "files") {
      const win = windows.openWindow(target);
      windows.bringToFront(win);

      if (target === "files") files.focusSelectedOnOpen();
      return;
    }

    openVirtualFile(target, commands);
    return;
  }

  const win = e.target.closest(".window");
  if (win) windows.bringToFront(win);
});

if (!isMobileUI()) {
  const win = windows.openWindow("terminal");
  windows.bringToFront(win);
}
