const terminal = document.getElementById("terminal");
const input = document.getElementById("command-input");

/**
 * Append a new line to the terminal output.
 * type: "command" | "output" | "error" | "system" | "success"
 */
function appendLine(text, type = "output") {
  const line = document.createElement("span");
  line.className = `line ${type}`;
  line.textContent = text;
  terminal.insertBefore(line, terminal.querySelector(".prompt-line"));
  scrollToBottom();
}

function handleTabCompletion() {
  const value = input.value;

  // nothing typed -> nothing to complete
  if (!value.trim()) return;

  // Only autocomplete the first "word" (the command)
  const parts = value.split(" ");
  const rawCmd = parts[0];
  const rest = parts.slice(1).join(" ");

  if (parts.length > 1) {
    // Had issues with a complete command printing possible commands, so disabled for now
    // const commandNames = Object.keys(COMMANDS);
    // const matches = commandNames.filter(name => name.startsWith(rawCmd.toLowerCase()));
    // if (matches.length === 0) return;
    // appendLine("possible commands:", "system");
    // matches.forEach(cmd => appendLine("  " + cmd, "system"));
    // scrollToBottom();
    return;
  }

  const partial = rawCmd.toLowerCase();
  const commandNames = Object.keys(COMMANDS);
  const matches = commandNames.filter(name => name.startsWith(partial));

  if (matches.length === 0) {
    // nothing matches, silently ignore
    return;
  }
  if (matches.length === 1) {
    // Single match: autocomplete and add a trailing space
    input.value = matches[0] + (rest ? " " + rest : " ");
    return;
  }

  // Multiple matches: print them as options, like a real shell
  appendLine(matches.join("   "), "system");
  scrollToBottom();
}


function clearOutput() {
  const lines = terminal.querySelectorAll(".line");
  lines.forEach(line => line.remove());
}

function scrollToBottom() {
  requestAnimationFrame(() => {
    terminal.scrollTop = terminal.scrollHeight;
  });
}

function handleCommand(rawValue) {
  const value = rawValue.trim();
  if (!value) return;

  // Print the command itself
  appendLine(`visitor@portfolio:~$ ${value}`, "command");
  // if the command is in the command at any point ^C, just return
  if (value.includes("^C")) return;

  const [cmd] = value.split(" ");
  const command = COMMANDS[cmd.toLowerCase()];

  if (!command) {
    appendLine(`command not found: '${cmd}'`, "error");
    appendLine(`type 'help' to see available commands.`, "system");
    return;
  }

  const output = command.run();
  if (Array.isArray(output)) {
    output.forEach(line => appendLine(line, "output"));
  }
}

input.addEventListener("keydown", (event) => {
// add ctrl + c to clear input
  if (event.key === "c" && event.ctrlKey) {
    event.preventDefault();
    //append ^C to current line
    input.value += "^C";
    handleCommand(input.value);
    input.value = "";
    return;
  }
    if (event.key === "Enter") {
    const value = input.value;
    handleCommand(value);
    input.value = "";
    return;
  }

  if (event.key === "Tab") {
    event.preventDefault(); // stops browser from focusing elsewhere
    handleTabCompletion();
    return;
  }
});


// Auto-focus input when clicking anywhere on the terminal body
document.addEventListener("click", (event) => {
  if (!terminal.contains(event.target)) return;
  input.focus();
});

// Focus input on load
window.addEventListener("DOMContentLoaded", () => {
  input.focus();
});

function updateHeight() {
  document.documentElement.style.setProperty('--real-height', window.innerHeight + 'px');
}
window.addEventListener('resize', updateHeight);
updateHeight();
