import { motion } from "framer-motion";
import { experiences } from "../constants";
import { fadeUp, EASE } from "../utils/motion";
import { SectionWrapper } from "../hoc";
import SectionHeader from "./SectionHeader";

const ExperienceCard = ({ experience, index }) => (
  <motion.div variants={fadeUp(index * 0.06)} className="relative pl-14 sm:pl-20 pb-14 last:pb-0">
    <span className="absolute left-[11px] top-1.5 w-[10px] h-[10px] rounded-full bg-accent shadow-[0_0_12px_rgba(255,59,59,0.8)]" />

    <div className="flex items-center gap-4">
      <span className="w-12 h-12 rounded-lg bg-surface border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
        {experience.icon ? (
          <img
            src={experience.icon}
            alt={experience.company_name}
            className="w-8 h-8 object-contain"
          />
        ) : (
          <span className="font-mono text-[18px] font-medium text-accent">
            {experience.abbr}
          </span>
        )}
      </span>
      <div>
        <p className="font-mono text-[12px] text-accent tracking-[0.15em] uppercase">
          {experience.date}
        </p>
        <h3 className="font-display text-heading text-[20px] sm:text-[24px] font-bold leading-tight mt-0.5">
          {experience.title}
        </h3>
        <p className="text-body text-[14px]">{experience.company_name}</p>
      </div>
    </div>

    {experience.points.length > 0 && (
      <ul className="mt-4 flex flex-col gap-2">
        {experience.points.map((point, i) => (
          <li
            key={`exp-${index}-point-${i}`}
            className="text-body text-[14px] leading-relaxed pl-4 relative before:content-[''] before:absolute before:left-0 before:top-[9px] before:w-1.5 before:h-px before:bg-accent/70"
          >
            {point}
          </li>
        ))}
      </ul>
    )}
  </motion.div>
);

const Experience = () => {
  return (
    <>
      <SectionHeader eyebrow="02 — Experience" title="Where I've been" />

      <div className="relative mt-14">
        <motion.div
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 1.4, ease: EASE }}
          className="absolute left-[15px] top-1.5 bottom-6 w-px origin-top bg-gradient-to-b from-accent via-accent/40 to-transparent"
        />
        {experiences.map((experience, index) => (
          <ExperienceCard
            key={`experience-${index}`}
            experience={experience}
            index={index}
          />
        ))}
      </div>
    </>
  );
};

export default SectionWrapper(Experience, "work");
