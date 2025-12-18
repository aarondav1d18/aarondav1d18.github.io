const textMeasureCanvas = document.createElement("canvas");
const textMeasureCtx = textMeasureCanvas.getContext("2d");

function measureTextWidth(text, inputEl) {
  const style = window.getComputedStyle(inputEl);
  textMeasureCtx.font = `${style.fontSize} ${style.fontFamily}`;
  return textMeasureCtx.measureText(text).width;
}

export function createTerminal({ commands, fileNames }) {
  const terminalEl = document.getElementById("terminal");
  const inputEl = document.getElementById("command-input");

  if (!terminalEl || !inputEl) {
    throw new Error("Terminal elements not found");
  }

  const history = [];
  let historyIndex = -1;
  let historyDraft = "";

  const promptLineEl = terminalEl.querySelector(".prompt-line");
  const hintEl = ensureHintElement(promptLineEl);

  function ensureHintElement(promptLine) {
    if (!promptLine) return null;

    promptLine.style.position = "relative";

    const existing = promptLine.querySelector(".terminal-hint");
    if (existing) return existing;

    const el = document.createElement("span");
    el.className = "terminal-hint";
    el.textContent = "";
    promptLine.appendChild(el);
    return el;
  }

  function scrollToBottom() {
    requestAnimationFrame(() => {
      terminalEl.scrollTop = terminalEl.scrollHeight;
    });
  }

  function appendLine(text, type = "output") {
    const line = document.createElement("span");
    line.className = `line ${type}`;

    const linked = String(text).replace(
      /(https?:\/\/[^\s]+)/g,
      `<a href="$1" target="_blank">$1</a>`
    );

    line.innerHTML = linked;
    terminalEl.insertBefore(line, terminalEl.querySelector(".prompt-line"));
    scrollToBottom();
  }

  function clearOutput() {
    terminalEl.querySelectorAll(".line").forEach((line) => line.remove());
  }

  function resetTerminal() {
    clearOutput();
    inputEl.value = "";
    clearHint();

    const boot = [
      `<span class="line system">booting virtual shell...</span>`,
      `<span class="line system">loading developer profile... done.</span>`,
      `<span class="line system">type <span class="keyword">help</span> to see available commands.</span>`
    ].join("");

    const promptLine = terminalEl.querySelector(".prompt-line");
    if (promptLine) promptLine.insertAdjacentHTML("beforebegin", boot);

    scrollToBottom();
  }

  function clearHint() {
    if (!hintEl) return;
    hintEl.textContent = "";
    hintEl.style.display = "none";
  }

  function setHintText(text) {
    if (!hintEl) return;

    if (!text) {
      clearHint();
      return;
    }

    hintEl.textContent = text;
    hintEl.style.display = "block";
    positionHint();
  }

  function positionHint() {
  if (!hintEl) return;
  
  const inputRect = inputEl.getBoundingClientRect();
  const promptRect = promptLineEl.getBoundingClientRect();
  
  const value = inputEl.value || "";
  const textWidth = measureTextWidth(value, inputEl);
  
  const style = window.getComputedStyle(inputEl);
  const padLeft = parseFloat(style.paddingLeft || "0");
  
  const left =
      inputRect.left -
      promptRect.left +
      padLeft +
      textWidth;
  
  hintEl.style.left = `${left}px`;
  hintEl.style.top = "50%";
  hintEl.style.transform = "translateY(-50%)";
  }

  function isCaretAtEnd() {
    const start = inputEl.selectionStart;
    const end = inputEl.selectionEnd;
    const len = inputEl.value.length;
    return start === len && end === len;
  }

  function computeSuggestion() {
    const raw = inputEl.value;
    const value = String(raw || "");
    const trimmed = value.trim();

    if (!trimmed) return "";

    const endsWithSpace = /\s$/.test(value);
    const parts = value.split(" ").filter((p) => p.length > 0);

    const cmdPart = (parts[0] || "").toLowerCase();

    if (parts.length === 1 && !endsWithSpace) {
      const matches = Object.keys(commands).filter((n) => n.startsWith(cmdPart));
      if (matches.length !== 1) return "";

      const full = matches[0];
      if (full === cmdPart) return "";
      return full.slice(cmdPart.length);
    }

    const wantsFile =
      cmdPart === "cat" || cmdPart === "open";

    if (!wantsFile) return "";

    if (endsWithSpace && parts.length === 1) {
      const name = bestSingleMatch("", fileNames);
      if (!name) return "";
      return name;
    }

    const filePart = (parts[1] || "").toLowerCase();
    if (!filePart) {
      const name = bestSingleMatch("", fileNames);
      if (!name) return "";
      return name;
    }

    const match = bestSingleMatch(filePart, fileNames);
    if (!match) return "";

    if (match === filePart) return "";
    return match.slice(filePart.length);
  }

  function bestSingleMatch(prefix, list) {
    const p = String(prefix || "").toLowerCase();
    const matches = list.filter((n) => n.startsWith(p));
    if (matches.length !== 1) return "";
    return matches[0];
  }

  function refreshHint() {
    if (!isCaretAtEnd()) {
      clearHint();
      return;
    }

    const suggestion = computeSuggestion();
    setHintText(suggestion);
  }

  function acceptHintOrTabComplete() {
    const suggestion = computeSuggestion();
    if (!suggestion) return false;

    const value = inputEl.value;
    const trimmed = value.trim();
    const endsWithSpace = /\s$/.test(value);
    const parts = value.split(" ").filter((p) => p.length > 0);
    const cmdPart = (parts[0] || "").toLowerCase();

    if (parts.length === 1 && !endsWithSpace) {
      inputEl.value = cmdPart + suggestion + " ";
      refreshHint();
      return true;
    }

    if (cmdPart === "cat" || cmdPart === "open") {
      if (parts.length === 1) {
        inputEl.value = `${cmdPart} ${suggestion}`;
        refreshHint();
        return true;
      }

      inputEl.value = `${cmdPart} ${parts[1]}${suggestion}`;
      refreshHint();
      return true;
    }

    return false;
  }

  function pushHistory(cmd) {
    const value = String(cmd || "").trim();
    if (!value) return;

    const last = history[history.length - 1];
    if (last === value) return;

    history.push(value);
  }

  function resetHistoryNav() {
    historyIndex = -1;
    historyDraft = "";
  }

  function historyUp() {
    if (history.length === 0) return;

    if (historyIndex === -1) {
      historyDraft = inputEl.value;
      historyIndex = history.length - 1;
    } else {
      historyIndex = Math.max(0, historyIndex - 1);
    }

    inputEl.value = history[historyIndex] || "";
    refreshHint();
  }

  function historyDown() {
    if (history.length === 0) return;
    if (historyIndex === -1) return;

    historyIndex += 1;

    if (historyIndex >= history.length) {
      historyIndex = -1;
      inputEl.value = historyDraft;
      historyDraft = "";
      refreshHint();
      return;
    }

    inputEl.value = history[historyIndex] || "";
    refreshHint();
  }

  function runCommand(rawValue) {
    const value = String(rawValue || "").trim();
    if (!value) return;

    appendLine(`visitor@portfolio:~$ ${value}`, "command");

    if (value.includes("^C")) return;

    const parts = value.split(" ");
    const cmd = (parts[0] || "").toLowerCase();
    const args = parts.slice(1);

    if (cmd === "sudo" && value === "sudo rm -rf /") {
      appendLine("no... please dont not do that", "error");
      return;
    }

    const command = commands[cmd];
    if (!command) {
      appendLine(`command not found: '${cmd}'`, "error");
      appendLine("type 'help' to see available commands.", "system");
      return;
    }

    const output = command.run(args);
    if (!Array.isArray(output)) return;

    output.forEach((line) => appendLine(line, "output"));
  }

  function bindTerminalEvents() {
    inputEl.addEventListener("input", () => {
      resetHistoryNav();
      refreshHint();
    });

    window.addEventListener("resize", () => {
      refreshHint();
    });

    inputEl.addEventListener("keydown", (event) => {
      if (event.key === "c" && event.ctrlKey) {
        event.preventDefault();
        inputEl.value += "^C";
        runCommand(inputEl.value);
        inputEl.value = "";
        resetHistoryNav();
        refreshHint();
        return;
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        historyUp();
        return;
      }

      if (event.key === "ArrowDown") {
        event.preventDefault();
        historyDown();
        return;
      }

      if (event.key === "Tab") {
        event.preventDefault();
        acceptHintOrTabComplete();
        return;
      }

      if (event.key === "ArrowRight") {
        if (!isCaretAtEnd()) return;
        const accepted = acceptHintOrTabComplete();
        if (accepted) event.preventDefault();
        return;
      }

      if (event.key === "Enter") {
        event.preventDefault();
        const value = inputEl.value;

        pushHistory(value);
        resetHistoryNav();

        runCommand(value);
        inputEl.value = "";
        refreshHint();
        return;
      }
    });

    document.addEventListener("click", (event) => {
      if (!terminalEl.contains(event.target)) return;
      inputEl.focus();
      refreshHint();
    });

    window.addEventListener("DOMContentLoaded", () => {
      inputEl.focus();
      refreshHint();
    });
  }

  return {
    appendLine,
    clearOutput,
    resetTerminal,
    runCommand,
    bindTerminalEvents
  };
}
