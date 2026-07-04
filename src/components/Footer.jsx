import { styles } from "../styles";

const Footer = () => (
  <footer className="relative border-t border-white/5">
    <div
      className={`max-w-7xl mx-auto ${styles.paddingX} py-8 flex flex-col sm:flex-row items-center justify-between gap-4`}
    >
      <p className="font-mono text-[12px] text-body">
        © {new Date().getFullYear()} Endrit Basha
      </p>
      <div className="flex gap-6">
        <a
          href="https://github.com/diti85"
          target="_blank"
          rel="noreferrer"
          className="font-mono text-[12px] text-body hover:text-accent transition-colors"
        >
          GitHub
        </a>
        <a
          href="https://www.linkedin.com/in/endritbasha"
          target="_blank"
          rel="noreferrer"
          className="font-mono text-[12px] text-body hover:text-accent transition-colors"
        >
          {/* TODO(endrit): verify LinkedIn URL */}
          LinkedIn
        </a>
      </div>
      <p className="font-mono text-[12px] text-body">
        built with React + Three.js
      </p>
    </div>
  </footer>
);

export default Footer;
