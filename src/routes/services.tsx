import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Megaphone, PenTool, Video, Camera, ArrowRight, Check,
  Target, Search, MousePointerClick, BarChart3, TrendingUp,
  Facebook, Instagram, Share2, Sparkles, ChevronDown, Pencil, X, Save,
} from "lucide-react";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Reveal, SectionHeading, fadeUp, stagger } from "@/components/Reveal";
import { fetchServices, upsertService } from "@/lib/cms";
import { waLink } from "@/lib/site";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — Digital Marketing, Design, Video & Photography" },
      { name: "description", content: "Full-service digital agency: Meta Ads, Google Ads, SEO, branding, video editing and photography for global brands." },
      { property: "og:title", content: "Services · Daniyal Marketing Planner" },
      { property: "og:description", content: "Digital Marketing, Design, Video and Photography services that scale brands." },
      { property: "og:url", content: "/services" },
    ],
    links: [{ rel: "canonical", href: "/services" }],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  return (
    <>
      <Header />
      <DigitalMarketing />
      <GraphicDesign />
      <VideoEditing />
      <Photography />
      <ServicesFAQ />
      <CTA />
    </>
  );
}

function Header() {
  return (
    <section className="relative overflow-hidden py-20 md:py-28">
      <div className="absolute inset-0 bg-gradient-hero" />
      <div className="container-px mx-auto max-w-7xl relative text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" /> Our Services
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="mt-4 text-5xl md:text-7xl font-extrabold leading-[1.05]">
          Everything you need to <span className="text-gradient">scale</span>
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className="mt-5 text-lg text-muted-foreground max-w-2xl mx-auto">
          One creative team. Four core services. Endless growth — built for ambitious global brands.
        </motion.p>
      </div>
    </section>
  );
}

// ============ Editable service section helpers ============
type ServiceContent = {
  eyebrow: string;
  title: string;
  description: string;
  features: string[];
  image_url: string | null;
};

function useEditable(slug: string, defaults: ServiceContent) {
  const qc = useQueryClient();
  const { data: services = [] } = useQuery({ queryKey: ["services"], queryFn: fetchServices });
  const o = services.find((s) => s.slug === slug);
  const merged: ServiceContent = {
    eyebrow: o?.eyebrow ?? defaults.eyebrow,
    title: o?.title ?? defaults.title,
    description: o?.description ?? defaults.description,
    features: o?.features ?? defaults.features,
    image_url: o?.image_url ?? defaults.image_url,
  };
  const save = async (next: ServiceContent) => {
    await upsertService({ slug, title: next.title, eyebrow: next.eyebrow, description: next.description, features: next.features, image_url: next.image_url, is_active: true });
    await qc.invalidateQueries({ queryKey: ["services"] });
  };
  return [merged, save] as const;
}

function EditButton({ onClick }: { onClick: () => void }) {
  const { isAdmin } = useAuth();
  if (!isAdmin) return null;
  return (
    <button onClick={onClick} title="Edit"
      className="absolute top-4 right-4 z-20 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary text-primary-foreground text-xs font-bold shadow-elegant hover:shadow-glow">
      <Pencil className="w-3 h-3" /> Edit
    </button>
  );
}

function ServiceEditor({ initial, onClose, onSave }: {
  initial: ServiceContent; onClose: () => void; onSave: (c: ServiceContent) => Promise<void> | void;
}) {
  const [c, setC] = useState<ServiceContent>(initial);
  const [saving, setSaving] = useState(false);
  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="bg-card border border-border rounded-3xl shadow-elegant w-full max-w-lg my-8">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h3 className="font-bold text-lg">Edit Service</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-muted flex items-center justify-center">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-5 space-y-3 max-h-[70vh] overflow-y-auto">
          <Field label="Eyebrow">
            <input value={c.eyebrow} onChange={(e) => setC({ ...c, eyebrow: e.target.value })} className="inp" />
          </Field>
          <Field label="Title">
            <input value={c.title} onChange={(e) => setC({ ...c, title: e.target.value })} className="inp" />
          </Field>
          <Field label="Description">
            <textarea value={c.description} rows={3} onChange={(e) => setC({ ...c, description: e.target.value })} className="inp" />
          </Field>
          <Field label="Benefits (one per line)">
            <textarea value={c.features.join("\n")} rows={6}
              onChange={(e) => setC({ ...c, features: e.target.value.split("\n").filter(Boolean) })} className="inp" />
          </Field>
          <Field label="Image URL">
            <input value={c.image_url ?? ""} placeholder="https://…"
              onChange={(e) => setC({ ...c, image_url: e.target.value || null })} className="inp" />
          </Field>
        </div>
        <div className="p-5 border-t border-border flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded-full text-sm font-semibold bg-muted hover:bg-muted/70">Cancel</button>
          <button disabled={saving} onClick={async () => { setSaving(true); await onSave(c); setSaving(false); onClose(); }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold bg-gradient-primary text-primary-foreground shadow-elegant hover:shadow-glow disabled:opacity-60">
            <Save className="w-4 h-4" /> {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </motion.div>
      <style>{`.inp{width:100%;padding:.6rem .8rem;border-radius:.6rem;background:hsl(var(--background));border:1px solid hsl(var(--border));font-size:.875rem;color:inherit}.inp:focus{outline:none;box-shadow:0 0 0 2px hsl(var(--primary))}`}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}

// ============ Sections ============

function DigitalMarketing() {
  const defaults: ServiceContent = {
    eyebrow: "Flagship Service",
    title: "Digital Marketing that compounds",
    description: "We don't just run ads. We build full growth systems — strategy, creative, media buying, analytics and optimization — all under one roof.",
    features: ["Dedicated strategist","Weekly reporting","Creative production","Conversion tracking","A/B testing","Scale-ready playbooks"],
    image_url: null,
  };
  const [content, save] = useEditable("digital-marketing", defaults);
  const [editing, setEditing] = useState(false);

  const services = [
    { Icon: Facebook, t: "Meta Ads", d: "Full-funnel Facebook & Instagram ad systems." },
    { Icon: Instagram, t: "Instagram Ads", d: "Story, Reels & Shopping campaigns that convert." },
    { Icon: MousePointerClick, t: "Facebook Ads", d: "Prospecting, retargeting & lookalike audiences." },
    { Icon: Search, t: "Google Ads", d: "Search, Display, Shopping & YouTube campaigns." },
    { Icon: BarChart3, t: "SEO", d: "Technical, on-page and content SEO that ranks." },
    { Icon: Target, t: "Local SEO", d: "Dominate Google Maps & local search." },
    { Icon: Share2, t: "Content Marketing", d: "Story-led content that converts visitors." },
    { Icon: Sparkles, t: "Lead Generation", d: "Funnels engineered to fill your pipeline." },
    { Icon: TrendingUp, t: "Retargeting", d: "Bring warm visitors back at scale." },
    { Icon: BarChart3, t: "Analytics & CRO", d: "Track, test, optimize — endlessly." },
  ];

  return (
    <section className="relative bg-gradient-dark text-white py-24 md:py-32 overflow-hidden">
      <EditButton onClick={() => setEditing(true)} />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      <div className="container-px mx-auto max-w-7xl relative">
        <Reveal>
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-semibold tracking-wider uppercase">
              <Megaphone className="w-3.5 h-3.5" /> {content.eyebrow}
            </div>
            <h2 className="mt-4 text-4xl md:text-6xl font-extrabold leading-[1.05]">{content.title}</h2>
            <p className="mt-5 text-white/70 text-lg">{content.description}</p>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-10 grid lg:grid-cols-3 gap-4">
            {[
              { label: "Revenue Growth", value: "+312%", color: "var(--primary)" },
              { label: "ROAS", value: "5.4x", color: "var(--accent)" },
              { label: "CAC Reduction", value: "-48%", color: "var(--primary-glow)" },
            ].map((m, i) => (
              <div key={i} className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6">
                <div className="text-sm text-white/60">{m.label}</div>
                <div className="text-4xl font-extrabold mt-1" style={{ color: m.color }}>{m.value}</div>
                <svg viewBox="0 0 200 60" className="w-full h-14 mt-3">
                  <motion.path
                    initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }}
                    transition={{ duration: 1.8, delay: i*0.2 }}
                    d="M0,50 C30,45 50,30 80,28 C110,26 130,12 160,8 C175,6 190,4 200,2"
                    stroke={m.color} strokeWidth="2.5" fill="none" strokeLinecap="round" />
                </svg>
              </div>
            ))}
          </div>
        </Reveal>

        <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}
          className="mt-12 grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {services.map((s, i) => (
            <motion.div variants={fadeUp} key={i}
              className="group bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-5 hover:bg-white/10 hover:-translate-y-1 transition-all">
              <div className="w-10 h-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center mb-3">
                <s.Icon className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm">{s.t}</h4>
              <p className="text-xs text-white/60 mt-1">{s.d}</p>
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-12 grid lg:grid-cols-2 gap-8 items-center">
          <Reveal>
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
              <h3 className="text-2xl font-bold mb-5">What's included</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {content.features.map((b) => (
                  <div key={b} className="flex items-center gap-2 text-sm text-white/80">
                    <Check className="w-4 h-4 text-primary" /> {b}
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="flex flex-wrap gap-3 justify-start lg:justify-end">
              <a href={waLink("Hi Daniyal, I want a Digital Marketing quote.")} target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-2 bg-gradient-primary text-primary-foreground px-7 py-4 rounded-full font-semibold shadow-glow hover:scale-105 transition-transform">
                Get a Quote <ArrowRight className="w-4 h-4" />
              </a>
              <Link to="/contact" className="inline-flex items-center gap-2 bg-white/10 border border-white/30 px-7 py-4 rounded-full font-semibold hover:bg-white/20">
                Book a Call
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
      {editing && <ServiceEditor initial={content} onClose={() => setEditing(false)} onSave={save} />}
    </section>
  );
}

function CreativeBlock({ Icon, content, reversed, gallery }: {
  Icon: typeof Megaphone; content: ServiceContent; reversed?: boolean; gallery?: boolean;
}) {
  return (
    <div className={`grid lg:grid-cols-2 gap-12 items-center ${reversed ? "lg:[&>*:first-child]:order-2" : ""}`}>
      <Reveal>
        <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-primary mb-3">
          <Icon className="w-4 h-4" /> {content.eyebrow}
        </div>
        <h2 className="text-3xl md:text-5xl font-extrabold leading-[1.1]">{content.title}</h2>
        <p className="mt-5 text-muted-foreground text-lg">{content.description}</p>
        <ul className="mt-6 grid sm:grid-cols-2 gap-2">
          {content.features.map((it) => (
            <li key={it} className="flex items-center gap-2 text-sm font-medium">
              <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center"><Check className="w-3 h-3"/></span>
              {it}
            </li>
          ))}
        </ul>
        <a href={waLink(`Hi Daniyal, I need ${content.eyebrow}.`)} target="_blank" rel="noreferrer"
          className="mt-7 inline-flex items-center gap-2 bg-foreground text-background px-6 py-3 rounded-full font-semibold hover:-translate-y-0.5 transition-transform">
          Discuss your project <ArrowRight className="w-4 h-4" />
        </a>
      </Reveal>
      <Reveal delay={0.1}>
        {gallery && !content.image_url ? (
          <div className="grid grid-cols-3 gap-3">
            {[...Array(6)].map((_,i)=>(
              <div key={i} className={`rounded-2xl bg-gradient-to-br ${["from-primary/30 to-primary/10","from-accent/40 to-accent/10","from-secondary to-primary/40","from-primary/40 to-accent/30","from-accent/30 to-primary-glow/30","from-primary-glow/40 to-secondary/30"][i]} ${i===0||i===3?"aspect-square":"aspect-[3/4]"} shadow-card`} />
            ))}
          </div>
        ) : (
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-primary opacity-20 blur-2xl rounded-full" />
            <img src={content.image_url ?? ""} alt={content.title} loading="lazy"
              className="relative rounded-3xl shadow-elegant w-full aspect-[4/3] object-cover" />
          </div>
        )}
      </Reveal>
    </div>
  );
}

function GraphicDesign() {
  const dbImg = useServiceImage("graphic-design");
  const defaults: ServiceContent = {
    eyebrow: "Graphic Designing",
    title: "Brand systems people remember",
    description: "From logo to launch — we craft identity systems, social assets and packaging that earn attention and trust.",
    features: ["Logo Design","Brand Identity","Social Posts","Web Banners","Packaging Design","Business Cards"],
    image_url: dbImg ?? "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=1200&q=80",
  };
  const [content, save] = useEditable("graphic-design", defaults);
  const [editing, setEditing] = useState(false);
  return (
    <section className="relative container-px mx-auto max-w-7xl py-20 md:py-28">
      <EditButton onClick={() => setEditing(true)} />
      <CreativeBlock Icon={PenTool} content={content} reversed />
      {editing && <ServiceEditor initial={content} onClose={() => setEditing(false)} onSave={save} />}
    </section>
  );
}

function VideoEditing() {
  const dbImg = useServiceImage("video-editing");
  const defaults: ServiceContent = {
    eyebrow: "Video Editing",
    title: "Videos that stop the scroll",
    description: "Reels, ads and long-form — edited with rhythm, color and motion that keeps eyes glued and CTRs climbing.",
    features: ["Instagram Reels","TikTok Shorts","YouTube Videos","Performance Ads","Motion Graphics","Color Grading"],
    image_url: dbImg ?? "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=1200&q=80",
  };
  const [content, save] = useEditable("video-editing", defaults);
  const [editing, setEditing] = useState(false);
  return (
    <section className="relative container-px mx-auto max-w-7xl py-20 md:py-28">
      <EditButton onClick={() => setEditing(true)} />
      <CreativeBlock Icon={Video} content={content} />
      {editing && <ServiceEditor initial={content} onClose={() => setEditing(false)} onSave={save} />}
    </section>
  );
}

function Photography() {
  const dbImg = useServiceImage("photography");
  const defaults: ServiceContent = {
    eyebrow: "Photography",
    title: "Photos that sell at first glance",
    description: "Product, brand and social photography directed for commerce — every frame engineered to convert.",
    features: ["Product Photography","Brand Photography","Social Media Shoots","Lifestyle","Studio & On-location","Post-production"],
    image_url: dbImg ?? null,
  };
  const [content, save] = useEditable("photography", defaults);
  const [editing, setEditing] = useState(false);
  return (
    <section className="relative container-px mx-auto max-w-7xl py-20 md:py-28">
      <EditButton onClick={() => setEditing(true)} />
      <CreativeBlock Icon={Camera} content={content} gallery={!content.image_url} reversed />
      {editing && <ServiceEditor initial={content} onClose={() => setEditing(false)} onSave={save} />}
    </section>
  );
}

function useServiceImage(slug: string) {
  const { data } = useQuery({ queryKey: ["services"], queryFn: fetchServices });
  return data?.find((s) => s.slug === slug)?.image_url ?? null;
}

const sfaqs = [
  { q: "Do you offer monthly retainers?", a: "Yes — monthly retainers are our most popular option. We also do one-time projects and performance-based pricing for select clients." },
  { q: "How do you measure success?", a: "We agree on KPIs upfront (ROAS, CPL, CTR, rankings, follower growth). Every report ties back to those metrics — no vanity numbers." },
  { q: "Can I hire you for a single service?", a: "Absolutely. Many clients start with one service (e.g., Meta Ads) and grow into a full package as trust builds." },
  { q: "What industries do you specialize in?", a: "E-commerce, SaaS, real estate, education, beauty, fashion, hospitality and personal brands." },
];

function ServicesFAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="bg-muted/40 py-20">
      <div className="container-px mx-auto max-w-3xl">
        <SectionHeading eyebrow="Service FAQs" title="Common questions" />
        <div className="mt-10 space-y-3">
          {sfaqs.map((f, i) => (
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
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="container-px mx-auto max-w-7xl py-16">
      <Reveal>
        <div className="rounded-3xl bg-gradient-primary text-primary-foreground p-10 md:p-14 text-center shadow-elegant">
          <h3 className="text-3xl md:text-5xl font-extrabold">Let's build your growth engine</h3>
          <p className="mt-3 text-primary-foreground/90 max-w-xl mx-auto">Free 30-minute strategy call — no obligation.</p>
          <a href={waLink("Hi Daniyal, I want to start.")} target="_blank" rel="noreferrer"
            className="mt-7 inline-flex items-center gap-2 bg-foreground text-background px-8 py-4 rounded-full font-semibold">
            Start on WhatsApp <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </Reveal>
    </section>
  );
}
