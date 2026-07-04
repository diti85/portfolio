import { motion } from "framer-motion";
import { technologies } from "../constants";
import { fadeUp } from "../utils/motion";
import { SectionWrapper } from "../hoc";
import SectionHeader from "./SectionHeader";

const Tech = () => {
  return (
    <>
      <SectionHeader eyebrow="03 — Stack" title="Tools I work with" />

      <div className="mt-12 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 sm:gap-4">
        {technologies.map((tech, index) => (
          <motion.div
            key={tech.name}
            variants={fadeUp(index * 0.04)}
            className="group flex flex-col items-center justify-center gap-3 bg-surface border border-white/5 hover:border-accent/40 rounded-xl py-6 transition-colors duration-300"
          >
            <img
              src={tech.icon}
              alt={tech.name}
              className="w-10 h-10 object-contain opacity-80 group-hover:opacity-100 transition-opacity"
            />
            <span className="font-mono text-[11px] text-body group-hover:text-heading transition-colors">
              {tech.name}
            </span>
          </motion.div>
        ))}
      </div>
    </>
  );
};

export default SectionWrapper(Tech, "");
