import { useCallback, useEffect, useState } from "react";
import { MotionConfig, useReducedMotion } from "motion/react";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import About from "./components/About";
import Explore from "./components/Explore";
import Sheet from "./components/Sheet";
import SheetProvider from "./components/SheetProvider";
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
    <SheetProvider>
      <MotionConfig reducedMotion="user">
        <a
          href="#about"
          className="fixed left-4 top-3 z-[100] -translate-y-20 rounded-full bg-gilt px-4 py-2 text-sm text-lacquer focus:translate-y-0"
        >
          Skip to content
        </a>
        {/* the page; made inert while a sheet is open */}
        <div data-page>
          <Nav onOpenPalette={() => setPalette(true)} />
          <main>
            <Hero />
            <About />
            <Explore />
            <Contact />
          </main>
          <Footer />
        </div>
        <Sheet />
        <CommandPalette open={palette} onClose={closePalette} />
        <Cursor />
        <div className="grain" aria-hidden="true" />
      </MotionConfig>
    </SheetProvider>
  );
}
