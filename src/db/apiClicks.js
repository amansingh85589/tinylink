import supabase from "./supabase.js";

export async function getClicksForUrls(codes) {
  if (!codes?.length) return [];
  const { data, error } = await supabase.from("clicks").select("*").in("code", codes);
  if (error) return [];
  return data;
}

export async function getClicksForUrl(code) {
  const { data, error } = await supabase.from("clicks").select("*").eq("code", code);
  if (error) throw new Error("Unable to load stats");
  return data;
}

export async function storeClicks({ code, url }) {
  await supabase.from("clicks").insert({ code, timestamp: new Date() });
  window.location.href = url;
}
