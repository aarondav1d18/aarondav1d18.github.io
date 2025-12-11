const terminal = document.getElementById("terminal");
const input = document.getElementById("command-input");

const COMMANDS = {
  help: {
    description: "List available commands",
    run: () => [
      "available commands:",
      "  about      show who you are",
      "  skills     list technical skills",
      "  projects   show selected projects",
      "  ugracing   show UGRacing driverless roles",
      "  contact    how to reach you",
      "  clear      clear the screen",
      "  experience show work & leadership experience",
      "  education  show education history",
      "  achievements show awards, demos, and competitions",
      "  help       show this help message",
      "",
    ]
  },

  about: {
    description: "About me section",
    run: () => [
      "about:",
      "  name: Aaron David",
      "  role: Computer Science BSc Student @ University of Glasgow",
      "        Head Software Engineer @ UGRacing Driverless",
      "  location: Glasgow, Scotland",
      "  languages: Python · C++ · C · Java · Bash · HTML · CSS",
      "",
      "  summary: Computer Science student focused on autonomous racing systems,",
      "           SLAM, and path planning on UGRacing's driverless Formula",
      "           Student team, with experience leading a 90k-line C++/Python",
      "           codebase and mentoring junior developers.",
    ]
  },

  achievements: {
    description: "Awards, demos, and competitions",
    run: () => [
      "achievements:",
      "",
      "  Driverless Branch Award",
      "    recognised for key technical contributions to path planning",
      "    and localisation on UGRacing's autonomous systems.",
      "",
      "  Technical demos & representation (2024–present)",
      "    - Delivered hands-on driverless system demos at university open days.",
      "    - Represented UGRacing at the CENSIS Tech Summit.",
      "    - Presented autonomous systems at Formula Student UK (Silverstone).",
      "",
      "  competitions:",
      "    - Formula Student UK (FSUK), Silverstone — autonomous systems track.",
      "       3rd place (2024)",
      "       3rd place (2025)",
      "       hopefully 3rd place (2026)",
      ""
    ]
  },
  

  education: {
    description: "Education history",
    run: () => [
      "education:",
      "",
      "  University of Glasgow — BSc Computer Science",
      "    2023–2027",
      "    focus: systems, software engineering, and autonomous systems",
      "",
      "  Bryntirion Comprehensive School — A-Levels",
      "    2021–2023",
      "    computer science · mathematics · physics (AAB)",
      ""
    ]
  },
  
  skills: {
    description: "Technical categories",
    run: () => [
      "skills:",
      "",
      "  languages:",
      "    python · c++ · c · java · bash · html · css",
      "",
      "  libraries / frameworks:",
      "    numpy · scipy · matplotlib · pandas · eigen",
      "    django · ros2",
      "",
      "  tools & platforms:",
      "    git · linux · cmake · make · docker · gdb · callgrind",
      "    vscode · rviz · gazebo",
      "",
      "  practices:",
      "    tdd · ci/cd · code reviews · simulation testing",
      "    feature branching · modular architecture",
      "",
      "  domains:",
      "    autonomous racing · slam · localisation · path planning",
      "    simulation-based testing and real-time systems",
    ]
  },

  ugracing: {
    description: "UGRacing Driverless",
    run: () => [
      "projects: UGRacing Driverless",
      "",
      "  [1] Head Software Engineer (2025–2026)",
      "      team: 30 developers across Perception · Path Planning · Simulation",
      "      role:",
      "        - Led development across a 90k-line C++/Python autonomous systems codebase.",
      "        - Guided technical direction for three subteams and ensured system integration.",
      "        - Developed a custom Graph SLAM system (C++/ROS2) including:",
      "            · Mahalanobis data association",
      "            · EKF-style landmark updates",
      "            · Sparse pose graph optimisation (Gauss-Newton + Cholesky)",
      "            · Loop closure detection and map recentring",
      "        - Delivered onboarding workshops, robot demos, and technical training sessions.",
      "      stack:",
      "        Python · C++ · Bash · ROS2 · NumPy · SciPy · Eigen · Gazebo · Docker · Git · CMake · Linux",
      "",
      "  [2] Head of Path Planning (2024–2025)",
      "      role:",
      "        - Led the Path Planning team through core redesigns and system integration.",
      "        - Implemented a custom NURBS-based path planner replacing the legacy approach:",
      "            · Reduced average runtime from 2.77 s → 0.49 s across 100 simulations.",
      "            · Generated smooth racing lines from noisy cone detections.",
      "        - Developed a cone ordering module using geometric heuristics, checks,",
      "          and neighbour analysis to enable reliable planning.",
      "      stack:",
      "        Python · C++ · ROS2 · NumPy · SciPy",
      "",
      "  [3] Path Planning Engineer (2023–2024)",
      "      role:",
      "        - Developed global and local racing lines for autonomous navigation.",
      "        - Improved the consistency of path generation under sparse/noisy cone environments.",
      "      stack:",
      "        Python · C++ · NumPy · Eigen",
      ""
    ]
  },

  projects: {
    description: "Selected technical projects",
    run: () => [
      "projects:",
      "",
      "  [1] Graph SLAM for Localisation and Mapping (C++, ROS2)",
      "      summary: Full SLAM system estimating vehicle pose and mapping",
      "               features in real time with EKF-style updates and a",
      "               sparse pose graph.",
      "      highlights:",
      "        - Mahalanobis distance data association",
      "        - Gauss-Newton optimisation with sparse Cholesky factorisation",
      "        - Loop closure detection and map recentring",
      "",
      "  [2] Primary Path Planner for Autonomous Racing (Python, ROS2)",
      "      summary: Custom NURBS-based planner replacing legacy Delaunay +",
      "               beam search pipeline for cone-based tracks.",
      "      highlights:",
      "        - Reduced avg runtime: 2.77 s → 0.49 s across 100 simulations",
      "        - Generates smooth, confidence-weighted paths from noisy cones",
      "        - Retains legacy system as a fallback in sparse scenarios",
      "",
      "  [3] Cone Ordering System (Python, ROS2)",
      "      summary: Preprocessing module to order unordered cone detections",
      "               into a consistent structure for planning.",
      "      highlights:",
      "        - Geometric heuristics, intersection checks, neighbour detection",
      "        - Integrated with NURBS planner and validated in simulation",
      "",
      "  [4] UGRacing Driverless (see 'ugracing')",
      "      summary: Long-term role progression from Path Planning Engineer",
      "               to Head of Path Planning to Head Software Engineer.",
      ""
    ]
  },

  contact: {
    description: "Contact section",
    run: () => [
      "contact:",
      "  email: aarondavid1805@gmail.com",
      "  github: https://github.com/aarondav1d18",
      "  linkedin: https://www.linkedin.com/in/aarondav1d",
      "",
      "  open to: internships · student roles · technical collaboration",
    ]
  },

  experience: {
    description: "Work & leadership experience",
    run: () => [
      "experience:",
      "",
      "  UGRacing Driverless — University of Glasgow",
      "    Path Planning Engineer → Head of Path Planning → Head Software Engineer",
      "    2023–present",
      "      - Led development of autonomous race car software (C++/Python, ROS2).",
      "      - Managed 3 subteams: Perception · Path Planning · Simulation.",
      "      - Mentored juniors and ran onboarding workshops.",
      "",
      "  Home Bargains — Store Assistant",
      "    2022–2023",
      "      - Customer service, stock management, and training new hires.",
      ""
    ]
  },
  
  clear: {
    description: "Clear the terminal output",
    run: () => {
      clearOutput();
      return [];
    }
  }
};

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
