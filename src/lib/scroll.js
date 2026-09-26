import { useEffect, useState } from "react";
import Lenis from "lenis";

let lenis = null;

export function startSmoothScroll() {
  if (lenis) return lenis;
  lenis = new Lenis({ autoRaf: true, lerp: 0.11, anchors: true });
  return lenis;
}

export function stopSmoothScroll() {
  lenis?.destroy();
  lenis = null;
}

export function lockScroll(locked) {
  if (lenis) {
    if (locked) lenis.stop();
    else lenis.start();
  }
  document.documentElement.style.overflow = locked ? "hidden" : "";
}

export function scrollToId(id) {
  // Navigating always releases a lock left by a closing menu or palette;
  // a stopped Lenis ignores scrollTo, and overflow: clip blocks it outright.
  lockScroll(false);
  const el = id === "top" ? 0 : document.getElementById(id);
  if (el === null) return;
  if (lenis) {
    lenis.scrollTo(el, { duration: 1.4 });
  } else if (el === 0) {
    window.scrollTo({ top: 0, behavior: "smooth" });
  } else {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  history.replaceState(null, "", id === "top" ? window.location.pathname : `#${id}`);
}

// Which of the given section ids is currently under the reading line.
export function useActiveSection(ids) {
  const [active, setActive] = useState(null);
  useEffect(() => {
    const seen = new Map();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) seen.set(e.target.id, e.isIntersecting);
        const hit = ids.find((id) => seen.get(id));
        setActive(hit ?? null);
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [ids]);
  return active;
}
