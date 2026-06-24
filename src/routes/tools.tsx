import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Search, Sparkles, ChevronDown, MessageCircle, ArrowRight, Check, Flame, TrendingUp, Star, Loader2, Pencil, Trash2, Plus, X, Save, ShoppingCart, Upload } from "lucide-react";
import { Reveal, SectionHeading } from "@/components/Reveal";
import { fetchTools, fetchAllTools, fetchFaqs, upsertTool, deleteTool, createOrder, uploadCmsImage, type Tool } from "@/lib/cms";
import { SITE } from "@/lib/site";
import { useAuth } from "@/hooks/useAuth";
import { useLocale } from "@/lib/locale";

export const Route = createFileRoute("/tools")({
  head: () => ({
    meta: [
      { title: "Digital Tools Rental — Canva, ChatGPT, Adobe & more" },
      { name: "description", content: "Rent premium digital tools at unbeatable monthly prices." },
      { property: "og:title", content: "Tools Marketplace · Daniyal Marketing" },
      { property: "og:url", content: "/tools" },
    ],
    links: [{ rel: "canonical", href: "/tools" }],
  }),
  component: ToolsPage,
});

const CATEGORIES = ["All", "AI", "Marketing", "Design", "Video", "SEO", "Productivity"] as const;
type Filter = "all" | "trending" | "hot" | "featured";

function ToolsPage() {
  const { isAdmin, user } = useAuth();
  const qc = useQueryClient();
  const { data: tools = [], isLoading } = useQuery({ queryKey: ["tools", isAdmin], queryFn: () => isAdmin ? fetchAllTools() : fetchTools() });

  const [q, setQ] = useState("");
  const [cat, setCat] = useState<typeof CATEGORIES[number]>("All");
  const [filter, setFilter] = useState<Filter>("all");
  const [editing, setEditing] = useState<Tool | null>(null);
  const [creating, setCreating] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 2500); };

  const filtered = useMemo(() => tools.filter((t) => {
    if (cat !== "All" && t.category !== cat) return false;
    if (filter === "trending" && !(t.is_trending || t.badge === "Trending")) return false;
    if (filter === "hot" && !(t.is_hot || t.badge === "Hot")) return false;
    if (filter === "featured" && !(t.is_featured || t.badge === "Featured")) return false;
    if (q && !`${t.name} ${t.description} ${t.category}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  }), [tools, q, cat, filter]);

  const handleSave = async (t: Tool, isNew: boolean) => {
    try {
      await upsertTool(isNew ? { ...t, id: undefined } as any : t);
      await qc.invalidateQueries({ queryKey: ["tools"] });
      setEditing(null); setCreating(false);
      showToast(isNew ? "Tool created" : "Tool updated");
    } catch (e: any) { showToast(e.message || "Failed to save"); }
  };
  const handleDelete = async (id: string) => {
    if (!confirm("Delete this tool?")) return;
    try { await deleteTool(id); await qc.invalidateQueries({ queryKey: ["tools"] }); showToast("Tool deleted"); }
    catch (e: any) { showToast(e.message || "Failed to delete"); }
  };
  const toggleBadge = async (t: Tool, badge: "Hot" | "Trending" | "Featured") => {
    const key = badge === "Hot" ? "is_hot" : badge === "Trending" ? "is_trending" : "is_featured";
    await handleSave({ ...t, [key]: !t[key], badge: !t[key] ? badge : null }, false);
  };
  const handleRent = async (t: Tool) => {
    if (!user) { window.location.href = "/login"; return; }
    try {
      setBusy(t.id);
      await createOrder({ tool_id: t.id, tool_name: t.name, price: t.price, duration: t.duration });
      await qc.invalidateQueries({ queryKey: ["orders"] });
      showToast(`Order placed for ${t.name} — opening WhatsApp…`);
      const wa = `${t.whatsapp_link || SITE.whatsapp}?text=${encodeURIComponent(`Hi Daniyal, I just placed an order for ${t.name} ($${t.price}/${t.duration}). My email: ${user.email}`)}`;
      window.open(wa, "_blank");
    } catch (e: any) { showToast(e.message || "Failed to create order"); }
    finally { setBusy(null); }
  };

  return (
    <>
      <section className="relative overflow-hidden py-20 md:py-24">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="container-px mx-auto max-w-7xl relative text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" /> Tools Marketplace
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="mt-4 text-5xl md:text-7xl font-extrabold leading-[1.05]">
            Premium tools, <span className="text-gradient">affordable rent</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            className="mt-5 text-lg text-muted-foreground max-w-2xl mx-auto">
            Rent legit, ready-to-use subscriptions of Canva Pro, ChatGPT Plus, Adobe CC and more — delivered within hours.
          </motion.p>

          <div className="mt-10 max-w-2xl mx-auto relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search Canva, ChatGPT, Adobe…"
              className="w-full pl-14 pr-5 py-4 rounded-full bg-card border border-border shadow-card focus:outline-none focus:ring-2 focus:ring-primary text-foreground" />
          </div>

          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {[
              { v: "all", l: "All", Icon: Sparkles },
              { v: "trending", l: "Trending", Icon: TrendingUp },
              { v: "hot", l: "Hot", Icon: Flame },
              { v: "featured", l: "Featured", Icon: Star },
            ].map((f) => (
              <button key={f.v} onClick={() => setFilter(f.v as Filter)}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                  filter === f.v ? "bg-primary text-primary-foreground shadow-glow" : "bg-card border border-border hover:border-primary/40"
                }`}>
                <f.Icon className="w-3.5 h-3.5" /> {f.l}
              </button>
            ))}
          </div>

          <div className="mt-3 flex flex-wrap justify-center gap-2">
            {CATEGORIES.map((c) => (
              <button key={c} onClick={() => setCat(c)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  cat === c ? "bg-foreground text-background" : "bg-muted hover:bg-muted/70 text-muted-foreground"
                }`}>
                {c}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="container-px mx-auto max-w-7xl pb-10">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="text-sm text-muted-foreground">
            Showing <strong className="text-foreground">{filtered.length}</strong> of {tools.length} tools
          </div>
          {isAdmin && (
            <button onClick={() => setCreating(true)}
              className="inline-flex items-center gap-2 bg-gradient-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-semibold shadow-elegant hover:shadow-glow">
              <Plus className="w-4 h-4" /> Add Tool
            </button>
          )}
        </div>
        {isLoading ? (
          <div className="text-center py-20"><Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" /></div>
        ) : (
          <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <AnimatePresence mode="popLayout">
              {filtered.map((t) => (
                <ToolCard key={t.id} tool={t} isAdmin={isAdmin} busy={busy === t.id} loggedIn={!!user}
                  onEdit={() => setEditing(t)} onDelete={() => handleDelete(t.id)}
                  onBadge={(b) => toggleBadge(t, b)} onRent={() => handleRent(t)} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
        {!isLoading && filtered.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">No tools match your filters.</div>
        )}
      </section>

      {(editing || creating) && (
        <ToolEditor initial={editing ?? newToolTemplate()} isNew={creating}
          onClose={() => { setEditing(null); setCreating(false); }} onSave={handleSave} />
      )}

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] bg-foreground text-background px-5 py-3 rounded-full shadow-elegant text-sm font-semibold">
          {toast}
        </div>
      )}

      <ToolsFAQ />
    </>
  );
}

function newToolTemplate(): Tool {
  return {
    id: `new-${Date.now()}`,
    name: "New Tool", category: "AI", description: "Describe the tool…",
    price: 9, duration: "1 Month",
    features: ["Feature one", "Feature two", "Feature three"],
    badge: null, emoji: "🛠️", color: "from-primary/30 to-accent/20",
    image_url: null, whatsapp_link: null, sort_order: 999, is_active: true,
    is_hot: false, is_trending: false, is_featured: false,
  };
}

function ToolCard({ tool, isAdmin, loggedIn, busy, onEdit, onDelete, onBadge, onRent }: {
  tool: Tool; isAdmin: boolean; loggedIn: boolean; busy: boolean;
  onEdit: () => void; onDelete: () => void; onBadge: (b: "Hot" | "Trending" | "Featured") => void; onRent: () => void;
}) {
  const waBase = tool.whatsapp_link || SITE.whatsapp;
  const askWa = `${waBase}?text=${encodeURIComponent(`Hi Daniyal, I have a question about ${tool.name}.`)}`;
  const { formatPrice } = useLocale();
  return (
    <motion.div layout
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -6 }}
      className="tilt-card group relative bg-card border border-border rounded-3xl overflow-hidden shadow-card hover:shadow-elegant transition-shadow">
      {isAdmin && (
        <div className="absolute top-3 left-3 z-10 flex gap-1.5">
          <button onClick={onEdit} title="Edit"
            className="w-8 h-8 rounded-full bg-background/90 backdrop-blur border border-border text-foreground hover:bg-primary hover:text-primary-foreground flex items-center justify-center shadow-card">
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button onClick={onDelete} title="Delete"
            className="w-8 h-8 rounded-full bg-background/90 backdrop-blur border border-border text-foreground hover:bg-destructive hover:text-destructive-foreground flex items-center justify-center shadow-card">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
      <div className={`relative h-36 bg-gradient-to-br ${tool.color} flex items-center justify-center text-7xl overflow-hidden`}>
        {tool.image_url ? (
          <img src={tool.image_url} alt={tool.name} className="w-full h-full object-cover" loading="lazy" />
        ) : (<span>{tool.emoji}</span>)}
        {tool.badge && (
          <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase flex items-center gap-1 ${
            tool.badge === "Hot" ? "bg-rose-500 text-white" : tool.badge === "Trending" ? "bg-accent text-accent-foreground" : "bg-foreground text-background"
          }`}>
            {tool.badge === "Hot" && <Flame className="w-3 h-3"/>}
            {tool.badge === "Trending" && <TrendingUp className="w-3 h-3"/>}
            {tool.badge === "Featured" && <Star className="w-3 h-3"/>}
            {tool.badge}
          </div>
        )}
      </div>
      <div className="p-6">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-primary font-bold">{tool.category}</div>
            <h3 className="font-bold text-lg mt-0.5">{tool.name}</h3>
          </div>
          <div className="text-right">
            <div className="text-2xl font-extrabold">{formatPrice(tool.price)}</div>
            <div className="text-[10px] text-muted-foreground -mt-0.5">/ {tool.duration}</div>
          </div>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">{tool.description}</p>
        <ul className="mt-4 space-y-1.5">
          {tool.features.slice(0,3).map((f) => (
            <li key={f} className="flex items-center gap-2 text-xs"><Check className="w-3.5 h-3.5 text-primary" /> {f}</li>
          ))}
        </ul>
        {isAdmin && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {(["Hot", "Trending", "Featured"] as const).map((b) => (
              <button key={b} onClick={() => onBadge(b)}
                className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                  (b === "Hot" ? tool.is_hot : b === "Trending" ? tool.is_trending : tool.is_featured) ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary/40"
                }`}>
                {b}
              </button>
            ))}
          </div>
        )}
        <div className="mt-5 grid grid-cols-2 gap-2">
          <button onClick={onRent} disabled={busy}
            className="inline-flex items-center justify-center gap-1.5 bg-gradient-primary text-primary-foreground px-4 py-2.5 rounded-full text-sm font-semibold hover:shadow-glow transition-shadow disabled:opacity-60">
            {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ShoppingCart className="w-3.5 h-3.5" />}
            {loggedIn ? "Rent Now" : "Login to Rent"}
          </button>
          <a href={askWa} target="_blank" rel="noreferrer"
            className="inline-flex items-center justify-center gap-1.5 bg-muted text-foreground px-4 py-2.5 rounded-full text-sm font-semibold hover:bg-muted/70 transition-colors">
            <MessageCircle className="w-3.5 h-3.5" /> Ask
          </a>
        </div>
        {!loggedIn && (
          <div className="mt-2 text-center text-[11px] text-muted-foreground">
            <Link to="/register" className="text-primary font-semibold">Create an account</Link> to track orders
          </div>
        )}
      </div>
    </motion.div>
  );
}

function ToolEditor({ initial, isNew, onClose, onSave }: {
  initial: Tool; isNew: boolean; onClose: () => void; onSave: (t: Tool, isNew: boolean) => void;
}) {
  const [t, setT] = useState<Tool>(initial);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const update = <K extends keyof Tool>(k: K, v: Tool[K]) => setT((p) => ({ ...p, [k]: v }));
  const uploadImage = async (file?: File) => {
    if (!file) return;
    setUploading(true);
    try { update("image_url", await uploadCmsImage(file, "tools")); }
    finally { setUploading(false); }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="bg-card border border-border rounded-3xl shadow-elegant w-full max-w-lg my-8">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h3 className="font-bold text-lg">{isNew ? "Add New Tool" : "Edit Tool"}</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-muted flex items-center justify-center">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-5 space-y-3 max-h-[70vh] overflow-y-auto">
          <Field label="Name"><input value={t.name} onChange={(e) => update("name", e.target.value)} className="inp" /></Field>
          <Field label="Category">
            <select value={t.category} onChange={(e) => update("category", e.target.value)} className="inp">
              {CATEGORIES.filter((c) => c !== "All").map((c) => <option key={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Description">
            <textarea value={t.description} onChange={(e) => update("description", e.target.value)} rows={3} className="inp" />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Price (USD)">
              <input type="number" value={t.price} onChange={(e) => update("price", Number(e.target.value))} className="inp" />
            </Field>
            <Field label="Duration">
              <input value={t.duration} onChange={(e) => update("duration", e.target.value)} className="inp" />
            </Field>
          </div>
          <Field label="Image URL (optional)">
            <input value={t.image_url ?? ""} onChange={(e) => update("image_url", e.target.value || null)} placeholder="https://…" className="inp" />
          </Field>
          <label className="flex items-center justify-center gap-2 cursor-pointer rounded-xl border border-dashed border-border bg-muted/40 px-4 py-3 text-sm font-semibold text-foreground hover:border-primary/40">
            <Upload className="w-4 h-4 text-primary" /> {uploading ? "Uploading…" : "Upload Tool Image"}
            <input type="file" accept="image/*" className="hidden" onChange={(e) => uploadImage(e.target.files?.[0])} />
          </label>
          <Field label="Emoji (fallback)">
            <input value={t.emoji} onChange={(e) => update("emoji", e.target.value)} className="inp" />
          </Field>
          <Field label="Badge">
            <select value={t.badge ?? ""} onChange={(e) => update("badge", (e.target.value || null) as Tool["badge"])} className="inp">
              <option value="">None</option>
              <option>Hot</option><option>Trending</option><option>Featured</option>
            </select>
          </Field>
          <Field label="Features (one per line)">
            <textarea value={t.features.join("\n")} rows={4}
              onChange={(e) => update("features", e.target.value.split("\n").filter(Boolean))} className="inp" />
          </Field>
          <div className="grid grid-cols-2 gap-2 text-sm font-semibold">
            {([[
              "is_hot", "Hot badge"], ["is_trending", "Trending badge"], ["is_featured", "Featured badge"], ["is_active", "Enabled"]] as const).map(([key, label]) => (
              <label key={key} className="flex items-center gap-2 rounded-xl bg-muted/50 px-3 py-2">
                <input type="checkbox" checked={Boolean(t[key])} onChange={(e) => update(key, e.target.checked as any)} /> {label}
              </label>
            ))}
          </div>
        </div>
        <div className="p-5 border-t border-border flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded-full text-sm font-semibold bg-muted hover:bg-muted/70">Cancel</button>
          <button disabled={saving} onClick={async () => { setSaving(true); await onSave(t, isNew); setSaving(false); }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold bg-gradient-primary text-primary-foreground shadow-elegant hover:shadow-glow disabled:opacity-60">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save
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

function ToolsFAQ() {
  const { data: faqs = [] } = useQuery({ queryKey: ["faqs", "tools"], queryFn: () => fetchFaqs("tools") });
  const [open, setOpen] = useState<number | null>(0);
  if (faqs.length === 0) return null;
  return (
    <section className="bg-muted/40 py-20">
      <div className="container-px mx-auto max-w-3xl">
        <SectionHeading eyebrow="Rental FAQs" title="Everything you need to know" />
        <div className="mt-10 space-y-3">
          {faqs.map((f, i) => (
            <Reveal key={f.id} delay={i*0.05}>
              <div className="bg-card border border-border rounded-2xl overflow-hidden">
                <button onClick={() => setOpen(open===i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left font-semibold">
                  {f.question}
                  <ChevronDown className={`w-5 h-5 text-primary transition-transform ${open===i ? "rotate-180" : ""}`} />
                </button>
                <motion.div initial={false} animate={{ height: open===i ? "auto" : 0, opacity: open===i ? 1 : 0 }} className="overflow-hidden">
                  <div className="px-5 pb-5 text-sm text-muted-foreground whitespace-pre-wrap">{f.answer}</div>
                </motion.div>
              </div>
            </Reveal>
          ))}
        </div>
        <div className="mt-10 text-center">
          <a href={`${SITE.whatsapp}?text=${encodeURIComponent("Hi Daniyal, I have a tools rental question.")}`} target="_blank" rel="noreferrer"
            className="inline-flex items-center gap-2 bg-gradient-primary text-primary-foreground px-6 py-3 rounded-full font-semibold shadow-elegant hover:shadow-glow">
            <MessageCircle className="w-4 h-4" /> Ask on WhatsApp <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
