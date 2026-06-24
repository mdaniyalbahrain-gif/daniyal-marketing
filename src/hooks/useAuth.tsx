import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

const ADMIN_EMAIL = "daniyalmarketingplan@gmail.com";

type AuthCtx = {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
};

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const syncUserAccess = async (nextUser: User | null) => {
    if (!nextUser?.email) { setRoles([]); return; }
    const email = nextUser.email.trim();
    await supabase.from("profiles").upsert({ id: nextUser.id, email, full_name: nextUser.user_metadata?.full_name ?? "" });
    const role = email.toLowerCase() === ADMIN_EMAIL ? "admin" : "user";
    await supabase.from("user_roles").upsert(
      { user_id: nextUser.id, role: role as any },
      { onConflict: "user_id,role", ignoreDuplicates: true }
    );
    const { data } = await supabase.from("user_roles").select("role").eq("user_id", nextUser.id);
    setRoles((data ?? []).map((r) => r.role));
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      setUser(s?.user ?? null);
      setTimeout(() => syncUserAccess(s?.user ?? null), 0);
    });
    supabase.auth.getSession().then(async ({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
      await syncUserAccess(data.session?.user ?? null);
      setLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  const isAdmin = !!user?.email && user.email.toLowerCase() === ADMIN_EMAIL && roles.includes("admin");

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (data.user) await syncUserAccess(data.user);
    return { error: error?.message ?? null };
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        emailRedirectTo: typeof window !== "undefined" ? window.location.origin : undefined,
        data: { full_name: fullName },
      },
    });
    if (data.user) await syncUserAccess(data.user);
    return { error: error?.message ?? null };
  };

  const signOut = async () => {
    setRoles([]);
    await supabase.auth.signOut();
  };

  return (
    <Ctx.Provider value={{ user, session, isAdmin, loading, signIn, signUp, signOut }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
