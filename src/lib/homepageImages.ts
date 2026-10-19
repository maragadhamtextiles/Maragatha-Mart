import { supabase } from "./supabase";

/**
 * Puts a picture in the product-images bucket (admins may write there) and
 * returns its public link, which is what the database stores.
 */
export async function uploadHomepageImage(file: File, folder: "hero" | "categories" | "collections"): Promise<string> {
  if (!file.type.startsWith("image/")) throw new Error("Please choose an image file.");
  if (file.size > 5 * 1024 * 1024) throw new Error("Please choose an image under 5 MB.");
  const id = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}`;
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]+/g, "_");
  const path = `homepage/${folder}/${id}_${safeName}`;
  const { error } = await supabase.storage
    .from("product-images")
    .upload(path, file, { contentType: file.type, upsert: false });
  if (error) throw new Error(`The image could not be uploaded: ${error.message}`);
  return supabase.storage.from("product-images").getPublicUrl(path).data.publicUrl;
}
