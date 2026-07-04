import { Suspense } from "react";
import { motion } from "framer-motion";
import { styles } from "../styles";
import { fadeUp, staggerContainer } from "../utils/motion";
import { EmberFieldCanvas } from "./canvas";

const Hero = () => {
  return (
    <section id="home" className="relative w-full h-screen overflow-hidden hero-glow">
      <Suspense fallback={null}>
        <EmberFieldCanvas />
      </Suspense>

      <div
        className={`relative z-10 max-w-7xl mx-auto h-full flex flex-col justify-center ${styles.paddingX} pointer-events-none`}
      >
        <motion.div
          variants={staggerContainer(0.12, 0.2)}
          initial="hidden"
          animate="show"
          className="flex flex-col items-start gap-5"
        >
          <motion.p variants={fadeUp()} className={styles.sectionSubText}>
            <span className="signal-dot" />
            Software Engineer II @ GEICO
          </motion.p>

          <motion.h1 variants={fadeUp()} className={styles.heroHeadText}>
            Endrit Basha<span className="text-accent">.</span>
          </motion.h1>

          <motion.p variants={fadeUp()} className={styles.heroSubText}>
            I build resilient Go services and polished React applications
            &mdash; engineering insurance products used by millions.
          </motion.p>

          <motion.div variants={fadeUp()} className="mt-4 flex gap-4 pointer-events-auto">
            <a
              href="#work"
              className="font-mono text-[14px] px-6 py-3 rounded-lg bg-accent/10 border border-accent/60 text-heading hover:bg-accent/20 transition-colors"
            >
              View Work
            </a>
            <a
              href="#contact"
              className="font-mono text-[14px] px-6 py-3 rounded-lg border border-white/15 text-body hover:border-white/40 hover:text-heading transition-colors"
            >
              Get in Touch
            </a>
          </motion.div>
        </motion.div>
      </div>

      <div className="absolute bottom-10 w-full flex justify-center z-10">
        <a href="#about" aria-label="Scroll to about section">
          <motion.div
            animate={{ y: [0, 10, 0], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-px h-12 bg-gradient-to-b from-transparent via-accent to-transparent"
          />
        </a>
      </div>
    </section>
  );
};

export default Hero;
