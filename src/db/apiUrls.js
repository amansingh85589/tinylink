import supabase from "./supabase";

// helper: generate random code [A-Za-z0-9]{6,8}
function generateCode() {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const length = 6 + Math.floor(Math.random() * 3); // 6–8
  let out = "";
  for (let i = 0; i < length; i++) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}

// CREATE link
export async function createUrl({ title, longUrl, customUrl }, qrcodeBlob) {
  let code = customUrl?.trim() || generateCode();

  // upload QR
  const fileName = `qr-${code}.png`;
  const { error: uploadError } = await supabase.storage
    .from("qr-codes")
    .upload(fileName, qrcodeBlob, {
      contentType: "image/png",
      upsert: true,
    });

  if (uploadError) throw new Error(uploadError.message);

  const {
    data: { publicUrl },
  } = supabase.storage.from("qr-codes").getPublicUrl(fileName);

  // insert row
  const { data, error } = await supabase
    .from("urls")
    .insert([{ code, title, url: longUrl, qr: publicUrl }])
    .select()
    .single();

  if (error) {
    if (error.code === "23505") {
      // unique violation
      throw new Error("This code already exists. Please choose another.");
    }
    throw new Error("Unable to create link");
  }

  return data;
}

// LIST all links
export async function getUrls() {
  const { data, error } = await supabase
    .from("urls")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error("Unable to load links");

  return data;
}

// GET one link by code
export async function getUrl(code) {
  const { data, error } = await supabase
    .from("urls")
    .select("*")
    .eq("code", code)
    .single();

  if (error) throw new Error("Link not found");

  return data;
}


export async function deleteUrl(id) {
  const { error } = await supabase.from("urls").delete().eq("id", id);

  if (error) throw new Error("Unable to delete link");

  return true;
}


export async function incrementClick(code) {
  // First try RPC function (fast + atomic update)
  const { error: rpcError } = await supabase.rpc("increment_click", {
    p_code: code,
  });

  if (!rpcError) return;

  console.warn("RPC failed, using fallback update…", rpcError.message);

  // Fallback: manual update
  const { error: fallbackError } = await supabase
    .from("urls")
    .update({
      total_clicks: supabase.sql`total_clicks + 1`,
      last_clicked: new Date().toISOString(),
    })
    .eq("code", code);

  if (fallbackError) {
    console.error("Failed to update fallback click count:", fallbackError);
  }
}

