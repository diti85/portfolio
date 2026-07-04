import { useRef, useState } from "react";
import { motion } from "framer-motion";
import emailjs from "@emailjs/browser";
import { fadeUp } from "../utils/motion";
import { SectionWrapper } from "../hoc";
import SectionHeader from "./SectionHeader";
import { EmberFieldCanvas } from "./canvas";

const inputClasses =
  "bg-surface border border-white/10 focus:border-accent/70 py-3.5 px-5 text-heading placeholder:text-body/60 rounded-lg outline-none text-[15px] transition-colors";

const Contact = () => {
  const formRef = useRef();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // null | "sent" | "error"

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    emailjs
      .send(
        "service_vh8j5y8",
        "template_bpbn6p8",
        {
          from_name: form.name,
          to_name: "Endrit Basha",
          from_email: form.email,
          to_email: "bashaditi@gmail.com",
          message: form.message,
        },
        "zSKYmPunmMrSb9wIA"
      )
      .then(
        () => {
          setLoading(false);
          setStatus("sent");
          setForm({ name: "", email: "", message: "" });
        },
        (error) => {
          setLoading(false);
          console.error(error);
          setStatus("error");
        }
      );
  };

  return (
    <>
      {/* sparse, dimmed reuse of the hero ember system */}
      <div className="absolute inset-0 -z-10 opacity-60 pointer-events-none">
        <EmberFieldCanvas density={0.35} opacity={0.35} interactive={false} />
      </div>

      <SectionHeader eyebrow="05 — Contact" title="Get in touch" />

      <div className="mt-10 grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-16">
        <motion.form
          ref={formRef}
          onSubmit={handleSubmit}
          variants={fadeUp(0.1)}
          className="lg:col-span-3 flex flex-col gap-5"
        >
          <label className="flex flex-col gap-2">
            <span className="font-mono text-[12px] text-body uppercase tracking-[0.15em]">
              Name
            </span>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your name"
              required
              className={inputClasses}
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="font-mono text-[12px] text-body uppercase tracking-[0.15em]">
              Email
            </span>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
              className={inputClasses}
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="font-mono text-[12px] text-body uppercase tracking-[0.15em]">
              Message
            </span>
            <textarea
              rows={6}
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="What's on your mind?"
              required
              className={inputClasses}
            />
          </label>

          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={loading}
              className="font-mono text-[14px] px-7 py-3 rounded-lg bg-accent/10 border border-accent/60 text-heading hover:bg-accent/20 transition-colors disabled:opacity-50 w-fit"
            >
              {loading ? "Sending..." : "Send message"}
            </button>
            {status === "sent" && (
              <p className="font-mono text-[13px] text-accent">
                Thanks &mdash; I&apos;ll get back to you soon.
              </p>
            )}
            {status === "error" && (
              <p className="font-mono text-[13px] text-body">
                Something went wrong. Please try again.
              </p>
            )}
          </div>
        </motion.form>

        <motion.div variants={fadeUp(0.2)} className="lg:col-span-2 flex flex-col gap-6">
          <p className="text-body text-[15px] leading-relaxed">
            Whether you have a role in mind, a project to collaborate on, or
            just want to talk engineering &mdash; my inbox is open.
          </p>
          <div className="font-mono text-[13px] bg-surface border border-white/5 rounded-xl p-5 flex flex-col gap-2.5">
            <p>
              <span className="text-accent">email</span>
              <span className="text-body"> — bashaditi@gmail.com</span>
            </p>
            <p>
              <span className="text-accent">github</span>
              <span className="text-body"> — github.com/diti85</span>
            </p>
            <p>
              {/* TODO(endrit): verify location */}
              <span className="text-accent">location</span>
              <span className="text-body"> — Florida, USA</span>
            </p>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default SectionWrapper(Contact, "contact");
