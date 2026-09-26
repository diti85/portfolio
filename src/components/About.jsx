import portrait from "../assets/portrait.webp";
import SectionHead from "./SectionHead";
import { intro, profile } from "../data/content";
import { goTo } from "../lib/sheets";

const jump = (href) => (e) => {
  e.preventDefault();
  goTo(href.slice(1), e.currentTarget);
};

// The introduction: who, where and what, answered within the first two screens.
export default function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="relative pt-20 md:pt-28">
      <SectionHead label="About" note="Who I am and what I do" />

      <div className="frame mt-12 grid gap-12 md:mt-16 lg:grid-cols-12 lg:gap-16">
        {/* on phones the words come first; the portrait follows */}
        <div className="order-2 lg:order-1 lg:col-span-4">
          <figure className="group max-w-xs border border-brass/25 bg-lacquer-deep p-2 sm:p-3 lg:max-w-none">
            <div className="relative aspect-[4/5] overflow-hidden bg-felt">
              {/* luminosity blend tints the photo with the lacquer green; hover restores colour */}
              <img
                src={portrait}
                alt="Portrait of Endrit Basha in a white shirt against a dark background."
                loading="lazy"
                className="h-full w-full object-cover object-[50%_20%] opacity-90 mix-blend-luminosity transition-opacity duration-700 group-hover:opacity-100 group-hover:mix-blend-normal"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-lacquer-deep/60 via-transparent to-transparent" />
            </div>
          </figure>
          <dl className="mt-6 grid grid-cols-[5.5rem_1fr] gap-x-4 gap-y-2 text-sm">
            <dt className="text-moss">Now</dt>
            <dd className="text-bone">{intro.now}</dd>
            <dt className="text-moss">Before</dt>
            <dd>{intro.before}</dd>
            <dt className="text-moss">Studying</dt>
            <dd>{intro.studying}</dd>
            <dt className="text-moss">Based in</dt>
            <dd>{profile.location}, working remotely</dd>
          </dl>
        </div>

        <div className="order-1 flex flex-col lg:order-2 lg:col-span-7 lg:col-start-6">
          <h2
            id="about-title"
            className="display text-[clamp(2.4rem,5vw,4.5rem)] leading-[1] tracking-[-0.025em]"
          >
            {intro.headline}
          </h2>
          <p className="mt-8 max-w-[48ch] text-lg leading-snug text-bone/85 md:text-xl">
            {intro.lead}
          </p>
          <p className="mt-6 max-w-[62ch] text-base md:text-lg">
            Sometimes the fix is a service that handles thirty million messages a day. Sometimes
            it&rsquo;s a website that lets a family restaurant take orders online. Either way I care
            about who&rsquo;s stuck and what &ldquo;solved&rdquo; looks like for them. I&rsquo;m
            studying part-time for a master&rsquo;s in computer science at the University of
            Illinois, and before GEICO I spent three years shipping client projects at Wizard
            Studios.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <a
              href={profile.resume}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-11 items-center rounded-full bg-gilt px-6 text-sm text-lacquer transition-colors hover:bg-bone"
            >
              Download résumé
            </a>
            <a
              href="#contact"
              onClick={jump("#contact")}
              className="inline-flex h-11 items-center rounded-full border border-brass/50 px-6 text-sm text-bone transition-colors hover:bg-gilt hover:text-lacquer"
            >
              Get in touch
            </a>
          </div>
          <p className="mt-6 text-sm text-moss">
            Short on time? Jump to{" "}
            <a href="#work" onClick={jump("#work")} className="thread-link text-sage">
              my work at GEICO
            </a>{" "}
            or{" "}
            <a href="#projects" onClick={jump("#projects")} className="thread-link text-sage">
              my projects
            </a>
            .
          </p>
        </div>
      </div>

      <div className="frame mt-20 grid gap-10 md:mt-28 md:grid-cols-3 md:gap-8">
        {intro.pillars.map((p) => (
          <div key={p.title} className="flex flex-col border-t border-brass/40 pt-5">
            <p className="text-xs text-gilt">{p.context}</p>
            <h3 className="display mt-3 text-2xl leading-tight md:text-[1.75rem]">{p.title}</h3>
            <p className="mt-3 max-w-[38ch] text-base">{p.body}</p>
            <a
              href={p.link.href}
              onClick={jump(p.link.href)}
              className="thread-link mt-5 self-start text-sm text-gilt"
            >
              {p.link.label}
            </a>
          </div>
        ))}
      </div>

      <div className="frame mt-16 md:mt-20">
        <dl className="grid grid-cols-2 gap-x-6 gap-y-8 border-y border-bone/10 py-8 md:grid-cols-4">
          {intro.glance.map((g) => (
            <div key={g.label} className="flex flex-col-reverse gap-2">
              <dt className="max-w-[24ch] text-xs leading-snug text-moss">{g.label}</dt>
              <dd className="display figures text-4xl text-bone md:text-5xl">{g.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
