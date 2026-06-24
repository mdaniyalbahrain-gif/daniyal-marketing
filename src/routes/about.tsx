import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Sparkles, Target, Eye, Heart, Trophy, ArrowRight, Quote } from "lucide-react";
import { Reveal, SectionHeading, fadeUp, stagger } from "@/components/Reveal";
import logo from "@/assets/logo.png";
import { waLink } from "@/lib/site";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — Meet the Planner | Daniyal Marketing" },
      { name: "description", content: "Meet Daniyal — founder of Daniyal Marketing Planner, a global digital growth studio helping brands scale with strategy, design and paid media." },
      { property: "og:title", content: "About · Daniyal Marketing Planner" },
      { property: "og:description", content: "Meet the founder. Read the story. Discover the mission behind Daniyal Marketing." },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <>
      <section className="relative overflow-hidden py-20 md:py-28">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="container-px mx-auto max-w-7xl relative grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" /> Our Story
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="mt-4 text-5xl md:text-6xl font-extrabold leading-[1.05]">
              We help <span className="text-gradient">global brands</span> grow with intention.
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
              className="mt-5 text-lg text-muted-foreground max-w-xl">
              Daniyal Marketing Planner is a boutique digital growth studio built on a simple belief — great strategy + great creative = real revenue.
            </motion.p>
          </div>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
            className="relative mx-auto">
            <div className="absolute -inset-8 bg-gradient-primary opacity-30 blur-3xl rounded-full" />
            <div className="relative w-72 h-72 md:w-96 md:h-96 rounded-full bg-card border border-border shadow-elegant flex items-center justify-center animate-float">
              <img src={logo} alt="Daniyal Marketing Planner" className="w-64 md:w-80 object-contain" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Meet the Planner */}
      <section className="container-px mx-auto max-w-5xl py-20">
        <Reveal>
          <div className="bg-card border border-border rounded-3xl p-8 md:p-12 shadow-card grid md:grid-cols-3 gap-8 items-center">
            <div className="md:col-span-1">
              <div className="aspect-square rounded-3xl bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center text-7xl text-white font-extrabold shadow-elegant">
                D
              </div>
            </div>
            <div className="md:col-span-2">
              <div className="text-xs uppercase tracking-widest text-primary font-bold">Meet the Planner</div>
              <h2 className="mt-2 text-3xl md:text-4xl font-extrabold">Daniyal — Founder & Strategist</h2>
              <p className="mt-4 text-muted-foreground">
                Daniyal is a digital marketing strategist who has spent the last several years helping brands across e-commerce, SaaS, real estate and personal branding scale their reach and revenue. After running campaigns for global clients, he founded Daniyal Marketing Planner to deliver agency-level results with founder-level care.
              </p>
              <Quote className="w-7 h-7 text-primary mt-5" />
              <p className="mt-2 italic text-foreground/80">
                "Marketing isn't about shouting louder — it's about knowing exactly who you're talking to, and giving them a reason to listen."
              </p>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Mission / Vision / Values */}
      <section className="bg-muted/40 py-20">
        <div className="container-px mx-auto max-w-7xl">
          <SectionHeading eyebrow="What Drives Us" title="Mission, vision & values" />
          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="mt-12 grid md:grid-cols-3 gap-5">
            {[
              { Icon: Target, t: "Mission", d: "To help global brands turn marketing spend into measurable, compounding growth." },
              { Icon: Eye, t: "Vision", d: "Become the most trusted boutique growth partner for ambitious brands worldwide." },
              { Icon: Heart, t: "Values", d: "Transparency. Craft. Ownership. Speed. And being the kind of partner we'd want to hire." },
            ].map((it, i) => (
              <motion.div variants={fadeUp} key={i}
                className="bg-card border border-border rounded-3xl p-7 shadow-card hover:-translate-y-1 transition-transform">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                  <it.Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold">{it.t}</h3>
                <p className="text-muted-foreground mt-2">{it.d}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Achievements */}
      <section className="container-px mx-auto max-w-7xl py-20">
        <SectionHeading eyebrow="Achievements" title="A few numbers we're proud of" />
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            ["500+","Projects Delivered"],["200+","Global Clients"],["$8M+","Ad Spend Managed"],["20+","Countries Served"],
          ].map(([v,l]) => (
            <Reveal key={l}>
              <div className="bg-card border border-border rounded-2xl p-7 text-center shadow-card">
                <div className="text-4xl font-extrabold text-gradient">{v}</div>
                <div className="text-sm text-muted-foreground mt-1">{l}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Journey */}
      <section className="bg-gradient-dark text-white py-20">
        <div className="container-px mx-auto max-w-5xl">
          <div className="text-center mx-auto max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-semibold tracking-wider uppercase">
              <Trophy className="w-3.5 h-3.5" /> Our Journey
            </div>
            <h2 className="mt-4 text-3xl md:text-5xl font-extrabold">From freelance to growth studio</h2>
          </div>
          <div className="mt-12 space-y-6 relative">
            <div className="absolute left-4 md:left-1/2 top-2 bottom-2 w-px bg-white/20 md:-translate-x-1/2" />
            {[
              { y: "2020", t: "Started as a solo freelancer", d: "First international clients in design and social media." },
              { y: "2022", t: "Expanded into paid media", d: "Specialized in Meta & Google Ads — first 7-figure ad spend year." },
              { y: "2023", t: "Daniyal Marketing born", d: "Built a small expert team across strategy, creative and media." },
              { y: "2024", t: "Tools marketplace launched", d: "Began renting premium tools to creators and small businesses worldwide." },
              { y: "Today", t: "Trusted by global brands", d: "Helping 200+ brands across 20+ countries scale with confidence." },
            ].map((s, i) => (
              <Reveal key={i} delay={i*0.05}>
                <div className={`relative md:grid md:grid-cols-2 md:gap-12 ${i%2 ? "md:[&>*:first-child]:order-2" : ""}`}>
                  <div className="pl-12 md:pl-0 md:text-right md:pr-12">
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 inline-block max-w-md">
                      <div className="text-primary font-bold text-sm">{s.y}</div>
                      <div className="font-bold mt-1">{s.t}</div>
                      <div className="text-white/70 text-sm mt-1">{s.d}</div>
                    </div>
                  </div>
                  <div className="hidden md:block" />
                  <div className="absolute left-2 md:left-1/2 top-3 md:-translate-x-1/2 w-4 h-4 rounded-full bg-primary shadow-glow" />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="container-px mx-auto max-w-7xl py-16">
        <Reveal>
          <div className="rounded-3xl bg-gradient-primary text-primary-foreground p-10 md:p-14 text-center shadow-elegant">
            <h3 className="text-3xl md:text-5xl font-extrabold">Let's write your growth chapter</h3>
            <p className="mt-3 text-primary-foreground/90 max-w-xl mx-auto">Book a free 30-minute strategy call with our team.</p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <a href={waLink("Hi Daniyal, I'd like to chat about my brand.")} target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-2 bg-foreground text-background px-7 py-4 rounded-full font-semibold">
                Chat on WhatsApp <ArrowRight className="w-4 h-4" />
              </a>
              <Link to="/contact" className="inline-flex items-center gap-2 bg-white/15 backdrop-blur border border-white/30 px-7 py-4 rounded-full font-semibold">
                Contact Form
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
