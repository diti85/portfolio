import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { createLoom } from "./loom";
import { useVisibility } from "../../lib/useInView";
import { useSheet } from "../../lib/sheets";

export default function LoomCanvas() {
  const canvasRef = useRef(null);
  const loomRef = useRef(null);
  const [failed, setFailed] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    let loom = null;
    try {
      loom = createLoom(canvas, { reducedMotion: !!reduced });
    } catch {
      loom = null;
    }
    if (!loom) {
      setFailed(true);
      return undefined;
    }
    loomRef.current = loom;

    const host = canvas.parentElement;
    const placeHub = () => {
      const { x, y } = loom.hubFraction();
      host.style.setProperty("--hub-x", `${(x * 100).toFixed(1)}%`);
      host.style.setProperty("--hub-y", `${(y * 100).toFixed(1)}%`);
    };
    placeHub();

    const ro = new ResizeObserver(() => {
      loom.resize();
      placeHub();
    });
    ro.observe(canvas);

    const onMove = (e) => loom.setPointer(e.clientX, e.clientY);
    const onLeave = () => loom.clearPointer();
    const onUp = (e) => e.pointerType === "touch" && onLeave();
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerup", onUp);
    document.documentElement.addEventListener("pointerleave", onLeave);
    canvas.addEventListener("webglcontextlost", () => {
      loom.stop();
      setFailed(true);
    });

    return () => {
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      loom.destroy();
      loomRef.current = null;
    };
  }, [reduced]);

  // Run only while on screen and not covered by an open sheet.
  const { openId } = useSheet();
  const visible = useRef(false);
  const covered = useRef(false);
  const sync = useCallback(() => {
    const loom = loomRef.current;
    if (!loom) return;
    if (visible.current && !covered.current) loom.start();
    else loom.stop();
  }, []);
  const onVisible = useCallback(
    (v) => {
      visible.current = v;
      sync();
    },
    [sync],
  );
  useVisibility(canvasRef, onVisible, "0px");
  useEffect(() => {
    covered.current = Boolean(openId);
    sync();
  }, [openId, sync]);

  if (failed) return null;
  return <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 h-full w-full" />;
}
