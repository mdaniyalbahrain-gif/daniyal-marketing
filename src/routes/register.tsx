import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Lock, Mail, User, ArrowRight, UserPlus, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/register")({
  head: () => ({ meta: [{ title: "Register — Daniyal Marketing" }, { name: "robots", content: "noindex" }] }),
  component: RegisterPage,
});

function RegisterPage() {
  const { signUp, user, loading } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => { if (!loading && user) navigate({ to: "/dashboard", replace: true }); }, [user, loading, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setErr(null);
    if (password.length < 6) { setErr("Password must be at least 6 characters."); return; }
    setBusy(true);
    const { error } = await signUp(email, password, fullName);
    setBusy(false);
    if (error) { setErr(error); return; }
    navigate({ to: "/dashboard", replace: true });
  };

  return (
    <section className="min-h-[80vh] flex items-center justify-center container-px py-20">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-card border border-border rounded-3xl shadow-elegant p-8">
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3">
            <UserPlus className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold">Create your account</h1>
          <p className="text-sm text-muted-foreground mt-1">Start managing tools and orders</p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input required value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Full name"
              className="w-full pl-10 pr-3 py-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email"
              className="w-full pl-10 pr-3 py-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password (min 6 chars)"
              className="w-full pl-10 pr-11 py-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary" />
            <button type="button" onClick={() => setShowPassword((v) => !v)} aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary">
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {err && <p className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg">{err}</p>}
          <button type="submit" disabled={busy}
            className="w-full inline-flex items-center justify-center gap-2 bg-gradient-primary text-primary-foreground py-3 rounded-xl font-semibold shadow-elegant hover:shadow-glow transition-all disabled:opacity-60">
            {busy ? "Creating account…" : "Create Account"} <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-5 text-center text-sm text-muted-foreground">
          Already have an account? <Link to="/login" className="text-primary font-semibold">Login</Link>
        </div>
      </motion.div>
    </section>
  );
}
