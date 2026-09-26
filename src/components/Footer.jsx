import { profile } from "../data/content";
import { scrollToId } from "../lib/scroll";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-bone/10 bg-lacquer-deep">
      <div className="frame flex flex-col gap-6 pt-10 text-xs text-moss sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} {profile.name}
        </p>
        <div className="flex gap-6">
          <a href={profile.links.github} target="_blank" rel="noreferrer" className="thread-link">
            GitHub
          </a>
          <a href={profile.links.linkedin} target="_blank" rel="noreferrer" className="thread-link">
            LinkedIn
          </a>
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              scrollToId("top");
            }}
            className="thread-link"
          >
            Back to top
          </a>
        </div>
      </div>
      <p
        aria-hidden="true"
        className="display mt-6 select-none whitespace-nowrap text-center text-[17.5vw] leading-[0.78] tracking-[-0.04em] text-bone/[0.07]"
      >
        {profile.name}
      </p>
    </footer>
  );
}
