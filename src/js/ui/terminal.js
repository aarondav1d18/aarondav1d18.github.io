export function createTerminal({ commands, fileNames, openVirtualFile, closeWindow }) {
  const terminalEl = document.getElementById("terminal");
  const inputEl = document.getElementById("command-input");

  if (!terminalEl || !inputEl) {
    throw new Error("Terminal elements not found");
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

    const boot = [
      `<span class="line system">booting virtual shell...</span>`,
      `<span class="line system">loading developer profile... done.</span>`,
      `<span class="line system">type <span class="keyword">help</span> to see available commands.</span>`
    ].join("");

    const promptLine = terminalEl.querySelector(".prompt-line");
    if (promptLine) promptLine.insertAdjacentHTML("beforebegin", boot);

    scrollToBottom();
  }

  function handleTabCompletion() {
    const value = inputEl.value;
    if (!value.trim()) return;

    const parts = value.split(" ");
    const rawCmd = parts[0] || "";
    const cmd = rawCmd.toLowerCase();

    if (parts.length === 1) {
      const commandNames = Object.keys(commands);
      const matches = commandNames.filter((name) => name.startsWith(cmd));

      if (matches.length === 0) return;

      if (matches.length === 1) {
        inputEl.value = matches[0] + " ";
        return;
      }

      appendLine(matches.join("   "), "system");
      scrollToBottom();
      return;
    }

    if (cmd === "cat" || cmd === "open") {
      const partial = (parts[1] || "").toLowerCase();
      const matches = fileNames.filter((name) => name.startsWith(partial));

      if (matches.length === 0) return;

      if (matches.length === 1) {
        inputEl.value = `${cmd} ${matches[0]}`;
        return;
      }

      appendLine(matches.join("   "), "system");
      scrollToBottom();
      return;
    }
  }

  function runCommand(rawValue) {
    const value = String(rawValue || "").trim();
    if (!value) return;

    appendLine(`visitor@portfolio:~$ ${value}`, "command");

    if (value.includes("^C")) return;

    const parts = value.split(" ");
    const cmd = (parts[0] || "").toLowerCase();
    const args = parts.slice(1);

    if (cmd === "sudo" && value.trim() === "sudo rm -rf /") {
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
    inputEl.addEventListener("keydown", (event) => {
      if (event.key === "c" && event.ctrlKey) {
        event.preventDefault();
        inputEl.value += "^C";
        runCommand(inputEl.value);
        inputEl.value = "";
        return;
      }

      if (event.key === "Enter") {
        event.preventDefault();
        const value = inputEl.value;
        runCommand(value);
        inputEl.value = "";
        return;
      }

      if (event.key === "Tab") {
        event.preventDefault();
        handleTabCompletion();
        return;
      }
    });

    document.addEventListener("click", (event) => {
      if (!terminalEl.contains(event.target)) return;
      inputEl.focus();
    });

    window.addEventListener("DOMContentLoaded", () => {
      inputEl.focus();
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
