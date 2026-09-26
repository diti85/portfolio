import { useEffect, useState } from "react";
import Lenis from "lenis";

let lenis = null;
let locks = 0;

export function startSmoothScroll() {
  if (lenis) return lenis;
  // Anchor clicks are routed by goTo() (lib/sheets.jsx), not by Lenis.
  lenis = new Lenis({ autoRaf: true, lerp: 0.11, anchors: false });
  if (locks > 0) lenis.stop();
  return lenis;
}

export function stopSmoothScroll() {
  lenis?.destroy();
  lenis = null;
}

function applyLock() {
  const locked = locks > 0;
  if (lenis) {
    if (locked) lenis.stop();
    else lenis.start();
  }
  document.documentElement.style.overflow = locked ? "hidden" : "";
}

// Locks nest: a case study opened inside a sheet keeps the page locked when
// it closes, because the sheet still holds its own lock.
export function lockScroll(locked) {
  locks = Math.max(0, locks + (locked ? 1 : -1));
  applyLock();
}

export function releaseAllScrollLocks() {
  locks = 0;
  applyLock();
}

export function scrollToId(id) {
  const el = id === "top" ? 0 : document.getElementById(id);
  if (el === null) return;

  // Inside an open sheet, scroll the sheet rather than the page.
  if (el !== 0 && el.closest("[data-sheet-scroll]")) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }

  // Navigating the page releases locks left behind by closing menus.
  releaseAllScrollLocks();
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
