import { useEffect, useState } from "react";
import emailjs from "@emailjs/browser";
import { profile } from "../data/content";
import SectionHead from "./SectionHead";

const field =
  "w-full border-0 border-b border-bone/15 bg-transparent px-0 py-3 text-base text-bone placeholder:text-moss/70 transition-colors focus:border-gilt focus:outline-none focus:ring-0";

function LocalTime() {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);
  const text = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: profile.timeZone,
  }).format(time);
  return (
    <span>
      It&rsquo;s <span className="figures text-bone">{text}</span> in {profile.location}.
    </span>
  );
}

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [copied, setCopied] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    try {
      await emailjs.send(
        "service_vh8j5y8",
        "template_bpbn6p8",
        {
          from_name: form.name,
          to_name: profile.name,
          from_email: form.email,
          to_email: profile.email,
          message: form.message,
        },
        { publicKey: "zSKYmPunmMrSb9wIA" },
      );
      setStatus("sent");
      setForm({ name: "", email: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="relative pb-24 pt-24 md:pb-32 md:pt-36"
    >
      <SectionHead label="Contact" note="Hiring, projects or partnerships" />
      <div className="frame mt-12 md:mt-16">
        <h2
          id="contact-title"
          className="display text-[clamp(4rem,14vw,12.5rem)] leading-[0.86] tracking-[-0.035em]"
        >
          Let&rsquo;s talk.
        </h2>

        <div className="mt-14 grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h3 className="display text-2xl md:text-3xl">Hiring</h3>
            <p className="mt-3 max-w-[40ch] text-base md:text-lg">
              Recruiters and hiring managers: the résumé and LinkedIn have the full history, and
              email reaches me directly.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-x-4 gap-y-3">
              <a
                href={`mailto:${profile.email}`}
                className="display thread-link text-2xl text-bone sm:text-3xl"
              >
                {profile.email}
              </a>
              <button
                type="button"
                onClick={copy}
                className="h-8 rounded-full border border-bone/15 px-3 text-2xs text-sage transition-colors hover:border-brass/60 hover:text-bone"
              >
                <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
              </button>
            </div>

            <ul className="mt-10 flex flex-col border-t border-bone/10 text-sm">
              {[
                ["Résumé", profile.resume, "PDF, one page"],
                ["LinkedIn", profile.links.linkedin, "linkedin.com/in/endritbasha"],
                ["GitHub", profile.links.github, "github.com/diti85"],
              ].map(([label, href, note]) => (
                <li key={label} className="border-b border-bone/10">
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-baseline justify-between gap-4 py-4 transition-colors hover:text-bone"
                  >
                    <span className="display text-xl text-bone transition-transform duration-500 group-hover:translate-x-1.5">
                      {label}
                    </span>
                    <span className="text-xs text-moss">{note}</span>
                  </a>
                </li>
              ))}
            </ul>

            <p className="mt-8 text-sm text-moss">
              <LocalTime />
            </p>
          </div>

          <form onSubmit={onSubmit} className="flex flex-col gap-8 lg:col-span-6 lg:col-start-7">
            <div>
              <h3 className="display text-2xl md:text-3xl">Projects and partnerships</h3>
              <p className="mt-3 max-w-[46ch] text-base md:text-lg">
                A website for your business, a product idea, or a question about something on this
                page. Tell me a little about it.
              </p>
            </div>
            <label className="flex flex-col gap-1">
              <span className="text-xs text-moss">Your name</span>
              <input
                name="name"
                autoComplete="name"
                required
                value={form.name}
                onChange={onChange}
                className={field}
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs text-moss">Your email</span>
              <input
                type="email"
                name="email"
                autoComplete="email"
                required
                value={form.email}
                onChange={onChange}
                className={field}
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs text-moss">Message</span>
              <textarea
                name="message"
                rows={5}
                required
                value={form.message}
                onChange={onChange}
                className={`${field} resize-none`}
              />
            </label>

            <div className="flex flex-wrap items-center gap-5">
              <button
                type="submit"
                disabled={status === "sending"}
                className="h-12 rounded-full bg-gilt px-7 text-sm text-lacquer transition-colors hover:bg-bone disabled:opacity-60"
              >
                {status === "sending" ? "Sending…" : "Send message"}
              </button>
              <p aria-live="polite" className="text-sm">
                {status === "sent" && (
                  <span className="text-ok">Message sent. I&rsquo;ll be in touch.</span>
                )}
                {status === "error" && (
                  <span className="text-warn">
                    The message didn&rsquo;t go through. Email me at {profile.email} instead.
                  </span>
                )}
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
