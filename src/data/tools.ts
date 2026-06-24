export type Tool = {
  id: string;
  name: string;
  category: "AI" | "Marketing" | "Design" | "Video" | "SEO" | "Productivity";
  description: string;
  price: number; // USD / month
  duration: string;
  features: string[];
  badge?: "Hot" | "Trending" | "Featured";
  emoji: string;
  color: string; // tailwind gradient stop
};

export const TOOLS: Tool[] = [
  { id: "canva-pro", name: "Canva Pro", category: "Design", description: "Full Canva Pro suite with premium templates, brand kits, and background remover.", price: 4, duration: "1 Month", features: ["Premium templates", "Brand kit", "Background remover", "100GB storage"], badge: "Hot", emoji: "🎨", color: "from-sky-400 to-indigo-500" },
  { id: "capcut-pro", name: "CapCut Pro", category: "Video", description: "Pro video editing with premium effects, transitions, and cloud rendering.", price: 5, duration: "1 Month", features: ["Premium effects", "4K export", "Cloud space", "AI tools"], badge: "Trending", emoji: "🎬", color: "from-fuchsia-500 to-pink-500" },
  { id: "chatgpt-plus", name: "ChatGPT Plus", category: "AI", description: "GPT-4o, advanced reasoning, image generation and priority access.", price: 14, duration: "1 Month", features: ["GPT-4o", "DALL·E", "Voice mode", "Priority"], badge: "Featured", emoji: "🤖", color: "from-emerald-400 to-teal-500" },
  { id: "adobe-cc", name: "Adobe Creative Cloud", category: "Design", description: "Photoshop, Illustrator, Premiere Pro, After Effects and more.", price: 18, duration: "1 Month", features: ["All apps", "100GB cloud", "Fonts", "Stock"], badge: "Hot", emoji: "🅰️", color: "from-rose-500 to-orange-500" },
  { id: "envato", name: "Envato Elements", category: "Design", description: "Unlimited downloads — videos, music, templates, fonts and graphics.", price: 9, duration: "1 Month", features: ["Unlimited DLs", "Commercial license", "Stock video", "Premium fonts"], emoji: "🧩", color: "from-lime-400 to-emerald-500" },
  { id: "semrush", name: "SEMrush", category: "SEO", description: "Industry-leading SEO, PPC and competitor research toolkit.", price: 29, duration: "1 Month", features: ["Keyword research", "Site audit", "Backlinks", "Competitor data"], badge: "Featured", emoji: "📈", color: "from-orange-400 to-amber-500" },
  { id: "ahrefs", name: "Ahrefs", category: "SEO", description: "Premium SEO suite with backlinks, rank tracking and content explorer.", price: 35, duration: "1 Month", features: ["Site explorer", "Content gap", "Rank tracker", "Alerts"], badge: "Trending", emoji: "🔍", color: "from-blue-500 to-cyan-500" },
  { id: "notion-ai", name: "Notion AI", category: "Productivity", description: "AI-powered notes, docs and workspace for teams and solo creators.", price: 6, duration: "1 Month", features: ["AI writing", "Unlimited blocks", "Collab", "Templates"], emoji: "📝", color: "from-zinc-400 to-zinc-600" },
  { id: "midjourney", name: "Midjourney", category: "AI", description: "World-class AI image generation — perfect for ads, branding and content.", price: 12, duration: "1 Month", features: ["Fast hours", "Commercial use", "Stealth mode", "200 imgs"], badge: "Hot", emoji: "🖼️", color: "from-violet-500 to-purple-600" },
  { id: "grammarly", name: "Grammarly Premium", category: "Productivity", description: "Advanced writing assistant — tone, clarity and plagiarism checks.", price: 5, duration: "1 Month", features: ["Tone detector", "Plagiarism", "Rewrites", "Vocabulary"], emoji: "✍️", color: "from-green-500 to-emerald-600" },
  { id: "linkedin-prem", name: "LinkedIn Premium", category: "Marketing", description: "Unlock InMail, advanced search and business insights.", price: 15, duration: "1 Month", features: ["InMail", "Who viewed", "Insights", "Learning"], emoji: "💼", color: "from-blue-600 to-sky-700" },
  { id: "elevenlabs", name: "ElevenLabs Pro", category: "AI", description: "Hyper-realistic AI voice generation for reels, ads and dubbing.", price: 10, duration: "1 Month", features: ["Voice clone", "Multilingual", "Pro voices", "Commercial"], badge: "Trending", emoji: "🎙️", color: "from-pink-500 to-rose-500" },
];

export const TOOL_CATEGORIES = ["All", "AI", "Marketing", "Design", "Video", "SEO", "Productivity"] as const;
