import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, MessageCircle, LogOut, LayoutDashboard, LogIn, UserPlus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@/assets/logo.png";
import { SITE, waLink } from "@/lib/site";
import { useAuth } from "@/hooks/useAuth";
import { useLocale, type Lang, type Currency } from "@/lib/locale";

const links = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/tools", label: "Tools" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { user, isAdmin, signOut } = useAuth();
  const { lang, setLang, currency, setCurrency, t } = useLocale();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = async () => {
    await signOut();
    navigate({ to: "/" });
  };

  return (
    <motion.header
      initial={{ y: -80 }} animate={{ y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-background/85 backdrop-blur-lg border-b border-border shadow-sm" : "bg-transparent"
      }`}>
      <div className="container-px mx-auto max-w-7xl flex items-center justify-between h-18 py-3">
        <Link to="/" className="flex items-center gap-2.5 group">
          <img src={logo} alt={SITE.name} className="h-11 w-11 object-contain transition-transform group-hover:scale-110" />
          <div className="leading-tight hidden sm:block">
            <div className="text-primary font-extrabold text-sm tracking-tight whitespace-nowrap">DANIYAL DESIGNER</div>
            <div className="text-foreground font-bold text-[10px] tracking-wider uppercase opacity-80">Marketing Planner</div>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {links.map((l) => (
            <Link key={l.to} to={l.to}
              className="relative px-4 py-2 text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
              activeProps={{ className: "text-primary font-semibold" }}
              activeOptions={{ exact: l.to === "/" }}>
              {({ isActive }) => (
                <>
                  {t(l.label)}
                  {isActive && <motion.span layoutId="nav-underline" className="absolute left-3 right-3 -bottom-0.5 h-0.5 bg-primary rounded-full" />}
                </>
              )}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <select aria-label="Language" value={lang} onChange={(e) => setLang(e.target.value as Lang)}
            className="hidden sm:block bg-muted/60 text-foreground text-xs font-bold rounded-full px-2 py-1.5 border border-border focus:outline-none focus:ring-2 focus:ring-primary/40">
            <option value="en">EN</option>
            <option value="ar">عربي</option>
          </select>
          <select aria-label="Currency" value={currency} onChange={(e) => setCurrency(e.target.value as Currency)}
            className="hidden sm:block bg-muted/60 text-foreground text-xs font-bold rounded-full px-2 py-1.5 border border-border focus:outline-none focus:ring-2 focus:ring-primary/40">
            <option value="USD">USD</option>
            <option value="BHD">BHD</option>
            <option value="SAR">SAR</option>
            <option value="PKR">PKR</option>
            <option value="INR">INR</option>
          </select>
          {user ? (
            <>
              <Link to="/dashboard" className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-bold hover:bg-primary/20">
                <LayoutDashboard className="w-3.5 h-3.5" /> Dashboard{isAdmin && " (Admin)"}
              </Link>
              <button onClick={handleLogout} className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-muted text-foreground text-xs font-bold hover:bg-muted/70">
                <LogOut className="w-3.5 h-3.5" /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-foreground text-xs font-bold hover:bg-muted">
                <LogIn className="w-3.5 h-3.5" /> Login
              </Link>
              <Link to="/register" className="hidden md:inline-flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-2 rounded-full text-xs font-bold hover:bg-primary/20">
                <UserPlus className="w-3.5 h-3.5" /> Register
              </Link>
            </>
          )}
          <a href={waLink("Hi Daniyal, I'd like a free consultation.")} target="_blank" rel="noreferrer"
            className="hidden md:inline-flex items-center gap-2 bg-gradient-primary text-primary-foreground px-5 py-2.5 rounded-full text-sm font-semibold shadow-elegant hover:shadow-glow transition-all hover:-translate-y-0.5">
            <MessageCircle className="w-4 h-4" /> Get a Quote
          </a>
          <button aria-label="Toggle menu" onClick={() => setOpen((v) => !v)}
            className="lg:hidden p-2 rounded-md text-foreground hover:bg-muted">
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="lg:hidden overflow-hidden bg-background border-t border-border">
            <div className="container-px mx-auto max-w-7xl py-4 flex flex-col gap-1">
              {links.map((l) => (
                <Link key={l.to} to={l.to} onClick={() => setOpen(false)}
                  className="px-3 py-3 rounded-lg text-base font-medium text-foreground hover:bg-muted"
                  activeProps={{ className: "bg-muted text-primary" }} activeOptions={{ exact: l.to === "/" }}>
                  {l.label}
                </Link>
              ))}
              {user ? (
                <>
                  <Link to="/dashboard" onClick={() => setOpen(false)}
                    className="px-3 py-3 rounded-lg text-base font-semibold text-primary bg-primary/10">
                    <LayoutDashboard className="w-4 h-4 inline mr-2" /> Dashboard{isAdmin && " (Admin)"}
                  </Link>
                  <button onClick={() => { handleLogout(); setOpen(false); }}
                    className="px-3 py-3 rounded-lg text-base font-semibold text-foreground bg-muted text-left">
                    <LogOut className="w-4 h-4 inline mr-2" /> Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setOpen(false)} className="px-3 py-3 rounded-lg text-base font-medium hover:bg-muted">
                    <LogIn className="w-4 h-4 inline mr-2" /> Login
                  </Link>
                  <Link to="/register" onClick={() => setOpen(false)} className="px-3 py-3 rounded-lg text-base font-semibold text-primary bg-primary/10">
                    <UserPlus className="w-4 h-4 inline mr-2" /> Register
                  </Link>
                </>
              )}
              <a href={waLink("Hi Daniyal, I'd like a free consultation.")} target="_blank" rel="noreferrer"
                className="mt-2 inline-flex items-center justify-center gap-2 bg-gradient-primary text-primary-foreground px-5 py-3 rounded-full text-sm font-semibold">
                <MessageCircle className="w-4 h-4" /> Get a Quote
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
