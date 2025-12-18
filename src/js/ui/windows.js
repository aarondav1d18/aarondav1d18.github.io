import { isMobileUI } from "../lib/mobile.js";

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

export function createWindows() {
  let topZ = 10;

  function bringToFront(win) {
    if (!win) return;
    topZ += 1;
    win.style.zIndex = String(topZ);
  }

  function getWindow(name) {
    return document.querySelector(`.window[data-win="${name}"]`);
  }

  function openWindow(name) {
    const win = getWindow(name);
    if (!win) return null;

    win.dataset.open = "true";
    bringToFront(win);

    if (name === "terminal") {
      const input = document.getElementById("command-input");
      if (input) input.focus();
    }

    return win;
  }

  function closeWindow(name) {
    const win = getWindow(name);
    if (!win) return;
    win.dataset.open = "false";
  }

  function isOpen(name) {
    const win = getWindow(name);
    if (!win) return false;
    return win.dataset.open === "true";
  }

  function enableDragging() {
    if (isMobileUI()) return;

    document.querySelectorAll(".window").forEach((win) => {
      const header = win.querySelector(".window-header");
      if (!header) return;

      let dragging = false;
      let startX = 0;
      let startY = 0;
      let startLeft = 0;
      let startTop = 0;

      header.addEventListener("mousedown", (ev) => {
        dragging = true;
        bringToFront(win);

        const rect = win.getBoundingClientRect();
        startX = ev.clientX;
        startY = ev.clientY;
        startLeft = rect.left;
        startTop = rect.top;

        ev.preventDefault();
      });

      window.addEventListener("mousemove", (ev) => {
        if (!dragging) return;

        const dx = ev.clientX - startX;
        const dy = ev.clientY - startY;

        const newLeft = clamp(startLeft + dx, 0, window.innerWidth - 120);
        const newTop = clamp(startTop + dy, 40, window.innerHeight - 80);

        win.style.left = `${newLeft}px`;
        win.style.top = `${newTop}px`;
      });

      window.addEventListener("mouseup", () => {
        dragging = false;
      });
    });
  }

  function enableResizing() {
    const MIN_W = 320;
    const MIN_H = 220;

    document.querySelectorAll(".window").forEach((win) => {
      const handle = win.querySelector(".window-resizer");
      if (!handle) return;

      let resizing = false;
      let startX = 0;
      let startY = 0;
      let startW = 0;
      let startH = 0;

      function onDown(ev) {
        if (isMobileUI()) return;

        resizing = true;
        bringToFront(win);

        const rect = win.getBoundingClientRect();
        startW = rect.width;
        startH = rect.height;
        startX = ev.clientX;
        startY = ev.clientY;

        ev.preventDefault();
      }

      function onMove(ev) {
        if (!resizing) return;

        const dx = ev.clientX - startX;
        const dy = ev.clientY - startY;

        const rect = win.getBoundingClientRect();
        const maxW = window.innerWidth - rect.left - 8;
        const maxH = window.innerHeight - rect.top - 8;

        const newW = clamp(startW + dx, MIN_W, Math.max(MIN_W, maxW));
        const newH = clamp(startH + dy, MIN_H, Math.max(MIN_H, maxH));

        win.style.width = `${newW}px`;
        win.style.height = `${newH}px`;
      }

      function onUp() {
        resizing = false;
      }

      handle.addEventListener("mousedown", onDown);
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    });
  }

  return {
    bringToFront,
    openWindow,
    closeWindow,
    isOpen,
    enableDragging,
    enableResizing,
    getWindow
  };
}
