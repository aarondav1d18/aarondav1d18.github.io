import { FILE_MAP, FILE_NAMES } from "./filesystem.js";

export function createCommands(api) {
  const COMMANDS = {
    sudo: {
      description: "execute a command as superuser (not really)",
      run: () => [
        "You dont have sudo privileges here.",
        "This will be reported to the system administrator.",
        ""
      ]
    },

    help: {
      description: "List available commands",
      run: () => [
        "available commands:",
        "",
        "  core:",
        "    about      detailed about section",
        "    bio        short personal summary",
        "    whoami     identity info",
        "    skills     technical skills & domains",
        "    stack      core robotics / dev stack",
        "    projects   selected technical projects",
        "    ugracing   UGRacing driverless roles",
        "    contact    how to reach me",
        "    links      external profiles & cv link",
        "",
        "  background:",
        "    experience work & leadership experience",
        "    education  education history",
        "    achievements awards, demos, competitions",
        "    demos      public demos & outreach",
        "    fsuk       formula student uk results",
        "",
        "  fun:",
        "    ascii      tiny ascii banner",
        "",
        "  system:",
        "    ls         list virtual files",
        "    cat        read a virtual file",
        "    open       open a virtual file in the viewer",
        "    clear      clear the screen",
        "    help       show this help message",
        "",
        "Tip: You can use tab-completion for commands and filenames!"
      ]
    },

    ls: {
      description: "list virtual files",
      run: () => [
        ".",
        "..",
        ...FILE_NAMES,
        ""
      ]
    },

    cat: {
      description: "display a virtual file",
      run: (args = []) => {
        const file = (args[0] || "").toLowerCase();

        if (!file) {
          return ["usage: cat <filename>", "try: cat about.txt", ""];
        }

        if (FILE_MAP[file]) {
          const cmdName = FILE_MAP[file];
          const target = COMMANDS[cmdName];
          if (!target) return [`cat: ${file}: mapped command '${cmdName}' not found`, ""];
          return target.run();
        }

        return [`cat: ${file}: no such file`, ""];
      }
    },

    open: {
      description: "open a virtual file in the viewer",
      run: (args = []) => {
        const file = (args[0] || "").toLowerCase();

        if (!file) return ["usage: open <filename>", "try: open about.txt", ""];
        if (!FILE_MAP[file]) return [`open: ${file}: no such file`, ""];

        api.openVirtualFile(file);
        return [`opened ${file}`, ""];
      }
    },

    clear: {
      description: "Clear the terminal output",
      run: () => {
        api.clearOutput();
        return [];
      }
    },

    exit: {
      description: "close the terminal",
      run: () => {
        setTimeout(() => api.closeWindow("terminal"), 200);
        return ["logout", "connection closed.", ""];
      }
    },

    logout: { run: () => COMMANDS.exit.run() },
    quit: { run: () => COMMANDS.exit.run() },

    // ---- content commands (unchanged) ----

    vim: {
      description: "opens vim (allegedly)",
      run: () => ["vim?", "really??", "", "no... I dont think so. Try nano instead.", ""]
    },

    nano: {
      description: "opens nano (not really)",
      run: () => ["nano?", "still no...", "", "this is only a portfolio website :)", ""]
    },

    whoami: {
      description: "show identity info",
      run: () => [
        "whoami:",
        "  aaron david",
        "  cs student · autonomous systems developer",
        "  specialising in slam, planning, and robotics software",
        "  currently: head software engineer @ ugracing driverless",
        ""
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
        "           Student team, with experience leading a large C++/Python",
        "           codebase and mentoring new recruits."
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

    bio: {
      description: "Short personal summary",
      run: () => [
        "bio:",
        "  computer science student at the university of glasgow.",
        "  building autonomous systems · specialising in SLAM + planning.",
        "  head software engineer for UGRacing's driverless team.",
        "  interested in robotics, optimisation, simulation, and high-performance code.",
        ""
      ]
    },

    stack: {
      description: "My core development stack",
      run: () => [
        "stack:",
        "  robotics: ros2 · rviz · foxglove · zed sdk",
        "  programming: python · c++ · bash",
        "  math & optimisation: numpy · scipy · eigen",
        "  devops: docker · cmake · git · gdb · callgrind",
        "  simulation: gazebo · custom tooling · CARLA",
        ""
      ]
    },

    links: {
      description: "Useful external links",
      run: () => [
        "links:",
        "  github:   https://github.com/aarondav1d18",
        "  linkedin: https://www.linkedin.com/in/aarondav1d",
        ""
      ]
    },

    fsuk: {
      description: "Formula Student UK results",
      run: () => [
        "fsuk:",
        "  2024: 3rd place — autonomous class",
        "  2025: 3rd place — autonomous class",
        "  2026: ??? place — we manifest greatness",
        ""
      ]
    },

    ascii: {
      description: "Print tiny ascii banner",
      run: () => [
        "    /\\                          ",
        "   /  \\   __ _ _ __ ___  _ __  ",
        "  / /\\ \\ / _` | '__/ _ \\| '_ \\ ",
        " / ____ \\ (_| | | | (_) | | | |",
        "/_/    \\_\\__,_|_|  \\___/|_| |_|",
        "\"aaron david — student, autonomy, slam, path planning\",",
        ""
      ]
    },

    demos: {
      description: "Public demos & outreach",
      run: () => [
        "demos:",
        "  - open day autonomous system demos",
        "  - representation at the CENSIS tech summit",
        "  - fsuk presentations & technical briefings",
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
        "    vscode · rviz · gazebo · ZED SDK · Foxglove",
        "",
        "  practices:",
        "    tdd · ci/cd · code reviews · simulation testing",
        "    feature branching · modular architecture",
        "",
        "  domains:",
        "    autonomous racing · slam · localisation · path planning",
        "    simulation-based testing and real-time systems"
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
        "",
        "  [2] Primary Path Planner for Autonomous Racing (Python, ROS2)",
        "      summary: Custom NURBS-based planner replacing legacy Delaunay +",
        "               beam search pipeline for cone-based tracks.",
        "",
        "  [3] Cone Ordering System (Python, ROS2)",
        "      summary: Preprocessing module to order unordered cone detections",
        "               into a consistent structure for planning.",
        "",
        "  [4] Personal Portfolio Website (HTML, CSS, JS)",
        "      summary: This very website! A terminal-style interactive portfolio",
        "               built with vanilla JS, HTML, and CSS.",
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
        "  open to: internships · student roles · technical collaboration"
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
        "      - Mentored new recruits and ran onboarding workshops.",
        "",
        "  Home Bargains — Store Assistant",
        "    2022–2023",
        "      - Customer service, stock management, and training new hires.",
        ""
      ]
    }
  };

  return COMMANDS;
}
