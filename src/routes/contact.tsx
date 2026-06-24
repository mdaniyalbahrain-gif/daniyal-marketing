import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { Mail, Phone, MapPin, Send, MessageCircle, CheckCircle2, Sparkles } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { SITE, waLink } from "@/lib/site";
import { submitMessage } from "@/lib/cms";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Us — Let's Grow Your Brand | Daniyal Marketing" },
      { name: "description", content: "Get in touch with Daniyal Marketing for digital marketing, design, video and tool rental inquiries. Free consultation available." },
      { property: "og:title", content: "Contact · Daniyal Marketing Planner" },
      { property: "og:description", content: "Reach out for a free strategy call." },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

type Form = { name: string; email: string; phone: string; service: string; message: string };

function ContactPage() {
  const [form, setForm] = useState<Form>({ name: "", email: "", phone: "", service: "Digital Marketing", message: "" });
  const [errors, setErrors] = useState<Partial<Form>>({});
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  const validate = () => {
    const e: Partial<Form> = {};
    if (!form.name.trim()) e.name = "Please enter your name";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Valid email required";
    if (!form.message.trim() || form.message.length < 10) e.message = "Tell us a bit more (10+ chars)";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setBusy(true);
    try {
      await submitMessage(form);
    } catch (err) {
      console.error("Failed to save message", err);
    }
    const waText = `Hi Daniyal, new inquiry:\n\n👤 ${form.name}\n📧 ${form.email}\n📱 ${form.phone || "-"}\n🛠 ${form.service}\n\n${form.message}`;
    window.open(`${SITE.whatsapp}?text=${encodeURIComponent(waText)}`, "_blank");
    setSent(true);
    setBusy(false);
    setForm({ name: "", email: "", phone: "", service: "Digital Marketing", message: "" });
  };

  return (
    <>
      <section className="relative overflow-hidden py-20 md:py-24">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="container-px mx-auto max-w-7xl relative text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" /> Get in Touch
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="mt-4 text-5xl md:text-7xl font-extrabold leading-[1.05]">
            Let's build <span className="text-gradient">together</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            className="mt-5 text-lg text-muted-foreground max-w-2xl mx-auto">
            Whether it's a growth strategy, a creative project, or a tool rental — we'd love to hear from you.
          </motion.p>
        </div>
      </section>

      <section className="container-px mx-auto max-w-7xl pb-20">
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Form */}
          <Reveal className="lg:col-span-3">
            <div className="bg-card border border-border rounded-3xl p-7 md:p-10 shadow-card">
              <h2 className="text-2xl font-bold">Send us a message</h2>
              <p className="text-muted-foreground text-sm mt-1">We typically reply within a few hours.</p>

              {sent ? (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                  className="mt-8 p-6 rounded-2xl bg-primary/10 border border-primary/30 flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-primary shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-foreground">Message sent — thank you!</div>
                    <div className="text-sm text-muted-foreground mt-1">We'll reach out within a few hours. For faster response, ping us on WhatsApp.</div>
                    <button onClick={() => setSent(false)} className="mt-3 text-sm text-primary font-semibold">Send another</button>
                  </div>
                </motion.div>
              ) : (
                <form onSubmit={submit} className="mt-7 space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field label="Name" error={errors.name}>
                      <input value={form.name} onChange={(e) => setForm({...form, name: e.target.value})}
                        className="input" placeholder="Your full name" />
                    </Field>
                    <Field label="Email" error={errors.email}>
                      <input value={form.email} onChange={(e) => setForm({...form, email: e.target.value})}
                        type="email" className="input" placeholder="you@brand.com" />
                    </Field>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field label="Phone (optional)">
                      <input value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})}
                        className="input" placeholder="+1 555 000 0000" />
                    </Field>
                    <Field label="Service interest">
                      <select value={form.service} onChange={(e) => setForm({...form, service: e.target.value})}
                        className="input">
                        {["Digital Marketing","Graphic Designing","Video Editing","Photography","Tool Rental","Other"].map((s) => <option key={s}>{s}</option>)}
                      </select>
                    </Field>
                  </div>
                  <Field label="Message" error={errors.message}>
                    <textarea value={form.message} onChange={(e) => setForm({...form, message: e.target.value})}
                      rows={5} className="input resize-none" placeholder="Tell us about your project, goals and timeline…" />
                  </Field>
                  <button type="submit" disabled={busy}
                    className="inline-flex items-center gap-2 bg-gradient-primary text-primary-foreground px-7 py-3.5 rounded-full font-semibold shadow-elegant hover:shadow-glow hover:-translate-y-0.5 transition-all disabled:opacity-60">
                    {busy ? "Sending…" : "Send Message"} <Send className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          </Reveal>

          {/* Info */}
          <div className="lg:col-span-2 space-y-5">
            <Reveal>
              <a href={waLink("Hi Daniyal, I'd like to chat.")} target="_blank" rel="noreferrer"
                className="block bg-[#25D366] text-white rounded-3xl p-7 shadow-card hover:-translate-y-1 transition-transform">
                <MessageCircle className="w-8 h-8" />
                <div className="mt-4 font-bold text-xl">Chat on WhatsApp</div>
                <div className="text-sm text-white/80 mt-1">Fastest way to reach us — average reply under 15 minutes.</div>
              </a>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="bg-card border border-border rounded-3xl p-7 shadow-card space-y-4">
                <InfoRow Icon={Mail} title="Email us" value={SITE.email} href={`mailto:${SITE.email}`} />
                <InfoRow Icon={Phone} title="Call us" value={SITE.phone} href={`tel:${SITE.phone.replace(/\s/g,"")}`} />
                <InfoRow Icon={MapPin} title="Location" value={SITE.location} />
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="bg-secondary text-secondary-foreground rounded-3xl p-7 shadow-card">
                <div className="text-xs uppercase tracking-wider text-primary font-bold">Business Inquiry</div>
                <div className="mt-2 font-bold text-lg">Partnerships & bulk projects</div>
                <p className="text-sm text-secondary-foreground/70 mt-1">Agencies, resellers, and high-volume clients — let's talk custom pricing.</p>
                <a href={`mailto:${SITE.email}`} className="mt-4 inline-flex text-sm text-primary font-semibold">{SITE.email} →</a>
              </div>
            </Reveal>
            <Reveal delay={0.3}>
              <div className="rounded-3xl overflow-hidden border border-border shadow-card aspect-[4/3] bg-muted relative">
                {/* Map placeholder */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-card to-accent/15 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-10 h-10 text-primary mx-auto" />
                    <div className="mt-2 font-bold">Available Worldwide</div>
                    <div className="text-xs text-muted-foreground">Remote-first global studio</div>
                  </div>
                </div>
                <div className="absolute inset-0 opacity-30"
                  style={{ backgroundImage: "linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <style>{`
        .input {
          width: 100%;
          padding: 0.875rem 1rem;
          border-radius: 0.875rem;
          background: var(--background);
          border: 1px solid var(--border);
          color: var(--foreground);
          transition: all 0.2s;
        }
        .input:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 0 4px color-mix(in oklab, var(--primary) 15%, transparent);
        }
      `}</style>
    </>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="text-xs font-semibold text-foreground/80 mb-1.5">{label}</div>
      {children}
      {error && <div className="text-xs text-destructive mt-1">{error}</div>}
    </label>
  );
}

function InfoRow({ Icon, title, value, href }: { Icon: typeof Mail; title: string; value: string; href?: string }) {
  const content = (
    <div className="flex items-start gap-3">
      <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">{title}</div>
        <div className="font-medium text-foreground">{value}</div>
      </div>
    </div>
  );
  return href ? <a href={href} className="block hover:opacity-80 transition-opacity">{content}</a> : content;
}
