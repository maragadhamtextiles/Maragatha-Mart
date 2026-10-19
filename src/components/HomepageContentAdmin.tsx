import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { ArrowDown, ArrowUp, Eye, EyeOff, ImagePlus, Loader2, Plus, Save, Trash2 } from "lucide-react";
import { supabase } from "../lib/supabase";
import { uploadHomepageImage } from "../lib/homepageImages";
import { SilkCollectionsAdmin } from "./SilkCollectionsAdmin";
import { useHeroSlides, type HeroSlideRow } from "../hooks/useHeroSlides";
import { useCategories } from "../hooks/useCategories";

const input = "w-full border border-card-border/60 rounded-lg px-3 py-2 bg-background text-sm";
const label = "block text-xs font-semibold uppercase tracking-wide text-text/60 mb-1";

type Draft = Omit<HeroSlideRow, "id"> & { id?: string };

const EMPTY: Draft = {
  image_url: "",
  eyebrow: "",
  title: "",
  subtitle: "",
  cta_label: "Shop Now",
  cta_link: "/shop",
  secondary_label: "",
  secondary_link: "",
  sort_order: 0,
  is_active: true,
};

function SlideEditor({
  slide,
  onSaved,
  onDelete,
  onMove,
  isFirst,
  isLast,
}: {
  slide: Draft;
  onSaved: () => void;
  onDelete?: () => void;
  onMove?: (dir: -1 | 1) => void;
  isFirst?: boolean;
  isLast?: boolean;
}) {
  const [draft, setDraft] = useState<Draft>(slide);
  const [busy, setBusy] = useState(false);
  const file = useRef<HTMLInputElement>(null);
  useEffect(() => setDraft(slide), [slide]);

  const set = (k: keyof Draft) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setDraft((d) => ({ ...d, [k]: e.target.value }));

  const pickImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;
    setBusy(true);
    try {
      const url = await uploadHomepageImage(f, "hero");
      setDraft((d) => ({ ...d, image_url: url }));
      toast.success("Photo uploaded — remember to save the slide");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  };

  const save = async () => {
    if (!draft.image_url) return toast.error("Add a photo for this slide.");
    if (!draft.title.trim()) return toast.error("Give the slide a title.");
    setBusy(true);
    // Blank optional fields are stored as null so the banner simply leaves
    // them out rather than showing an empty button.
    const row = {
      image_url: draft.image_url,
      eyebrow: draft.eyebrow?.trim() || null,
      title: draft.title.trim(),
      subtitle: draft.subtitle?.trim() || null,
      cta_label: draft.cta_label?.trim() || null,
      cta_link: draft.cta_link?.trim() || null,
      secondary_label: draft.secondary_label?.trim() || null,
      secondary_link: draft.secondary_link?.trim() || null,
      sort_order: Number(draft.sort_order) || 0,
      is_active: draft.is_active,
      updated_at: new Date().toISOString(),
    };
    const { error } = draft.id
      ? await supabase.from("hero_slides").update(row).eq("id", draft.id)
      : await supabase.from("hero_slides").insert(row);
    setBusy(false);
    if (error) return toast.error(`Could not save the slide: ${error.message}`);
    toast.success("Slide saved");
    onSaved();
  };

  return (
    <div className={`rounded-xl border p-4 ${draft.is_active ? "border-primary-yellow/50" : "border-card-border/40 opacity-70"}`}>
      <div className="grid gap-4 md:grid-cols-[10rem_1fr]">
        <div>
          <div className="aspect-[4/5] rounded-t-full rounded-b-xl overflow-hidden bg-brand-emerald ring-1 ring-brand-gold/60 flex items-center justify-center">
            {draft.image_url ? (
              <img src={draft.image_url} alt="" className="w-full h-full object-cover object-top" />
            ) : (
              <ImagePlus className="w-8 h-8 text-brand-gold" />
            )}
          </div>
          <input ref={file} type="file" accept="image/*" className="hidden" onChange={pickImage} />
          <button
            type="button"
            onClick={() => file.current?.click()}
            disabled={busy}
            className="mt-2 w-full text-xs font-semibold py-1.5 rounded-lg border border-primary-orange text-primary-orange hover:bg-primary-orange hover:text-white transition-colors"
          >
            {draft.image_url ? "Replace photo" : "Upload photo"}
          </button>
          <p className="text-[11px] text-text/50 mt-1">Portrait works best (4:5).</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className={label}>Small heading</label>
            <input className={input} value={draft.eyebrow ?? ""} onChange={set("eyebrow")} placeholder="Maragatha Silks" />
          </div>
          <div>
            <label className={label}>Title *</label>
            <input className={input} value={draft.title} onChange={set("title")} placeholder="Kanchipuram Silk Sarees" />
          </div>
          <div className="sm:col-span-2">
            <label className={label}>Description</label>
            <textarea className={input} rows={2} value={draft.subtitle ?? ""} onChange={set("subtitle")} />
          </div>
          <div>
            <label className={label}>Button text</label>
            <input className={input} value={draft.cta_label ?? ""} onChange={set("cta_label")} />
          </div>
          <div>
            <label className={label}>Button link</label>
            <input className={input} value={draft.cta_link ?? ""} onChange={set("cta_link")} placeholder="/silks" />
          </div>
          <div>
            <label className={label}>Second button text</label>
            <input className={input} value={draft.secondary_label ?? ""} onChange={set("secondary_label")} />
          </div>
          <div>
            <label className={label}>Second button link</label>
            <input className={input} value={draft.secondary_link ?? ""} onChange={set("secondary_link")} placeholder="/shop" />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-card-border/30">
        {onMove && (
          <>
            <button type="button" onClick={() => onMove(-1)} disabled={isFirst || busy} className="p-2 rounded-lg hover:bg-card disabled:opacity-30" title="Move earlier">
              <ArrowUp className="w-4 h-4" />
            </button>
            <button type="button" onClick={() => onMove(1)} disabled={isLast || busy} className="p-2 rounded-lg hover:bg-card disabled:opacity-30" title="Move later">
              <ArrowDown className="w-4 h-4" />
            </button>
          </>
        )}
        <button
          type="button"
          onClick={() => setDraft((d) => ({ ...d, is_active: !d.is_active }))}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm hover:bg-card"
        >
          {draft.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          {draft.is_active ? "Shown" : "Hidden"}
        </button>
        <div className="flex-1" />
        {onDelete && (
          <button type="button" onClick={onDelete} disabled={busy} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30">
            <Trash2 className="w-4 h-4" /> Delete
          </button>
        )}
        <button type="button" onClick={save} disabled={busy} className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-semibold bg-primary-orange text-white disabled:opacity-50">
          {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save slide
        </button>
      </div>
    </div>
  );
}

function CategoryPictures() {
  const { categories, loading } = useCategories();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [local, setLocal] = useState<Record<string, string | null>>({});
  const pickFor = useRef<string | null>(null);
  const file = useRef<HTMLInputElement>(null);

  const setPicture = async (id: string, url: string | null) => {
    const { error } = await supabase.from("categories").update({ image_url: url }).eq("id", id);
    if (error) throw new Error(error.message);
    setLocal((m) => ({ ...m, [id]: url }));
  };

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    e.target.value = "";
    const id = pickFor.current;
    if (!f || !id) return;
    setBusyId(id);
    try {
      await setPicture(id, await uploadHomepageImage(f, "categories"));
      toast.success("Category picture updated");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setBusyId(null);
    }
  };

  if (loading) return <Loader2 className="w-6 h-6 animate-spin text-primary-orange" />;
  if (!categories.length) {
    return <p className="text-sm text-text/60">No categories yet. Add them from Stock Management.</p>;
  }

  return (
    <>
      <input ref={file} type="file" accept="image/*" className="hidden" onChange={onFile} />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {categories.map((c) => {
          const url = c.id in local ? local[c.id] : c.image_url;
          const shows = url && /^((https?:)?\/\/|\/)/.test(url);
          return (
            <div key={c.id} className="text-center">
              <div className="w-24 h-24 mx-auto rounded-full p-[3px] bg-gradient-to-br from-[#E9C866] via-[#C9A227] to-[#9A7417]">
                <div className="w-full h-full rounded-full overflow-hidden bg-brand-emerald flex items-center justify-center">
                  {busyId === c.id ? (
                    <Loader2 className="w-6 h-6 animate-spin text-brand-gold" />
                  ) : shows ? (
                    <img src={url!} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <ImagePlus className="w-6 h-6 text-brand-gold" />
                  )}
                </div>
              </div>
              <p className="text-sm font-semibold mt-2 line-clamp-1">{c.name}</p>
              <div className="flex justify-center gap-2 mt-1">
                <button
                  type="button"
                  disabled={busyId !== null}
                  onClick={() => {
                    pickFor.current = c.id;
                    file.current?.click();
                  }}
                  className="text-xs text-primary-orange hover:underline"
                >
                  {shows ? "Change" : "Add picture"}
                </button>
                {shows && (
                  <button
                    type="button"
                    disabled={busyId !== null}
                    onClick={async () => {
                      try {
                        await setPicture(c.id, null);
                        toast.success("Picture removed");
                      } catch (err) {
                        toast.error(err instanceof Error ? err.message : "Could not remove it");
                      }
                    }}
                    className="text-xs text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

/**
 * Admin Settings → Homepage: the banner slides and the category pictures,
 * both stored in the database and read by the storefront as they are.
 */
export function HomepageContentAdmin() {
  const { slides, loading, refresh } = useHeroSlides(true);
  const [adding, setAdding] = useState(false);

  const move = async (index: number, dir: -1 | 1) => {
    const a = slides[index];
    const b = slides[index + dir];
    if (!a || !b) return;
    // Renumber the whole list so equal sort_orders cannot make a swap a no-op.
    const order = [...slides];
    order[index] = b;
    order[index + dir] = a;
    const results = await Promise.all(
      order.map((s, i) => supabase.from("hero_slides").update({ sort_order: i + 1 }).eq("id", s.id))
    );
    const failed = results.find((r) => r.error);
    if (failed?.error) toast.error(`Could not reorder: ${failed.error.message}`);
    refresh();
  };

  const remove = async (id: string) => {
    if (!window.confirm("Delete this slide? This cannot be undone.")) return;
    const { error } = await supabase.from("hero_slides").delete().eq("id", id);
    if (error) return toast.error(`Could not delete: ${error.message}`);
    toast.success("Slide deleted");
    refresh();
  };

  return (
    <div className="space-y-8">
      <div className="bg-card p-6 rounded-xl shadow border border-card-border/10">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-xl font-bold flex items-center gap-2">🖼️ Homepage banner</h2>
          {!adding && (
            <button
              type="button"
              onClick={() => setAdding(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold border border-primary-orange text-primary-orange hover:bg-primary-orange hover:text-white"
            >
              <Plus className="w-4 h-4" /> Add slide
            </button>
          )}
        </div>
        <p className="text-sm text-text/60 mb-5">
          The slides at the top of the home page, in this order. Hidden slides are kept but not shown.
        </p>

        <div className="space-y-4">
          {adding && (
            <SlideEditor
              slide={{ ...EMPTY, sort_order: slides.length + 1 }}
              onSaved={() => {
                setAdding(false);
                refresh();
              }}
              onDelete={() => setAdding(false)}
            />
          )}
          {loading ? (
            <Loader2 className="w-6 h-6 animate-spin text-primary-orange" />
          ) : slides.length === 0 && !adding ? (
            <p className="text-sm text-text/60">No slides yet. The home page shows the brand banner until you add one.</p>
          ) : (
            slides.map((s, i) => (
              <SlideEditor
                key={s.id}
                slide={s}
                onSaved={refresh}
                onDelete={() => remove(s.id)}
                onMove={(dir) => move(i, dir)}
                isFirst={i === 0}
                isLast={i === slides.length - 1}
              />
            ))
          )}
        </div>
      </div>

      <SilkCollectionsAdmin />

      <div className="bg-card p-6 rounded-xl shadow border border-card-border/10">
        <h2 className="text-xl font-bold mb-1 flex items-center gap-2">🗂️ Category pictures</h2>
        <p className="text-sm text-text/60 mb-5">
          Shown in “Shop by Category” on the home page. A square photo works best.
        </p>
        <CategoryPictures />
      </div>
    </div>
  );
}
