import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight, Sparkles, TrendingUp, Target, Megaphone,
  PenTool, Video, Camera, Search, Share2, MousePointerClick,
  BarChart3, Users, Globe2, ShieldCheck, Rocket, Award,
  ChevronDown, Quote, Star, Facebook, Instagram, MessageCircle,
} from "lucide-react";
import { Reveal, SectionHeading, fadeUp, stagger } from "@/components/Reveal";
import { ClientAvatars } from "@/components/ClientAvatars";
import { SITE, waLink } from "@/lib/site";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Daniyal Marketing Planner — Turning Clicks Into Customers" },
      { name: "description", content: "Premium digital marketing studio — Meta Ads, Google Ads, SEO, design, video and photography. Trusted by global brands." },
      { property: "og:title", content: "Daniyal Marketing Planner" },
      { property: "og:description", content: "Turning Clicks Into Customers — premium digital growth studio for global brands." },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: HomePage,
});

function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const dur = 1600;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      setN(Math.floor(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, to]);
  return <span ref={ref}>{n.toLocaleString()}{suffix}</span>;
}

function HomePage() {
  return (
    <>
      <Hero />
      <Stats />
      <ServicesOverview />
      <WhyChooseUs />
      <DigitalMarketingFeature />
      <Testimonials />
      <Process />
      <FAQ />
      <FinalCTA />
    </>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-hero" />
      <div className="absolute top-20 -left-20 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-blob" />
      <div className="absolute bottom-0 -right-20 w-96 h-96 bg-accent/30 rounded-full blur-3xl animate-blob" style={{ animationDelay: "3s" }} />

      <div className="container-px mx-auto max-w-7xl relative py-20 md:py-32 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" /> Digital Growth Studio · Global Clients
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="mt-5 text-5xl md:text-7xl font-extrabold leading-[1.02] tracking-tight">
            Turning <span className="text-gradient">Clicks</span><br /> Into <span className="relative inline-block">
              Customers
              <svg className="absolute -bottom-2 left-0 w-full" height="14" viewBox="0 0 200 14" fill="none">
                <path d="M2 9 Q 100 0 198 9" stroke="var(--accent)" strokeWidth="4" strokeLinecap="round" fill="none"/>
              </svg>
            </span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            className="mt-6 text-lg text-muted-foreground max-w-xl">
            Helping brands grow through <strong className="text-foreground">Digital Marketing</strong>, Graphic Design, Video Editing, and Creative Content that actually converts.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="mt-8 flex flex-wrap gap-3">
            <a href={waLink("Hi Daniyal, I want a free consultation.")} target="_blank" rel="noreferrer"
              className="group inline-flex items-center gap-2 bg-gradient-primary text-primary-foreground px-7 py-4 rounded-full font-semibold shadow-elegant hover:shadow-glow hover:-translate-y-0.5 transition-all">
              Free Consultation <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <Link to="/services" className="inline-flex items-center gap-2 bg-foreground text-background px-7 py-4 rounded-full font-semibold hover:bg-foreground/90 transition-colors">
              Explore Services
            </Link>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="mt-10">
            <ClientAvatars />
          </motion.div>
        </div>

        {/* Floating dashboard card mock */}
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3, duration: 0.8 }}
          className="relative hidden lg:block">
          <div className="absolute -inset-6 bg-gradient-primary opacity-20 blur-3xl rounded-full" />
          <div className="relative bg-card border border-border rounded-3xl shadow-elegant p-6 animate-float">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-xs text-muted-foreground">Campaign Performance</div>
                <div className="text-2xl font-bold">+247% ROAS</div>
              </div>
              <div className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> Live
              </div>
            </div>
            <svg viewBox="0 0 300 120" className="w-full h-32">
              <defs>
                <linearGradient id="g1" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.4"/>
                  <stop offset="100%" stopColor="var(--primary)" stopOpacity="0"/>
                </linearGradient>
              </defs>
              <motion.path
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, delay: 0.8 }}
                d="M0,90 C40,80 60,40 100,50 C140,60 160,20 200,30 C240,40 270,15 300,10"
                stroke="var(--primary)" strokeWidth="3" fill="none" strokeLinecap="round" />
              <path d="M0,90 C40,80 60,40 100,50 C140,60 160,20 200,30 C240,40 270,15 300,10 L300,120 L0,120 Z" fill="url(#g1)"/>
            </svg>
            <div className="grid grid-cols-3 gap-3 mt-4">
              {[["Clicks","18.4K"],["CTR","6.2%"],["ROAS","4.8x"]].map(([k,v]) => (
                <div key={k} className="bg-muted rounded-xl p-3">
                  <div className="text-[10px] uppercase text-muted-foreground">{k}</div>
                  <div className="font-bold">{v}</div>
                </div>
              ))}
            </div>
          </div>
          <motion.div animate={{ y: [0,-12,0] }} transition={{ duration: 4, repeat: Infinity }}
            className="absolute -top-4 -right-4 bg-accent text-accent-foreground px-4 py-2 rounded-2xl shadow-card font-semibold text-sm flex items-center gap-2">
            <Megaphone className="w-4 h-4" /> Meta Ads
          </motion.div>
          <motion.div animate={{ y: [0,10,0] }} transition={{ duration: 5, repeat: Infinity }}
            className="absolute -bottom-3 -left-3 bg-secondary text-secondary-foreground px-4 py-2 rounded-2xl shadow-card font-semibold text-sm flex items-center gap-2">
            <Search className="w-4 h-4 text-primary" /> SEO #1
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function Stats() {
  const stats = [
    { v: 500, s: "+", l: "Projects Delivered", Icon: Rocket },
    { v: 200, s: "+", l: "Global Clients", Icon: Users },
    { v: 247, s: "%", l: "Avg. Growth Rate", Icon: TrendingUp },
    { v: 99, s: "%", l: "Satisfaction Rate", Icon: Award },
  ];
  return (
    <section className="container-px mx-auto max-w-7xl py-16">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {stats.map((s,i) => (
          <Reveal key={i} delay={i*0.1}>
            <div className="bg-card border border-border rounded-2xl p-6 text-center shadow-card hover:shadow-elegant hover:-translate-y-1 transition-all">
              <s.Icon className="w-7 h-7 text-primary mx-auto mb-3" />
              <div className="text-3xl md:text-4xl font-extrabold text-foreground">
                <Counter to={s.v} suffix={s.s} />
              </div>
              <div className="text-xs md:text-sm text-muted-foreground mt-1">{s.l}</div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function ServicesOverview() {
  const services = [
    { Icon: Megaphone, title: "Digital Marketing", desc: "Meta, Google & Lead Gen built for ROI.", featured: true },
    { Icon: PenTool, title: "Graphic Designing", desc: "Brand systems that earn attention." },
    { Icon: Video, title: "Video Editing", desc: "Reels, ads, YouTube — built to stop scrolls." },
    { Icon: Camera, title: "Photography", desc: "Product & brand photography that sells." },
  ];
  return (
    <section className="container-px mx-auto max-w-7xl py-20">
      <SectionHeading eyebrow="What We Do" title={<>Services that scale your brand</>}
        subtitle="A full-stack creative team — strategy, design, production and paid growth under one roof." />
      <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}
        className="mt-12 grid md:grid-cols-2 lg:grid-cols-4 gap-5">
        {services.map((s, i) => (
          <motion.div key={i} variants={fadeUp}
            className={`group relative overflow-hidden rounded-3xl p-7 border transition-all hover:-translate-y-2 ${
              s.featured ? "lg:row-span-2 lg:col-span-2 bg-gradient-dark text-white border-transparent shadow-elegant" : "bg-card border-border hover:border-primary/40 shadow-card"
            }`}>
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 ${s.featured ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"}`}>
              <s.Icon className="w-7 h-7" />
            </div>
            <h3 className={`text-2xl font-bold ${s.featured ? "md:text-3xl" : ""}`}>{s.title}</h3>
            <p className={`mt-2 ${s.featured ? "text-white/70 md:text-lg max-w-md" : "text-muted-foreground text-sm"}`}>{s.desc}</p>
            {s.featured && (
              <div className="mt-6 grid grid-cols-2 gap-2 max-w-md">
                {["Meta Ads","Google Ads","SEO","Lead Gen"].map((t) => (
                  <div key={t} className="px-3 py-2 bg-white/10 rounded-lg text-sm font-medium">{t}</div>
                ))}
              </div>
            )}
            <Link to="/services" className={`mt-6 inline-flex items-center gap-1 text-sm font-semibold ${s.featured ? "text-accent" : "text-primary"}`}>
              Learn more <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <div className={`absolute -bottom-10 -right-10 w-40 h-40 rounded-full ${s.featured ? "bg-primary/30" : "bg-primary/5"} blur-3xl group-hover:scale-150 transition-transform duration-700`} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

function WhyChooseUs() {
  const items = [
    { Icon: Target, title: "ROI-First Strategy", desc: "Every dollar tracked. Every campaign optimized for measurable returns." },
    { Icon: Globe2, title: "Global Experience", desc: "Working with brands across 20+ countries and 15+ industries." },
    { Icon: ShieldCheck, title: "Transparent Reporting", desc: "Live dashboards, weekly reports, no hidden numbers — ever." },
    { Icon: Rocket, title: "Fast Execution", desc: "From kickoff to launch in days, not months. We move at startup speed." },
  ];
  return (
    <section className="bg-muted/40 py-20 md:py-28">
      <div className="container-px mx-auto max-w-7xl grid lg:grid-cols-2 gap-12 items-center">
        <Reveal>
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-primary mb-3">
            <span className="w-6 h-px bg-primary" /> Why Choose Us
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold leading-[1.1]">
            We don't just <span className="text-gradient">run ads</span>.<br/>We build growth engines.
          </h2>
          <p className="mt-5 text-muted-foreground text-lg">
            Daniyal Marketing combines data-driven strategy with award-winning creative — so every campaign compounds your brand equity.
          </p>
          <div className="mt-8 flex flex-wrap gap-2">
            {["ISO Certified Process","Meta Business Partner","Google Ads Certified","100% On-Time"].map(t => (
              <span key={t} className="px-4 py-2 bg-card border border-border rounded-full text-xs font-semibold">{t}</span>
            ))}
          </div>
        </Reveal>
        <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}
          className="grid sm:grid-cols-2 gap-4">
          {items.map((it, i) => (
            <motion.div variants={fadeUp} key={i}
              className="bg-card border border-border rounded-2xl p-6 hover:border-primary/40 hover:shadow-card transition-all">
              <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                <it.Icon className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-lg">{it.title}</h4>
              <p className="text-sm text-muted-foreground mt-1.5">{it.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function DigitalMarketingFeature() {
  const channels = [
    { Icon: Facebook, name: "Facebook Ads", desc: "Hyper-targeted campaigns with creative that converts." },
    { Icon: Instagram, name: "Instagram Marketing", desc: "Reels, stories and shopping flows that drive sales." },
    { Icon: MousePointerClick, name: "Meta Ads", desc: "Full-funnel Meta strategy — TOFU to retention." },
    { Icon: Search, name: "Google Ads", desc: "Search, Display & YouTube — capture high-intent demand." },
    { Icon: Target, name: "Lead Generation", desc: "Funnels that fill your pipeline with qualified leads." },
    { Icon: BarChart3, name: "SEO", desc: "Rank #1 — technical, on-page and content built to win." },
    { Icon: Share2, name: "Content Marketing", desc: "Story-led content that builds trust and authority." },
    { Icon: Sparkles, name: "Branding", desc: "Identity systems your customers will never forget." },
  ];
  return (
    <section className="relative overflow-hidden bg-gradient-dark text-white py-24 md:py-32">
      <div className="absolute inset-0 opacity-30 pointer-events-none"
        style={{ backgroundImage: "radial-gradient(circle at 20% 20%, var(--primary) 0%, transparent 40%), radial-gradient(circle at 80% 80%, var(--accent) 0%, transparent 40%)" }} />
      <div className="container-px mx-auto max-w-7xl relative">
        <Reveal>
          <div className="text-center mx-auto max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-semibold tracking-wider uppercase">
              <Megaphone className="w-3.5 h-3.5" /> Our Specialty
            </div>
            <h2 className="mt-4 text-4xl md:text-6xl font-extrabold leading-[1.05]">
              Digital Marketing built for <span className="text-gradient">scale</span>
            </h2>
            <p className="mt-5 text-white/70 text-lg">
              Performance marketing meets brand storytelling. We design campaigns that don't just spend budget — they multiply it.
            </p>
          </div>
        </Reveal>

        <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}
          className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {channels.map((c, i) => (
            <motion.div variants={fadeUp} key={i}
              className="group bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-primary/40 transition-all hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-primary text-primary-foreground flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <c.Icon className="w-5 h-5" />
              </div>
              <h4 className="font-bold">{c.name}</h4>
              <p className="text-sm text-white/60 mt-1">{c.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        <Reveal delay={0.2}>
          <div className="mt-14 text-center">
            <a href={waLink("Hi Daniyal, I'd like to book a strategy call.")} target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-2 bg-gradient-primary text-primary-foreground px-8 py-4 rounded-full font-semibold shadow-glow hover:scale-105 transition-transform">
              Book a Strategy Call <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

const reviews = [
  { name: "Sarah Mitchell", role: "Founder, Bloom Apparel — UK", text: "Daniyal's team scaled our Meta Ads from 1.8x to 5.2x ROAS in 6 weeks. The creative is on another level.", rating: 5 },
  { name: "Ahmed Hassan", role: "CEO, NovaTech — UAE", text: "From branding to launch campaigns, they delivered above expectations. True strategic partners.", rating: 5 },
  { name: "Priya Sharma", role: "Marketing Director, GreenLeaf — India", text: "SEO traffic up 340% in 4 months. Reporting is crystal clear. Highly recommend.", rating: 5 },
  { name: "James O'Connor", role: "Owner, Drift Coffee — Australia", text: "Their video editing for our reels alone added 200K followers. Worth every cent.", rating: 5 },
];

function Testimonials() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % reviews.length), 5000);
    return () => clearInterval(t);
  }, []);
  return (
    <section className="container-px mx-auto max-w-7xl py-20 md:py-28">
      <SectionHeading eyebrow="Testimonials" title="Loved by founders worldwide" />
      <div className="mt-12 max-w-3xl mx-auto relative">
        <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-3xl p-8 md:p-12 shadow-card text-center relative">
          <Quote className="absolute top-6 left-6 w-10 h-10 text-primary/20" />
          <div className="flex justify-center gap-1 text-accent">
            {[...Array(reviews[i].rating)].map((_,k)=><Star key={k} className="w-5 h-5 fill-current"/>)}
          </div>
          <p className="mt-5 text-lg md:text-xl font-medium leading-relaxed">"{reviews[i].text}"</p>
          <div className="mt-6">
            <div className="font-bold">{reviews[i].name}</div>
            <div className="text-sm text-muted-foreground">{reviews[i].role}</div>
          </div>
        </motion.div>
        <div className="mt-6 flex justify-center gap-2">
          {reviews.map((_, k) => (
            <button key={k} onClick={() => setI(k)} aria-label={`Review ${k+1}`}
              className={`h-2 rounded-full transition-all ${k===i ? "w-8 bg-primary" : "w-2 bg-border"}`} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Process() {
  const steps = [
    { n: "01", t: "Discovery", d: "We deep-dive into your brand, audience and goals." },
    { n: "02", t: "Strategy", d: "Custom roadmap with KPIs, channels and creative direction." },
    { n: "03", t: "Creation", d: "Design, copy and assets crafted in-house by specialists." },
    { n: "04", t: "Launch", d: "Campaigns go live with rigorous QA and tracking." },
    { n: "05", t: "Optimization", d: "Weekly reviews, A/B tests and performance scaling." },
  ];
  return (
    <section className="bg-muted/40 py-20 md:py-28">
      <div className="container-px mx-auto max-w-7xl">
        <SectionHeading eyebrow="Our Process" title="A proven 5-step growth system" />
        <div className="mt-14 relative grid md:grid-cols-5 gap-6">
          <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
          {steps.map((s, i) => (
            <Reveal key={i} delay={i*0.1}>
              <div className="text-center relative">
                <div className="mx-auto w-24 h-24 rounded-full bg-card border-2 border-primary flex items-center justify-center text-primary font-extrabold text-2xl shadow-card relative z-10">
                  {s.n}
                </div>
                <h4 className="mt-5 font-bold text-lg">{s.t}</h4>
                <p className="text-sm text-muted-foreground mt-2">{s.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

const faqs = [
  { q: "How long until I see results?", a: "Most clients see meaningful improvements within 30–60 days. SEO is a longer game (3–6 months), while paid ads can produce results in week one." },
  { q: "Do you work with international clients?", a: "Yes. We work with brands across the US, UK, EU, Middle East, Australia and Asia. All pricing is in USD." },
  { q: "What's included in your digital marketing package?", a: "Strategy, ad creative, copywriting, campaign management, A/B testing, weekly reporting and a dedicated account lead." },
  { q: "Can I rent multiple tools at once?", a: "Absolutely. Visit our Tools page and message us on WhatsApp — we'll bundle them at a discount." },
  { q: "How do I get started?", a: "Click 'Free Consultation' or message us on WhatsApp. We'll book a 30-minute call to scope your goals — no obligation." },
];

function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="container-px mx-auto max-w-3xl py-20">
      <SectionHeading eyebrow="FAQ" title="Questions, answered" />
      <div className="mt-10 space-y-3">
        {faqs.map((f, i) => (
          <Reveal key={i} delay={i*0.05}>
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              <button onClick={() => setOpen(open===i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left font-semibold">
                {f.q}
                <ChevronDown className={`w-5 h-5 text-primary transition-transform ${open===i ? "rotate-180" : ""}`} />
              </button>
              <motion.div initial={false} animate={{ height: open===i ? "auto" : 0, opacity: open===i ? 1 : 0 }}
                className="overflow-hidden">
                <p className="px-5 pb-5 text-muted-foreground">{f.a}</p>
              </motion.div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="container-px mx-auto max-w-7xl pb-10">
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl bg-gradient-primary text-primary-foreground p-10 md:p-16 text-center shadow-elegant">
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-accent/40 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-white/20 rounded-full blur-3xl" />
          <h2 className="relative text-4xl md:text-6xl font-extrabold leading-[1.05]">Ready to grow your business?</h2>
          <p className="relative mt-4 text-lg text-primary-foreground/90 max-w-xl mx-auto">
            Join 200+ global brands scaling with Daniyal Marketing. Book a free strategy call today.
          </p>
          <div className="relative mt-8 flex flex-wrap justify-center gap-3">
            <a href={waLink("Hi Daniyal, I'm ready to grow my business.")} target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-2 bg-foreground text-background px-8 py-4 rounded-full font-semibold hover:-translate-y-0.5 transition-transform">
              <MessageCircle className="w-4 h-4" /> Start on WhatsApp
            </a>
            <Link to="/contact" className="inline-flex items-center gap-2 bg-white/15 backdrop-blur border border-white/30 px-8 py-4 rounded-full font-semibold hover:bg-white/25 transition-colors">
              Contact Us <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
