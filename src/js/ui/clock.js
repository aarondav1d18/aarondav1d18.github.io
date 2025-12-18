export function startClock() {
  const clock = document.getElementById("clock");
  if (!clock) return;

  function tick() {
    const now = new Date();
    clock.textContent = now.toLocaleString(undefined, {
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit"
    });
  }

  tick();
  setInterval(tick, 1000);
}
