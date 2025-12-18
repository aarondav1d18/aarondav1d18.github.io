import { isMobileUI } from "../lib/mobile.js";

export function createFilesGrid({ fileNames, openVirtualFile, windows }) {
  const grid = document.getElementById("files-list");
  let selectedIndex = -1;

  function setSelected(index) {
    if (!grid) return;

    const items = Array.from(grid.querySelectorAll(".file-tile"));
    if (items.length === 0) return;

    const clamped = Math.max(0, Math.min(items.length - 1, index));
    selectedIndex = clamped;

    items.forEach((el, i) => {
      el.dataset.selected = i === selectedIndex ? "true" : "false";
      if (i === selectedIndex) el.focus({ preventScroll: true });
    });

    items[selectedIndex].scrollIntoView({ block: "nearest", inline: "nearest" });
  }

  function openSelected() {
    if (selectedIndex < 0) return;
    const name = fileNames[selectedIndex];
    if (!name) return;
    openVirtualFile(name);
  }

  function render() {
    if (!grid) return;

    grid.innerHTML = "";

    fileNames.forEach((name, index) => {
      const tile = document.createElement("button");
      tile.type = "button";
      tile.className = "file-tile";
      tile.dataset.index = String(index);
      tile.dataset.selected = "false";
      tile.setAttribute("role", "option");
      tile.setAttribute("aria-selected", "false");

      const icon = document.createElement("img");
      icon.className = "file-icon";
      icon.draggable = false;
      icon.src = "icons/file.png";
      icon.alt = "";

      const label = document.createElement("div");
      label.className = "file-name";
      label.textContent = name;

      tile.appendChild(icon);
      tile.appendChild(label);

      tile.addEventListener("click", (ev) => {
        ev.stopPropagation();

        if (isMobileUI()) {
          openVirtualFile(name);
          return;
        }

        setSelected(index);
      });

      tile.addEventListener("dblclick", (ev) => {
        if (isMobileUI()) return;
        ev.stopPropagation();

        setSelected(index);
        openVirtualFile(name);
      });

      tile.addEventListener("focus", () => {
        selectedIndex = index;
        tile.dataset.selected = "true";
      });

      grid.appendChild(tile);
    });

    if (fileNames.length > 0) setSelected(0);
  }

  function handleKeydown(ev) {
    if (!grid) return;
    if (!windows.isOpen("files")) return;

    const filesWin = windows.getWindow("files");
    if (!filesWin) return;

    const active = document.activeElement;
    if (!filesWin.contains(active)) return;

    if (fileNames.length === 0) return;

    const styles = window.getComputedStyle(grid);
    const cols = Math.max(1, styles.gridTemplateColumns.split(" ").length);

    if (selectedIndex < 0) selectedIndex = 0;

    if (ev.key === "Enter") {
      ev.preventDefault();
      openSelected();
      return;
    }

    if (ev.key === "ArrowRight") {
      ev.preventDefault();
      setSelected(selectedIndex + 1);
      return;
    }

    if (ev.key === "ArrowLeft") {
      ev.preventDefault();
      setSelected(selectedIndex - 1);
      return;
    }

    if (ev.key === "ArrowDown") {
      ev.preventDefault();
      setSelected(selectedIndex + cols);
      return;
    }

    if (ev.key === "ArrowUp") {
      ev.preventDefault();
      setSelected(selectedIndex - cols);
      return;
    }
  }

  function focusSelectedOnOpen() {
    requestAnimationFrame(() => {
      if (selectedIndex < 0) selectedIndex = 0;
      setSelected(selectedIndex);
    });
  }

  return {
    render,
    handleKeydown,
    focusSelectedOnOpen
  };
}
