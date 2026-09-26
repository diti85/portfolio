import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { useMediaQuery } from "../lib/useInView";

// A brass ring that trails the pointer and names the action under it
// ("Open", "Break", …) wherever an element sets data-cursor.
export default function Cursor() {
  const fine = useMediaQuery("(hover: hover) and (pointer: fine)");
  const reduced = useReducedMotion();
  const ringRef = useRef(null);
  const [labelText, setLabelText] = useState("");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!fine || reduced) return undefined;
    const ring = ringRef.current;
    const target = { x: -100, y: -100 };
    const pos = { x: -100, y: -100 };
    let raf = 0;
    let hot = false;

    const inspect = (node) => {
      const el = node?.closest?.("[data-cursor], a, button, input, textarea, [role='option']");
      const label = el?.dataset?.cursor ?? "";
      const text = el?.matches?.("input, textarea");
      hot = !!el && !text;
      ring.dataset.state = label ? "label" : hot ? "hot" : text ? "text" : "idle";
      setLabelText(label);
    };
    const onMove = (e) => {
      target.x = e.clientX;
      target.y = e.clientY;
      setVisible(true);
      inspect(e.target);
    };
    // Content moves under a still pointer while scrolling; re-check what's there.
    const onScroll = () => inspect(document.elementFromPoint(target.x, target.y));
    const onLeave = () => setVisible(false);
    const loop = () => {
      pos.x += (target.x - pos.x) * 0.2;
      pos.y += (target.y - pos.y) * 0.2;
      ring.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [fine, reduced]);

  if (!fine || reduced) return null;

  return (
    <div
      ref={ringRef}
      aria-hidden="true"
      data-state="idle"
      className={`cursor-ring pointer-events-none fixed left-0 top-0 z-[90] transition-opacity duration-300 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <span className="cursor-ring__body">
        <span className="cursor-ring__label">{labelText}</span>
      </span>
    </div>
  );
}
