import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { styles } from "../styles";
import { navLinks } from "../constants";
import { EASE } from "../utils/motion";

const Navbar = () => {
  const [active, setActive] = useState("");
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`${styles.paddingX} w-full flex items-center py-4 fixed top-0 z-20 transition-colors duration-300 ${
        scrolled
          ? "bg-bg/80 backdrop-blur-md border-b border-white/5"
          : "bg-transparent"
      }`}
    >
      <div className="w-full flex items-center justify-between max-w-7xl mx-auto">
        <a
          href="#home"
          className="flex items-center gap-3"
          onClick={() => {
            setActive("");
            window.scrollTo(0, 0);
          }}
        >
          <span className="font-mono text-[14px] font-medium text-accent border border-accent/50 rounded-md px-2 py-1 leading-none">
            EB
          </span>
          <span className="font-display text-heading text-[16px] font-medium hidden sm:block">
            Endrit Basha
          </span>
        </a>

        <ul className="list-none hidden sm:flex flex-row gap-8">
          {navLinks.map((link) => (
            <li key={link.id}>
              <a
                href={`#${link.id}`}
                onClick={() => setActive(link.title)}
                className={`group relative font-mono text-[13px] uppercase tracking-[0.15em] transition-colors ${
                  active === link.title ? "text-heading" : "text-body"
                } hover:text-heading`}
              >
                {link.title}
                <span
                  className={`absolute -bottom-1.5 left-0 h-px bg-accent transition-all duration-300 ${
                    active === link.title ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </a>
            </li>
          ))}
        </ul>

        <button
          type="button"
          aria-label="Toggle menu"
          onClick={() => setOpen(!open)}
          className="sm:hidden flex flex-col justify-center gap-1.5 w-8 h-8 z-30"
        >
          <span
            className={`block h-px bg-heading transition-transform ${
              open ? "rotate-45 translate-y-[3.5px]" : ""
            }`}
          />
          <span
            className={`block h-px bg-heading transition-transform ${
              open ? "-rotate-45 -translate-y-[3.5px]" : ""
            }`}
          />
        </button>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="sm:hidden fixed inset-0 bg-bg/95 backdrop-blur-lg z-20 flex items-center justify-center"
            >
              <ul className="list-none flex flex-col items-center gap-8">
                {navLinks.map((link, i) => (
                  <motion.li
                    key={link.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.08, ease: EASE }}
                  >
                    <a
                      href={`#${link.id}`}
                      onClick={() => {
                        setActive(link.title);
                        setOpen(false);
                      }}
                      className="font-display text-heading text-[28px] font-medium"
                    >
                      {link.title}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
