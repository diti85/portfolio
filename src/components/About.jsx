import portrait from "../assets/portrait.webp";
import { capabilities, credentials } from "../data/content";

export default function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="relative pt-28 md:pt-40">
      <div className="frame grid gap-12 lg:grid-cols-12 lg:gap-16">
        <figure className="lg:col-span-4">
          <div className="group border border-brass/25 bg-lacquer-deep p-2 sm:p-3">
            <div className="relative aspect-[4/5] overflow-hidden bg-felt">
              {/* luminosity blend tints the photo with the lacquer green; hover restores colour */}
              <img
                src={portrait}
                alt="Portrait of Endrit Basha in a white shirt against a dark background."
                loading="lazy"
                className="h-full w-full object-cover object-[50%_20%] opacity-90 mix-blend-luminosity transition-[opacity,mix-blend-mode] duration-700 group-hover:opacity-100 group-hover:mix-blend-normal"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-lacquer-deep/60 via-transparent to-transparent" />
            </div>
          </div>
        </figure>

        <div className="lg:col-span-7 lg:col-start-6">
          <h2
            id="about-title"
            className="display text-[clamp(2.5rem,5.6vw,5rem)] leading-[0.98] tracking-[-0.025em]"
          >
            I like problems where reliability is the product.
          </h2>
          <div className="mt-10 flex max-w-[62ch] flex-col gap-5 text-base md:text-lg">
            <p>
              I&rsquo;m a software engineer on GEICO&rsquo;s Data Engineering team. Since 2024
              I&rsquo;ve worked on the plumbing analytics depends on: ingestion that can&rsquo;t
              drop a message, retention that regulators audit, and monitoring that says what broke
              before anyone has to ask. I&rsquo;m also studying part-time for a master&rsquo;s in
              computer science at the University of Illinois.
            </p>
            <p>
              On my own time I build products and websites: OneAMS, a membership platform for
              associations with AI assistants built in; AIP, which maps the market it serves; and
              sites for South Florida businesses and a youth-mentoring nonprofit. Before GEICO I
              spent three years shipping client projects at Wizard Studios, and I earned my B.S. at
              the University of Central Florida.
            </p>
          </div>

          <div className="mt-16 grid gap-x-10 gap-y-8 sm:grid-cols-2">
            {capabilities.map((c) => (
              <div key={c.group} className="border-t border-bone/10 pt-4">
                <h3 className="display text-xl">{c.group}</h3>
                <p className="mt-2 text-sm leading-relaxed">{c.items.join(", ")}</p>
              </div>
            ))}
            <div className="border-t border-bone/10 pt-4">
              <h3 className="display text-xl">Credentials</h3>
              <ul className="mt-2 flex flex-col gap-1 text-sm">
                {credentials.map((c) => (
                  <li key={c.name}>{c.name}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
