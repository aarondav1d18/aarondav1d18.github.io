# portfolioOS

An interactive, terminal-inspired portfolio website built with vanilla HTML, CSS, and JavaScript.

The site mimics a lightweight desktop operating system with draggable windows, a functional terminal, and a virtual file explorer. Visitors can explore projects, experience, and background information either through terminal commands or a graphical file interface.

---

## Features

- Terminal interface with:
  - Command execution
  - Tab completion
  - Inline autocomplete hints
  - Command history (↑ / ↓)
- Virtual file system (`ls`, `cat`, `open`)
- Desktop-style window manager
  - Draggable windows
  - Resizable windows (desktop)
  - Z-order handling
- File explorer with keyboard and mouse navigation
- Mobile-friendly layout with single-tap interactions
- Viewer window for file content
- Zero frameworks, zero build tools

---

## Tech Stack

- HTML5
- CSS3 (no preprocessors)
- Vanilla JavaScript (ES modules)
- No external dependencies

---

## Project Structure

```
.
├── index.html
├── style.css
├── commands.js
├── src/
│ └── js/
│ ├── app.js
│ ├── core/
│ │ ├── windowManager.js
│ │ └── platform.js
│ └── ui/
│ ├── terminal.js
│ ├── files.js
│ └── viewer.js
├── icons/
│ ├── file.png
│ └── folder.png
└── README.md
```


---

## Available Terminal Commands

Some example commands:

```
help
ls
cat about.txt
open projects.txt
clear
exit
```

Tab completion and command history are supported.

---