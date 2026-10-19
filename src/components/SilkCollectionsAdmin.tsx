import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { ArrowDown, ArrowUp, Eye, EyeOff, ImagePlus, Loader2, Plus, Save, Trash2 } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useSilkCollections, type SilkCollectionRow } from "../hooks/useSilkCollections";
import { uploadHomepageImage } from "../lib/homepageImages";

const input = "w-full border border-card-border/60 rounded-lg px-3 py-2 bg-background text-sm";
const label = "block text-xs font-semibold uppercase tracking-wide text-text/60 mb-1";

type Draft = Omit<SilkCollectionRow, "id" | "keywords"> & { id?: string; keywordsText: string };

function toDraft(r: SilkCollectionRow): Draft {
  return { ...r, keywordsText: (r.keywords ?? []).join(", ") };
}

function slugify(name: string) {
  return name.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function CollectionEditor({
  initial,
  onSaved,
  onDelete,
  onMove,
  isFirst,
  isLast,
}: {
  initial: Draft;
  onSaved: () => void;
  onDelete: () => void;
  onMove?: (dir: -1 | 1) => void;
  isFirst?: boolean;
  isLast?: boolean;
}) {
  const [d, setD] = useState<Draft>(initial);
  const [busy, setBusy] = useState(false);
  const file = useRef<HTMLInputElement>(null);

  const set = (k: keyof Draft) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setD((x) => ({ ...x, [k]: e.target.value }));

  const pick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;
    setBusy(true);
    try {
      const url = await uploadHomepageImage(f, "collections");
      setD((x) => ({ ...x, image_url: url }));
      toast.success("Photo uploaded — remember to save");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  };

  const save = async () => {
    if (!d.name.trim()) return toast.error("Give the collection a name.");
    const keywords = d.keywordsText
      .split(",")
      .map((k) => k.trim().toLowerCase())
      .filter(Boolean);
    if (!keywords.length) return toast.error("Add at least one keyword, or no saree will be listed in it.");
    setBusy(true);
    const row = {
      slug: d.slug || slugify(d.name),
      name: d.name.trim(),
      blurb: d.blurb?.trim() || null,
      image_url: d.image_url || null,
      keywords,
      sort_order: Number(d.sort_order) || 0,
      is_active: d.is_active,
      updated_at: new Date().toISOString(),
    };
    const { error } = d.id
      ? await supabase.from("silk_collections").update(row).eq("id", d.id)
      : await supabase.from("silk_collections").insert(row);
    setBusy(false);
    if (error) {
      return toast.error(
        /duplicate key/i.test(error.message) ? "A collection with that name already exists." : `Could not save: ${error.message}`
      );
    }
    toast.success("Collection saved");
    onSaved();
  };

  return (
    <div className={`rounded-xl border p-4 ${d.is_active ? "border-primary-yellow/50" : "border-card-border/40 opacity-70"}`}>
      <div className="grid gap-4 sm:grid-cols-[8rem_1fr]">
        <div>
          <div className="aspect-[4/5] rounded-xl overflow-hidden bg-brand-emerald ring-1 ring-brand-gold/60 flex items-center justify-center">
            {d.image_url ? (
              <img src={d.image_url} alt="" className="w-full h-full object-cover object-top" />
            ) : (
              <ImagePlus className="w-7 h-7 text-brand-gold" />
            )}
          </div>
          <input ref={file} type="file" accept="image/*" className="hidden" onChange={pick} />
          <button
            type="button"
            onClick={() => file.current?.click()}
            disabled={busy}
            className="mt-2 w-full text-xs font-semibold py-1.5 rounded-lg border border-primary-orange text-primary-orange hover:bg-primary-orange hover:text-white transition-colors"
          >
            {d.image_url ? "Replace photo" : "Upload photo"}
          </button>
        </div>
        <div className="grid gap-3">
          <div>
            <label className={label}>Name *</label>
            <input className={input} value={d.name} onChange={set("name")} placeholder="Kanchipuram Pattu" />
          </div>
          <div>
            <label className={label}>Description</label>
            <textarea className={input} rows={2} value={d.blurb ?? ""} onChange={set("blurb")} />
          </div>
          <div>
            <label className={label}>Keywords (comma separated) *</label>
            <input className={input} value={d.keywordsText} onChange={set("keywordsText")} placeholder="kanchi, pattu" />
            <p className="text-[11px] text-text/50 mt-1">
              A saree is listed here when its name or category contains one of these words.
            </p>
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
          onClick={() => setD((x) => ({ ...x, is_active: !x.is_active }))}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm hover:bg-card"
        >
          {d.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          {d.is_active ? "Shown" : "Hidden"}
        </button>
        <div className="flex-1" />
        <button type="button" onClick={onDelete} disabled={busy} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30">
          <Trash2 className="w-4 h-4" /> Delete
        </button>
        <button type="button" onClick={save} disabled={busy} className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-semibold bg-primary-orange text-white disabled:opacity-50">
          {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save
        </button>
      </div>
    </div>
  );
}

/** Admin Settings → Homepage → Maragatha Silks collections. */
export function SilkCollectionsAdmin() {
  const { rows, loading, refresh } = useSilkCollections(true);
  const [adding, setAdding] = useState(false);

  const move = async (index: number, dir: -1 | 1) => {
    const order = [...rows];
    const [a, b] = [order[index], order[index + dir]];
    if (!a || !b) return;
    order[index] = b;
    order[index + dir] = a;
    const results = await Promise.all(
      order.map((r, i) => supabase.from("silk_collections").update({ sort_order: i + 1 }).eq("id", r.id))
    );
    const failed = results.find((r) => r.error);
    if (failed?.error) toast.error(`Could not reorder: ${failed.error.message}`);
    refresh();
  };

  const remove = async (id: string) => {
    if (!window.confirm("Delete this collection? Its sarees stay in the shop.")) return;
    const { error } = await supabase.from("silk_collections").delete().eq("id", id);
    if (error) return toast.error(`Could not delete: ${error.message}`);
    toast.success("Collection deleted");
    refresh();
  };

  return (
    <div className="bg-card p-6 rounded-xl shadow border border-card-border/10">
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-xl font-bold flex items-center gap-2">🥻 Maragatha Silks collections</h2>
        {!adding && (
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold border border-primary-orange text-primary-orange hover:bg-primary-orange hover:text-white"
          >
            <Plus className="w-4 h-4" /> Add collection
          </button>
        )}
      </div>
      <p className="text-sm text-text/60 mb-5">
        The collection cards on the home page and the Silks page, in this order. A portrait photo (4:5) works best.
      </p>
      <div className="space-y-4">
        {adding && (
          <CollectionEditor
            initial={{ slug: "", name: "", blurb: "", image_url: null, keywordsText: "", sort_order: rows.length + 1, is_active: true }}
            onSaved={() => {
              setAdding(false);
              refresh();
            }}
            onDelete={() => setAdding(false)}
          />
        )}
        {loading ? (
          <Loader2 className="w-6 h-6 animate-spin text-primary-orange" />
        ) : (
          rows.map((r, i) => (
            <CollectionEditor
              key={r.id}
              initial={toDraft(r)}
              onSaved={refresh}
              onDelete={() => remove(r.id)}
              onMove={(dir) => move(i, dir)}
              isFirst={i === 0}
              isLast={i === rows.length - 1}
            />
          ))
        )}
      </div>
    </div>
  );
}
