import { useCallback, useEffect, useState } from "react";
import { MotionConfig, useReducedMotion } from "motion/react";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Pipeline from "./components/Pipeline";
import Lineage from "./components/Lineage";
import Projects from "./components/Projects";
import Experience from "./components/Experience";
import About from "./components/About";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import CommandPalette from "./components/CommandPalette";
import Cursor from "./components/Cursor";
import { startSmoothScroll, stopSmoothScroll } from "./lib/scroll";

export default function App() {
  const reduced = useReducedMotion();
  const [palette, setPalette] = useState(false);
  const closePalette = useCallback(() => setPalette(false), []);

  useEffect(() => {
    if (reduced) return undefined;
    startSmoothScroll();
    return stopSmoothScroll;
  }, [reduced]);

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPalette((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <a
        href="#systems"
        className="fixed left-4 top-3 z-[100] -translate-y-20 rounded-full bg-gilt px-4 py-2 text-sm text-lacquer focus:translate-y-0"
      >
        Skip to content
      </a>
      <Nav onOpenPalette={() => setPalette(true)} />
      <main>
        <Hero />
        <Pipeline />
        <Lineage />
        <Projects />
        <Experience />
        <About />
        <Contact />
      </main>
      <Footer />
      <CommandPalette open={palette} onClose={closePalette} />
      <Cursor />
      <div className="grain" aria-hidden="true" />
    </MotionConfig>
  );
}
