import { motion } from "framer-motion";
import { fadeUp } from "../utils/motion";
import { SectionWrapper } from "../hoc";
import SectionHeader from "./SectionHeader";

const About = () => {
  return (
    <>
      <SectionHeader eyebrow="01 — About" title="Overview" />

      <div className="mt-10 grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-16">
        <motion.p
          variants={fadeUp(0.1)}
          className="lg:col-span-3 font-display text-heading text-[22px] sm:text-[28px] leading-snug font-medium"
        >
          I turn complex problems into reliable, elegant software &mdash; from
          data platforms processing tens of millions of messages a day to
          interfaces people actually enjoy using.
        </motion.p>

        <div className="lg:col-span-2 flex flex-col gap-6">
          <motion.p variants={fadeUp(0.2)} className="text-body text-[15px] leading-relaxed">
            I&apos;m a software engineer on GEICO&apos;s Data Engineering team,
            where I design distributed ingestion pipelines, observability
            tooling, and the Go services that keep them fast and
            fault-tolerant. I care about clean architecture, performance under
            real load, and shipping things that hold up in production &mdash;
            and I&apos;m currently pursuing my M.S. in Computer Science at
            UIUC.
          </motion.p>

          <motion.div
            variants={fadeUp(0.3)}
            className="font-mono text-[13px] bg-surface border border-white/5 rounded-xl p-5 flex flex-col gap-2.5"
          >
            <p>
              <span className="text-accent">role</span>
              <span className="text-body"> — Software Engineer II @ GEICO</span>
            </p>
            <p>
              <span className="text-accent">focus</span>
              <span className="text-body"> — Go · distributed data systems · cloud</span>
            </p>
            <p>
              <span className="text-accent">education</span>
              <span className="text-body"> — M.S. CS @ UIUC (in progress)</span>
            </p>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default SectionWrapper(About, "about");
