import SectionHead from "./SectionHead";
import Pipeline from "./Pipeline";
import Lineage from "./Lineage";
import Retention from "./Retention";
import { alsoAtWork, workChapters } from "../data/content";
import { scrollToId } from "../lib/scroll";

// Professional work, labelled and given context before the deep dives.
export default function Work() {
  return (
    <section id="work" aria-labelledby="work-title" className="relative pt-24 md:pt-36">
      <SectionHead label="Work" note="Professional work at GEICO, 2024 to now" />

      <div className="frame mt-12 grid gap-10 md:mt-16 lg:grid-cols-12">
        <h2
          id="work-title"
          className="display text-[clamp(3rem,7.4vw,7rem)] leading-[0.9] tracking-[-0.03em] lg:col-span-6"
        >
          Data engineering at GEICO.
        </h2>
        <div className="flex flex-col gap-4 self-end lg:col-span-5 lg:col-start-8">
          <p className="max-w-[56ch] text-base md:text-lg">
            Since March 2024 I&rsquo;ve worked on GEICO&rsquo;s Data Engineering team, and I was
            promoted to Software Engineer II in July 2025. I architected the ingestion service that
            feeds the company&rsquo;s analytics, built the observability platform that watches it,
            and led a data retention platform for regulatory compliance.
          </p>
          <p className="text-sm text-moss">
            The models below illustrate how each system works. They contain no GEICO data.
          </p>
        </div>
      </div>

      <ol className="frame mt-12 grid gap-4 md:mt-16 md:grid-cols-3 md:gap-6">
        {workChapters.map((c) => (
          <li key={c.id}>
            <a
              href={`#${c.id}`}
              onClick={(e) => {
                e.preventDefault();
                scrollToId(c.id);
              }}
              className="group flex h-full flex-col gap-3 border border-bone/10 bg-felt/40 p-5 transition-colors hover:border-brass/50 md:p-6"
            >
              <span className="flex items-baseline gap-3">
                <span className="display text-lg italic text-brass">{c.numeral}</span>
                <span className="display text-2xl text-bone md:text-3xl">{c.name}</span>
              </span>
              <span className="text-sm">{c.outcome}</span>
              <span className="mt-auto pt-2 text-xs text-gilt transition-transform duration-500 group-hover:translate-x-1">
                Read the chapter
              </span>
            </a>
          </li>
        ))}
      </ol>

      <Pipeline />
      <Lineage />
      <Retention />

      <div className="frame mt-24 md:mt-32">
        <div className="grid gap-6 border-t border-bone/10 pt-8 lg:grid-cols-12">
          <h3 className="display text-2xl md:text-3xl lg:col-span-4">Also at GEICO</h3>
          <ul className="flex flex-col gap-4 lg:col-span-7 lg:col-start-6">
            {alsoAtWork.map((item) => (
              <li key={item} className="relative max-w-[66ch] pl-6 text-base">
                <span
                  className="absolute left-0 top-[0.8em] h-px w-3 bg-brass"
                  aria-hidden="true"
                />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
