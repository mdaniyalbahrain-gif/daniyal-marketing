import { useEffect, useState } from "react";
import type { Tool, Service } from "@/lib/cms";

const KEY = "dm_overrides_v1";
const EVT = "dm-overrides-change";

export type ToolOverride = Partial<Pick<Tool, "name" | "category" | "description" | "price" | "duration" | "badge" | "image_url" | "is_active">>;
export type ServiceOverride = Partial<Pick<Service, "title" | "eyebrow" | "description" | "features" | "image_url">>;

export type OverridesData = {
  tools: Record<string, ToolOverride>;
  toolsDeleted: string[];
  toolsAdded: Tool[];
  services: Record<string, ServiceOverride>;
};

const empty: OverridesData = { tools: {}, toolsDeleted: [], toolsAdded: [], services: {} };

export function readOverrides(): OverridesData {
  if (typeof window === "undefined") return empty;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return empty;
    const parsed = JSON.parse(raw);
    return { ...empty, ...parsed };
  } catch {
    return empty;
  }
}

export function writeOverrides(o: OverridesData) {
  try {
    localStorage.setItem(KEY, JSON.stringify(o));
    window.dispatchEvent(new Event(EVT));
  } catch {}
}

export function useOverrides(): [OverridesData, (updater: (o: OverridesData) => OverridesData) => void] {
  const [data, setData] = useState<OverridesData>(empty);

  useEffect(() => {
    setData(readOverrides());
    const h = () => setData(readOverrides());
    window.addEventListener(EVT, h);
    window.addEventListener("storage", h);
    return () => {
      window.removeEventListener(EVT, h);
      window.removeEventListener("storage", h);
    };
  }, []);

  const update = (updater: (o: OverridesData) => OverridesData) => {
    const next = updater(readOverrides());
    writeOverrides(next);
    setData(next);
  };

  return [data, update];
}

export function applyToolOverrides(tools: Tool[], o: OverridesData): Tool[] {
  const merged = tools
    .filter((t) => !o.toolsDeleted.includes(t.id))
    .map((t) => ({ ...t, ...(o.tools[t.id] ?? {}) }));
  return [...merged, ...o.toolsAdded.filter((t) => !o.toolsDeleted.includes(t.id))];
}

export function applyServiceOverrides(services: Service[], o: OverridesData): Service[] {
  return services.map((s) => ({ ...s, ...(o.services[s.id] ?? {}) }));
}
