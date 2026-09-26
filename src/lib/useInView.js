import { useEffect, useState } from "react";

// Runs `onChange(visible)` whenever the element enters or leaves the viewport.
// Used to pause canvases that are scrolled out of sight. (Hidden tabs need no
// handling here: browsers already stop requestAnimationFrame for them.)
export function useVisibility(ref, onChange, rootMargin = "100px") {
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(([entry]) => onChange(entry.isIntersecting), {
      rootMargin,
    });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, onChange, rootMargin]);
}

export function useMediaQuery(query) {
  const [match, setMatch] = useState(() =>
    typeof window === "undefined" ? false : window.matchMedia(query).matches,
  );
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setMatch(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, [query]);
  return match;
}
