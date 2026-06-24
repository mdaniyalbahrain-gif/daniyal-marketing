import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "en" | "ar";
export type Currency = "USD" | "BHD" | "SAR" | "PKR" | "INR";

export const RATES: Record<Currency, number> = {
  USD: 1,
  BHD: 0.376,
  SAR: 3.75,
  PKR: 280,
  INR: 83,
};

export const SYMBOLS: Record<Currency, string> = {
  USD: "$",
  BHD: "BHD ",
  SAR: "SAR ",
  PKR: "Rs ",
  INR: "₹",
};

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  currency: Currency;
  setCurrency: (c: Currency) => void;
  formatPrice: (usd: number) => string;
  t: (en: string, ar?: string) => string;
};

const LocaleCtx = createContext<Ctx | null>(null);

const DICT: Record<string, string> = {
  Home: "الرئيسية",
  Services: "الخدمات",
  Tools: "الأدوات",
  About: "حول",
  Contact: "تواصل",
  Dashboard: "لوحة التحكم",
  Login: "تسجيل الدخول",
  Register: "إنشاء حساب",
  Logout: "تسجيل الخروج",
  "Get a Quote": "اطلب عرض سعر",
};

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");
  const [currency, setCurrencyState] = useState<Currency>("USD");

  useEffect(() => {
    try {
      const l = (localStorage.getItem("language") as Lang) || "en";
      const c = (localStorage.getItem("currency") as Currency) || "USD";
      setLangState(l);
      setCurrencyState(c);
      document.documentElement.dir = l === "ar" ? "rtl" : "ltr";
      document.documentElement.lang = l;
    } catch {}
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    try { localStorage.setItem("language", l); } catch {}
    document.documentElement.dir = l === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = l;
  };
  const setCurrency = (c: Currency) => {
    setCurrencyState(c);
    try { localStorage.setItem("currency", c); } catch {}
  };

  const formatPrice = (usd: number) => {
    const v = usd * RATES[currency];
    const rounded = currency === "PKR" || currency === "INR"
      ? Math.round(v).toLocaleString()
      : v.toFixed(2);
    return `${SYMBOLS[currency]}${rounded}`;
  };

  const t = (en: string, ar?: string) => (lang === "ar" ? (ar ?? DICT[en] ?? en) : en);

  return (
    <LocaleCtx.Provider value={{ lang, setLang, currency, setCurrency, formatPrice, t }}>
      {children}
    </LocaleCtx.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleCtx);
  if (!ctx) throw new Error("useLocale must be inside LocaleProvider");
  return ctx;
}
