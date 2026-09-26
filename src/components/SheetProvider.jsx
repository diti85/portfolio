import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SheetContext, SHEET_IDS, setSheetApi, sheetFor } from "../lib/sheets";
import { scrollToId } from "../lib/scroll";

const EXIT_MS = 650;

const inView = (r) =>
  r && r.width > 0 && r.bottom > 0 && r.right > 0 && r.top < innerHeight && r.left < innerWidth;

// Scroll to an anchor inside a sheet once its (lazily loaded) content exists.
function reach(id, delay) {
  const started = performance.now();
  const attempt = () => {
    const el = document.getElementById(id);
    if (el?.closest("[data-sheet-scroll]")) scrollToId(id);
    else if (performance.now() - started < 6000) setTimeout(attempt, 120);
  };
  setTimeout(attempt, delay);
}

const initialHash = () => (typeof window === "undefined" ? "" : window.location.hash.slice(1));

// Owns which sheet is open and the rectangle it grows from (or shrinks back
// into), and keeps both in step with the address bar: opening pushes #work,
// Back closes it, and a shared #experience link opens straight into it.
export default function SheetProvider({ children }) {
  const [state, setState] = useState(() => ({ id: sheetFor(initialHash()), rect: null }));
  const panels = useRef(new Map());
  const pushed = useRef(false);
  const current = useRef(state.id);
  const origin = useRef(null);

  const registerPanel = useCallback((id, el) => {
    if (el) panels.current.set(id, el);
    else panels.current.delete(id);
  }, []);

  // A sheet's home: its panel when that's on screen, else what it grew from.
  const homeRect = useCallback((id, fallback) => {
    const r = panels.current.get(id)?.getBoundingClientRect();
    if (inView(r)) return r;
    return inView(fallback) ? fallback : null;
  }, []);

  const commit = useCallback((id, rect = null) => {
    current.current = id;
    setState({ id, rect });
  }, []);

  const shut = useCallback(() => {
    const rect = homeRect(current.current, origin.current);
    origin.current = null;
    commit(null, rect);
  }, [commit, homeRect]);

  const close = useCallback(() => {
    if (!current.current) return;
    if (pushed.current) {
      pushed.current = false;
      history.back(); // popstate shuts the sheet
    } else {
      shut();
      history.replaceState(null, "", window.location.pathname);
    }
  }, [shut]);

  const goTo = useCallback(
    (id, originEl) => {
      const sheet = sheetFor(id);
      const open = current.current;

      if (!sheet) {
        // A place on the page: close any sheet first, then travel.
        if (open) {
          close();
          setTimeout(() => scrollToId(id), EXIT_MS);
        } else {
          scrollToId(id);
        }
        return;
      }

      if (!open) {
        const clicked = originEl?.getBoundingClientRect?.() ?? null;
        const rect = homeRect(sheet, clicked) ?? (inView(clicked) ? clicked : null);
        origin.current = rect;
        history.pushState({ sheet }, "", `#${sheet}`);
        pushed.current = true;
        commit(sheet, rect);
      } else if (open !== sheet) {
        history.replaceState({ sheet }, "", `#${sheet}`);
        commit(sheet, null);
      }

      // An anchor inside the sheet: wait for its content, then scroll to it.
      if (id !== sheet) reach(id, open === sheet ? 0 : 900);
    },
    [close, commit, homeRect],
  );

  // Back and forward buttons
  useEffect(() => {
    const onPop = (e) => {
      const sheet = e.state?.sheet ?? null;
      pushed.current = false;
      if (SHEET_IDS.includes(sheet)) commit(sheet);
      else shut();
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [commit, shut]);

  // A shared link opened a sheet on load: record it in history, and reach
  // any anchor it pointed at (#retention lives inside Work).
  useEffect(() => {
    const id = initialHash();
    const sheet = sheetFor(id);
    if (!sheet) return;
    history.replaceState({ sheet }, "", `#${sheet}`);
    if (id !== sheet) reach(id, 900);
  }, []);

  const value = useMemo(
    () => ({ openId: state.id, rect: state.rect, goTo, close, registerPanel }),
    [state, goTo, close, registerPanel],
  );

  useEffect(() => {
    setSheetApi(value);
    return () => setSheetApi(null);
  }, [value]);

  return <SheetContext.Provider value={value}>{children}</SheetContext.Provider>;
}
