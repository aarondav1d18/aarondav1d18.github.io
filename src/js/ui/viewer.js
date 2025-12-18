export function createViewer() {
  const titleEl = document.getElementById("viewer-title");
  const bodyEl = document.getElementById("viewer-body");

  function setViewer(title, lines) {
    if (titleEl) titleEl.textContent = title;

    if (bodyEl) {
      if (Array.isArray(lines)) bodyEl.textContent = lines.join("\n");
      else bodyEl.textContent = String(lines || "");
    }
  }

  return { setViewer };
}
