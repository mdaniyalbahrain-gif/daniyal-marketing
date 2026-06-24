import { useEffect, useState } from "react";

export function PremiumEffects() {
  const [cursor, setCursor] = useState({ x: -100, y: -100, hover: false, down: false });
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)").matches;

    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0);
    };

    const onMove = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null;
      const interactive = target?.closest("a,button,input,textarea,select,[role='button'],.tilt-card");
      setCursor((prev) => ({ ...prev, x: event.clientX, y: event.clientY, hover: Boolean(interactive) }));

      const card = target?.closest<HTMLElement>(".tilt-card");
      if (card && finePointer) {
        const rect = card.getBoundingClientRect();
        const px = (event.clientX - rect.left) / rect.width - 0.5;
        const py = (event.clientY - rect.top) / rect.height - 0.5;
        card.style.setProperty("--tilt-x", `${(-py * 7).toFixed(2)}deg`);
        card.style.setProperty("--tilt-y", `${(px * 7).toFixed(2)}deg`);
      }
    };

    const clearTilt = (event: PointerEvent) => {
      const card = (event.target as HTMLElement | null)?.closest<HTMLElement>(".tilt-card");
      card?.style.setProperty("--tilt-x", "0deg");
      card?.style.setProperty("--tilt-y", "0deg");
    };

    const onDown = () => setCursor((prev) => ({ ...prev, down: true }));
    const onUp = () => setCursor((prev) => ({ ...prev, down: false }));

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerout", clearTilt, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerout", clearTilt);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, []);

  return (
    <>
      <div className="scroll-progress" style={{ transform: `scaleX(${progress / 100})` }} />
      <div className={`custom-cursor-dot ${cursor.hover ? "is-hover" : ""} ${cursor.down ? "is-down" : ""}`} style={{ left: cursor.x, top: cursor.y }} />
      <div className={`custom-cursor-ring ${cursor.hover ? "is-hover" : ""} ${cursor.down ? "is-down" : ""}`} style={{ left: cursor.x, top: cursor.y }} />
    </>
  );
}