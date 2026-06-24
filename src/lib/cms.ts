import { supabase } from "@/integrations/supabase/client";

export type Tool = {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  duration: string;
  features: string[];
  badge: string | null;
  emoji: string;
  color: string;
  image_url: string | null;
  whatsapp_link: string | null;
  sort_order: number;
  is_active: boolean;
  is_trending?: boolean;
  is_hot?: boolean;
  is_featured?: boolean;
};

export type Service = {
  id: string;
  slug: string;
  title: string;
  eyebrow: string;
  description: string;
  features: string[];
  image_url: string | null;
  cta_text: string;
  cta_link: string | null;
  sort_order: number;
  is_active: boolean;
};

export type Testimonial = {
  id: string; name: string; role: string; quote: string; rating: number;
  avatar_url: string | null; sort_order: number; is_active: boolean;
};

export type Faq = {
  id: string; question: string; answer: string; category: string;
  sort_order: number; is_active: boolean;
};

export const fetchTools = async (): Promise<Tool[]> => {
  const { data, error } = await supabase.from("tools").select("*").eq("is_active", true).order("sort_order", { ascending: true });
  if (error) throw error;
  return data as Tool[];
};
export const fetchAllTools = async (): Promise<Tool[]> => {
  const { data, error } = await supabase.from("tools").select("*").order("sort_order");
  if (error) throw error;
  return data as Tool[];
};
export const fetchServices = async (): Promise<Service[]> => {
  const { data, error } = await supabase.from("services").select("*").eq("is_active", true).order("sort_order", { ascending: true });
  if (error) throw error;
  return data as Service[];
};
export const fetchAllServices = async (): Promise<Service[]> => {
  const { data, error } = await supabase.from("services").select("*").order("sort_order", { ascending: true });
  if (error) throw error;
  return data as Service[];
};
export const fetchTestimonials = async (): Promise<Testimonial[]> => {
  const { data, error } = await supabase.from("testimonials").select("*").eq("is_active", true).order("sort_order");
  if (error) throw error;
  return data as Testimonial[];
};
export const fetchFaqs = async (category?: string): Promise<Faq[]> => {
  let q = supabase.from("faqs").select("*").eq("is_active", true).order("sort_order");
  if (category) q = q.eq("category", category);
  const { data, error } = await q;
  if (error) throw error;
  return data as Faq[];
};

// Admin tool CRUD (RLS gates to admin role)
export const upsertTool = async (t: Partial<Tool> & { id?: string }) => {
  const payload: any = { ...t };
  if (!payload.id || String(payload.id).startsWith("new-")) delete payload.id;
  if (payload.badge === "Hot") payload.is_hot = true;
  if (payload.badge === "Trending") payload.is_trending = true;
  if (payload.badge === "Featured") payload.is_featured = true;
  payload.badge = payload.is_hot ? "Hot" : payload.is_trending ? "Trending" : payload.is_featured ? "Featured" : payload.badge ?? null;
  const { data, error } = await supabase.from("tools").upsert(payload).select().single();
  if (error) throw error;
  return data as Tool;
};
export const deleteTool = async (id: string) => {
  const { error } = await supabase.from("tools").delete().eq("id", id);
  if (error) throw error;
};

// Service edit (upsert by slug)
export const upsertService = async (s: Partial<Service> & { slug: string; title: string }) => {
  const { data, error } = await supabase.from("services").upsert(s as any, { onConflict: "slug" }).select().single();
  if (error) throw error;
  return data as Service;
};
export const deleteService = async (id: string) => {
  const { error } = await supabase.from("services").delete().eq("id", id);
  if (error) throw error;
};

// Orders
export const createOrder = async (input: { tool_id: string | null; tool_name: string; price: number; duration: string }) => {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error("Not authenticated");
  const { data, error } = await supabase.from("orders").insert({
    user_id: userData.user.id,
    tool_id: input.tool_id,
    tool_name: input.tool_name,
    price: input.price,
    duration: input.duration,
    status: "pending",
  }).select().single();
  if (error) throw error;
  return data;
};

// Messages
export const submitMessage = async (input: { name: string; email: string; phone: string; service: string; message: string }) => {
  const { data: userData } = await supabase.auth.getUser();
  const { data, error } = await supabase.from("messages").insert({
    ...input,
    user_id: userData.user?.id ?? null,
  }).select().single();
  if (error) throw error;
  return data;
};

export const uploadCmsImage = async (file: File, folder: string): Promise<string> => {
  const ext = file.name.split(".").pop();
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage.from("cms").upload(path, file, { cacheControl: "3600", upsert: false });
  if (error) throw error;
  const { data } = supabase.storage.from("cms").getPublicUrl(path);
  return data.publicUrl;
};
