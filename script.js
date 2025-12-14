const terminal = document.getElementById("terminal");
const input = document.getElementById("command-input");

/**
 * Append a new line to the terminal output.
 * type: "command" | "output" | "error" | "system" | "success"
 */
function appendLine(text, type = "output") {
  const line = document.createElement("span");
  line.className = `line ${type}`;

  // auto-linkify URLs
  const linked = text.replace(
    /(https?:\/\/[^\s]+)/g,
    `<a href="$1" target="_blank">$1</a>`
  );

  line.innerHTML = linked;
  terminal.insertBefore(line, terminal.querySelector(".prompt-line"));
  scrollToBottom();
}


function handleTabCompletion() {
  const value = input.value;

  if (!value.trim()) return;

  const parts = value.split(" ");
  const rawCmd = parts[0];
  const cmd = rawCmd.toLowerCase();
  const rest = parts.slice(1).join(" ");

  // If we're still typing the command name
  if (parts.length === 1) {
    const commandNames = Object.keys(COMMANDS);
    const matches = commandNames.filter(name => name.startsWith(cmd));

    if (matches.length === 0) return;

    if (matches.length === 1) {
      input.value = matches[0] + " ";
      return;
    }

    appendLine(matches.join("   "), "system");
    scrollToBottom();
    return;
  }

  // If command is 'cat', autocomplete filenames
  if (cmd === "cat") {
    const filePartial = (parts[1] || "").toLowerCase();
    const matches = FILE_NAMES.filter(name => name.startsWith(filePartial));

    if (matches.length === 0) return;

    if (matches.length === 1) {
      // rebuild input: "cat <completed>"
      input.value = `cat ${matches[0]}`;
      return;
    }

    appendLine(matches.join("   "), "system");
    scrollToBottom(); 
    return;
  }

  // For other commands with args, do nothing (for now)
  return;
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
  if (value.includes("^C")) return;

  const parts = value.split(" ");
  const cmd = parts[0].toLowerCase();
  const args = parts.slice(1);

  const command = COMMANDS[cmd];

  if (!command) {
    appendLine(`command not found: '${cmd}'`, "error");
    appendLine(`type 'help' to see available commands.`, "system");
    return;
  }

  const output = command.run(args);
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
  // little joke for if user types sudo rm -rf /
  if (event.key === "Enter" && input.value.trim() === "sudo rm -rf /") {
    event.preventDefault();
    appendLine(`visitor@portfolio:~$ sudo rm -rf /`, "command");
    appendLine(`no... please dont not do that`, "error");
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
