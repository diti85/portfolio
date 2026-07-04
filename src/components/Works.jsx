import { motion } from "framer-motion";
import { github } from "../assets";
import { projects } from "../constants";
import { fadeUp } from "../utils/motion";
import { SectionWrapper } from "../hoc";
import SectionHeader from "./SectionHeader";

const ProjectCard = ({ project, index }) => (
  <motion.div
    variants={fadeUp(index * 0.08)}
    className="group bg-surface border border-white/5 hover:border-accent/50 rounded-2xl overflow-hidden w-full sm:w-[356px] transition-colors duration-300"
  >
    <div className="relative h-[190px] overflow-hidden">
      <img
        src={project.image}
        alt={project.name}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
      />
      <a
        href={project.source_code_link}
        target="_blank"
        rel="noreferrer"
        aria-label={`${project.name} source code`}
        className="absolute top-3 right-3 w-9 h-9 rounded-full bg-bg/80 backdrop-blur border border-white/10 hover:border-accent/60 flex items-center justify-center transition-colors"
      >
        <img src={github} alt="" className="w-[18px] h-[18px] object-contain" />
      </a>
    </div>

    <div className="p-5">
      <h3 className="font-display text-heading text-[20px] font-bold">
        {project.name}
      </h3>
      <p className="mt-2 text-body text-[14px] leading-relaxed">
        {project.description}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <span
            key={tag.name}
            className="font-mono text-[11px] text-accent/90 border border-accent/20 rounded-full px-2.5 py-1"
          >
            {tag.name}
          </span>
        ))}
      </div>
    </div>
  </motion.div>
);

const Works = () => {
  return (
    <>
      <SectionHeader eyebrow="04 — Work" title="Selected projects" />

      <motion.p
        variants={fadeUp(0.1)}
        className="mt-4 text-body text-[15px] leading-relaxed max-w-3xl"
      >
        A few things I&apos;ve built &mdash; capstone work, side projects, and
        experiments. Each links to the source.
      </motion.p>

      <div className="mt-12 flex flex-wrap gap-6">
        {projects.map((project, index) => (
          <ProjectCard key={project.name} project={project} index={index} />
        ))}
      </div>
    </>
  );
};

export default SectionWrapper(Works, "");
