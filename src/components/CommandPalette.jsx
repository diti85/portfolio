import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { nav, profile, projects } from "../data/content";
import { lockScroll } from "../lib/scroll";
import { goTo } from "../lib/sheets";

const EASE = [0.22, 1, 0.36, 1];

// Case- and accent-insensitive, so "resume" finds "résumé".
const fold = (text) =>
  text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();

function useCommands(close) {
  return useMemo(() => {
    const open = (url) => () => window.open(url, "_blank", "noopener,noreferrer");
    return [
      ...nav.map((n) => ({
        group: "Go to",
        label: n.label,
        hint: n.hint,
        run: () => goTo(n.id),
      })),
      {
        group: "Contact",
        label: "Copy email address",
        hint: profile.email,
        run: async () => {
          try {
            await navigator.clipboard.writeText(profile.email);
          } catch {
            window.location.href = `mailto:${profile.email}`;
          }
        },
      },
      {
        group: "Contact",
        label: "Write an email",
        hint: profile.email,
        run: () => (window.location.href = `mailto:${profile.email}`),
      },
      { group: "Contact", label: "Open LinkedIn", run: open(profile.links.linkedin) },
      { group: "Contact", label: "Open GitHub", run: open(profile.links.github) },
      { group: "Contact", label: "Download résumé", hint: "PDF", run: open(profile.resume) },
      ...projects
        .filter((p) => p.url)
        .map((p) => ({
          group: "Projects",
          label: `Visit ${p.name}`,
          hint: p.urlLabel,
          run: open(p.url),
        })),
    ].map((c) => ({ ...c, run: () => (close(), c.run()) }));
  }, [close]);
}

export default function CommandPalette({ open, onClose }) {
  return <AnimatePresence>{open && <Palette onClose={onClose} />}</AnimatePresence>;
}

// Mounted only while open, so every opening starts with a fresh query.
function Palette({ onClose }) {
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);
  const inputRef = useRef(null);
  const commands = useCommands(onClose);

  const results = useMemo(() => {
    const q = fold(query.trim());
    if (!q) return commands;
    return commands.filter((c) => fold(`${c.group} ${c.label} ${c.hint ?? ""}`).includes(q));
  }, [commands, query]);

  useEffect(() => {
    const previous = document.activeElement;
    lockScroll(true);
    requestAnimationFrame(() => inputRef.current?.focus());
    return () => {
      lockScroll(false);
      previous?.focus?.({ preventScroll: true });
    };
  }, []);

  const onKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setIndex((i) => Math.min(results.length - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setIndex((i) => Math.max(0, i - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      results[index]?.run();
    } else if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    } else if (e.key === "Tab") {
      e.preventDefault();
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-[80] flex items-start justify-center px-4 pt-[14vh]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      <button
        type="button"
        tabIndex={-1}
        aria-label="Close command menu"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-lacquer-deep/70 backdrop-blur-sm"
      />
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label="Command menu"
        data-nested-dialog
        data-lenis-prevent
        initial={{ opacity: 0, y: -10, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -6, scale: 0.99 }}
        transition={{ duration: 0.35, ease: EASE }}
        className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-brass/25 bg-felt shadow-[0_40px_120px_-20px_rgba(0,0,0,0.7)]"
      >
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIndex(0);
          }}
          onKeyDown={onKeyDown}
          role="combobox"
          aria-expanded="true"
          aria-controls="palette-list"
          aria-activedescendant={results[index] ? `cmd-${index}` : undefined}
          placeholder="Where to?"
          className="w-full border-b border-bone/10 bg-transparent px-5 py-4 text-lg text-bone placeholder:text-moss focus:outline-none"
        />
        <ul id="palette-list" role="listbox" className="max-h-[52vh] overflow-y-auto p-2">
          {results.length === 0 && (
            <li className="px-3 py-6 text-center text-sm text-moss">
              No matches. Try “email” or “résumé”.
            </li>
          )}
          {results.map((c, i) => {
            const header = i === 0 || results[i - 1].group !== c.group ? c.group : null;
            return (
              <li key={`${c.group}-${c.label}`} role="presentation">
                {header && <p className="px-3 pb-1 pt-3 text-2xs text-moss">{header}</p>}
                <div
                  id={`cmd-${i}`}
                  role="option"
                  aria-selected={i === index}
                  onPointerMove={() => setIndex(i)}
                  onClick={c.run}
                  className={`flex cursor-pointer items-center justify-between gap-4 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                    i === index ? "bg-lacquer text-bone" : "text-sage"
                  }`}
                >
                  <span>{c.label}</span>
                  {c.hint && <span className="truncate text-xs text-moss">{c.hint}</span>}
                </div>
              </li>
            );
          })}
        </ul>
        <p className="flex gap-4 border-t border-bone/10 px-5 py-3 text-2xs text-moss">
          <span>↑↓ to move</span>
          <span>Enter to choose</span>
          <span>Esc to close</span>
        </p>
      </motion.div>
    </motion.div>
  );
}
