import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { BarChart3, BriefcaseBusiness, LayoutDashboard, LogOut, MessageSquare, Package, Shield, Sparkles, User as UserIcon, Users, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — Daniyal Marketing" }, { name: "robots", content: "noindex" }] }),
  component: DashboardPage,
});

type Tab = "overview" | "tools" | "orders" | "services" | "messages" | "profile" | "users" | "catalog" | "serviceManagement" | "analytics";

function DashboardPage() {
  const { user, loading, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("overview");

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/login", replace: true });
  }, [user, loading, navigate]);

  if (loading || !user) {
    return <div className="min-h-[60vh] flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;
  }

  return (
    <section className="container-px mx-auto max-w-7xl py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" /> {isAdmin ? "Admin Dashboard" : "Your Dashboard"}
        </div>
        <h1 className="mt-3 text-4xl md:text-5xl font-extrabold">
          Welcome back, <span className="text-gradient">{user.email?.toLowerCase() === "daniyalmarketingplan@gmail.com" ? "Daniyal" : (user.user_metadata?.full_name || user.email?.split("@")[0])}</span>
        </h1>
        <p className="mt-2 text-muted-foreground">{user.email}</p>
        {isAdmin && (
          <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-full">
            <Shield className="w-3.5 h-3.5" /> Admin mode enabled — edit Tools and Services from their pages
          </div>
        )}
      </motion.div>

      <div className="grid lg:grid-cols-[260px,1fr] gap-6">
        <aside className="bg-card border border-border rounded-3xl p-3 h-fit">
          {(isAdmin ? [
            { id: "overview" as const, Icon: Shield, label: "Admin Overview" },
            { id: "users" as const, Icon: Users, label: "Manage Users" },
            { id: "orders" as const, Icon: Package, label: "Manage Orders" },
            { id: "catalog" as const, Icon: LayoutDashboard, label: "Manage Tools" },
            { id: "serviceManagement" as const, Icon: BriefcaseBusiness, label: "Manage Services" },
            { id: "messages" as const, Icon: MessageSquare, label: "Manage Messages" },
            { id: "analytics" as const, Icon: BarChart3, label: "Analytics" },
          ] : [
            { id: "overview" as const, Icon: LayoutDashboard, label: "Overview" },
            { id: "tools" as const, Icon: LayoutDashboard, label: "My Tools" },
            { id: "orders" as const, Icon: Package, label: "My Orders" },
            { id: "messages" as const, Icon: MessageSquare, label: "My Messages" },
            { id: "services" as const, Icon: BriefcaseBusiness, label: "My Services" },
            { id: "profile" as const, Icon: UserIcon, label: "Profile" },
          ]).map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                tab === t.id ? "bg-primary text-primary-foreground shadow-elegant" : "text-foreground hover:bg-muted"
              }`}>
              <t.Icon className="w-4 h-4" /> {t.label}
            </button>
          ))}
          <Link to="/tools" className="mt-3 block text-center text-xs text-muted-foreground hover:text-primary py-2">
            <LayoutDashboard className="w-3.5 h-3.5 inline mr-1" /> Browse Tools
          </Link>
          <button onClick={async () => { await signOut(); navigate({ to: "/", replace: true }); }} className="w-full mt-2 text-center text-xs text-muted-foreground hover:text-primary py-2">
            <LogOut className="w-3.5 h-3.5 inline mr-1" /> Logout
          </button>
        </aside>

        <main className="min-h-[400px]">
          {tab === "overview" && <OverviewTab isAdmin={isAdmin} />}
          {tab === "tools" && <OrdersTab isAdmin={false} toolsOnly />}
          {tab === "orders" && <OrdersTab isAdmin={isAdmin} />}
          {tab === "services" && <ServicesHistoryTab />}
          {tab === "messages" && <MessagesTab isAdmin={isAdmin} />}
          {tab === "profile" && <ProfileTab />}
          {tab === "users" && isAdmin && <UsersTab />}
          {tab === "catalog" && isAdmin && <AdminLinkTab title="Tools management" copy="Add, edit, delete, upload images, change prices, and toggle Hot/Trending/Featured on the Tools page." to="/tools" />}
          {tab === "serviceManagement" && isAdmin && <AdminLinkTab title="Services management" copy="Edit service text, replace images, and update features from the Services page." to="/services" />}
          {tab === "analytics" && isAdmin && <AnalyticsTab />}
        </main>
      </div>
    </section>
  );
}

function OverviewTab({ isAdmin }: { isAdmin: boolean }) {
  return <div className="bg-card border border-border rounded-3xl p-8"><h3 className="font-bold text-2xl">{isAdmin ? "Admin Overview" : "Overview"}</h3><p className="mt-2 text-muted-foreground">{isAdmin ? "Manage users, orders, tools, services, messages and analytics from the dashboard sections." : "Track your tools, orders, messages, services and profile from the dashboard sections."}</p></div>;
}

function OrdersTab({ isAdmin, toolsOnly = false }: { isAdmin: boolean; toolsOnly?: boolean }) {
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["orders", isAdmin],
    queryFn: async () => {
      const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) return <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto mt-10" />;
  if (orders.length === 0) {
    return (
      <div className="bg-card border border-dashed border-border rounded-3xl p-12 text-center">
        <Package className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
        <h3 className="font-bold text-lg">{toolsOnly ? "No tools yet" : "No orders yet"}</h3>
        <p className="text-sm text-muted-foreground mt-1">Browse the marketplace and rent your first tool.</p>
        <Link to="/tools" className="mt-5 inline-flex items-center gap-2 bg-gradient-primary text-primary-foreground px-5 py-2.5 rounded-full text-sm font-semibold shadow-elegant">
          Explore Tools
        </Link>
      </div>
    );
  }
  return (
    <div className="space-y-3">
      {orders.map((o: any) => {
        const remaining = Math.max(0, 30 - Math.floor((Date.now() - new Date(o.created_at).getTime()) / 86400000));
        return (
        <div key={o.id} className="bg-card border border-border rounded-2xl p-5 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <div className="font-bold">{o.tool_name}</div>
            <div className="text-xs text-muted-foreground mt-0.5">
              {new Date(o.created_at).toLocaleString()} · {o.duration} · {remaining} days remaining
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-lg font-extrabold">${o.price}</div>
            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
              o.status === "active" ? "bg-primary/10 text-primary" : o.status === "completed" ? "bg-emerald-500/10 text-emerald-600" : "bg-muted text-muted-foreground"
            }`}>{o.status}</span>
          </div>
        </div>
      );})}
    </div>
  );
}

function ServicesHistoryTab() {
  const { data: messages = [], isLoading } = useQuery({
    queryKey: ["service-history"],
    queryFn: async () => {
      const { data, error } = await supabase.from("messages").select("*").neq("service", "Tool Rental").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
  if (isLoading) return <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto mt-10" />;
  if (messages.length === 0) return <EmptyBox Icon={BriefcaseBusiness} title="No service inquiries yet" copy="Your selected services and inquiries will appear here." />;
  return <MessagesList messages={messages} />;
}

function MessagesTab({ isAdmin }: { isAdmin: boolean }) {
  const { data: messages = [], isLoading } = useQuery({
    queryKey: ["messages", isAdmin],
    queryFn: async () => {
      const { data, error } = await supabase.from("messages").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) return <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto mt-10" />;
  if (messages.length === 0) {
    return (
      <div className="bg-card border border-dashed border-border rounded-3xl p-12 text-center">
        <MessageSquare className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
        <h3 className="font-bold text-lg">No messages yet</h3>
        <p className="text-sm text-muted-foreground mt-1">Your contact form submissions will appear here.</p>
      </div>
    );
  }
  return <MessagesList messages={messages} />;
}

function MessagesList({ messages }: { messages: any[] }) {
  return (
    <div className="space-y-3">
      {messages.map((m) => (
        <div key={m.id} className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div>
              <div className="font-bold">{m.name} <span className="text-xs font-normal text-muted-foreground">· {m.email}</span></div>
              <div className="text-xs text-muted-foreground mt-0.5">{new Date(m.created_at).toLocaleString()} · {m.service || "General"}</div>
            </div>
            <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-primary/10 text-primary">{m.status}</span>
          </div>
          <p className="mt-3 text-sm text-foreground/90 whitespace-pre-wrap">{m.message}</p>
          {m.phone && <div className="mt-2 text-xs text-muted-foreground">📞 {m.phone}</div>}
        </div>
      ))}
    </div>
  );
}

function UsersTab() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const [{ data: profiles }, { data: orders }, { data: messages }] = await Promise.all([
        supabase.from("profiles").select("*").order("created_at", { ascending: false }),
        supabase.from("orders").select("*"),
        supabase.from("messages").select("*"),
      ]);
      return { profiles: profiles ?? [], orders: orders ?? [], messages: messages ?? [] };
    },
  });
  if (isLoading) return <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto mt-10" />;
  return <div className="space-y-3">{(data?.profiles ?? []).map((p: any) => {
    const userOrders = data?.orders.filter((o: any) => o.user_id === p.id) ?? [];
    const userMessages = data?.messages.filter((m: any) => m.user_id === p.id) ?? [];
    const last = [...userOrders, ...userMessages].sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];
    return <div key={p.id} className="bg-card border border-border rounded-2xl p-5 grid md:grid-cols-4 gap-4">
      <div><div className="font-bold">{p.full_name || "Unnamed user"}</div><div className="text-xs text-muted-foreground">{p.email}</div></div>
      <Row label="Registered" value={new Date(p.created_at).toLocaleDateString()} />
      <Row label="Tools / Messages" value={`${userOrders.length} tools · ${userMessages.length} messages`} />
      <Row label="Last Activity" value={last ? new Date(last.created_at).toLocaleDateString() : "—"} />
    </div>;
  })}</div>;
}

function AnalyticsTab() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-analytics"],
    queryFn: async () => {
      const [profiles, orders, messages, tools, services] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("orders").select("id", { count: "exact", head: true }),
        supabase.from("messages").select("id", { count: "exact", head: true }),
        supabase.from("tools").select("id", { count: "exact", head: true }),
        supabase.from("services").select("id", { count: "exact", head: true }),
      ]);
      return [{ label: "Users", value: profiles.count ?? 0 }, { label: "Orders", value: orders.count ?? 0 }, { label: "Messages", value: messages.count ?? 0 }, { label: "Tools", value: tools.count ?? 0 }, { label: "Services", value: services.count ?? 0 }];
    },
  });
  if (isLoading) return <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto mt-10" />;
  return <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{data?.map((m) => <div key={m.label} className="bg-card border border-border rounded-2xl p-6"><div className="text-sm text-muted-foreground">{m.label}</div><div className="text-4xl font-extrabold mt-2 text-primary">{m.value}</div></div>)}</div>;
}

function AdminLinkTab({ title, copy, to }: { title: string; copy: string; to: "/tools" | "/services" }) {
  return <div className="bg-card border border-border rounded-3xl p-8"><h3 className="font-bold text-2xl">{title}</h3><p className="mt-2 text-muted-foreground">{copy}</p><Link to={to} className="mt-6 inline-flex bg-gradient-primary text-primary-foreground px-5 py-3 rounded-full text-sm font-bold">Open page editor</Link></div>;
}

function EmptyBox({ Icon, title, copy }: { Icon: typeof Package; title: string; copy: string }) {
  return <div className="bg-card border border-dashed border-border rounded-3xl p-12 text-center"><Icon className="w-10 h-10 text-muted-foreground mx-auto mb-3" /><h3 className="font-bold text-lg">{title}</h3><p className="text-sm text-muted-foreground mt-1">{copy}</p></div>;
}

function ProfileTab() {
  const { user } = useAuth();
  return (
    <div className="bg-card border border-border rounded-3xl p-7 space-y-4">
      <h3 className="font-bold text-lg">Account details</h3>
      <Row label="Full Name" value={user?.user_metadata?.full_name || "—"} />
      <Row label="Email" value={user?.email ?? "—"} />
      <Row label="User ID" value={user?.id ?? "—"} mono />
      <Row label="Member since" value={user?.created_at ? new Date(user.created_at).toLocaleDateString() : "—"} />
    </div>
  );
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-border pb-3 last:border-0">
      <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">{label}</div>
      <div className={`text-sm font-medium text-right ${mono ? "font-mono text-xs" : ""}`}>{value}</div>
    </div>
  );
}
