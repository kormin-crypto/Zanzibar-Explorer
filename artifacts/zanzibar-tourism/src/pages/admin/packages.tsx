import { useEffect, useState } from "react";
import AdminLayout from "./_layout";
import { adminApi, type Package, type Accommodation } from "@/lib/adminApi";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";

const categories = ["beach", "adventure", "cultural", "luxury", "family"];

const emptyForm = (): Omit<Package, "id"> => ({
  name: "",
  slug: "",
  tagline: "",
  description: "",
  category: "beach",
  minDays: 3,
  maxDays: 7,
  basePricePerPersonPerDay: 120,
  imageUrl: "",
  galleryImages: [],
  accommodationId: 0,
  highlights: [],
  isFeatured: false,
  rating: 4.5,
  reviewCount: 0,
});

function toSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export default function AdminPackages() {
  const [items, setItems] = useState<Package[]>([]);
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Package | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(emptyForm());
  const [highlightsInput, setHighlightsInput] = useState("");
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    Promise.all([adminApi.getPackages(), adminApi.getAccommodations()])
      .then(([pkgs, accs]) => { setItems(pkgs); setAccommodations(accs); })
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const field = (k: keyof typeof form, v: unknown) =>
    setForm((f) => ({
      ...f,
      [k]: v,
      ...(k === "name" && !editing ? { slug: toSlug(String(v)) } : {}),
    }));

  const startCreate = () => {
    const f = emptyForm();
    if (accommodations[0]) f.accommodationId = accommodations[0].id;
    setForm(f);
    setHighlightsInput("");
    setEditing(null);
    setCreating(true);
  };
  const startEdit = (p: Package) => {
    setForm({ ...p });
    setHighlightsInput(p.highlights.join(", "));
    setEditing(p);
    setCreating(false);
  };
  const cancel = () => { setCreating(false); setEditing(null); };

  const save = async () => {
    setSaving(true);
    const data = {
      ...form,
      highlights: highlightsInput.split(",").map((s) => s.trim()).filter(Boolean),
    };
    try {
      if (editing) {
        const updated = await adminApi.updatePackage(editing.id, data);
        setItems((prev) => prev.map((p) => (p.id === editing.id ? updated : p)));
      } else {
        const created = await adminApi.createPackage(data);
        setItems((prev) => [...prev, created]);
      }
      cancel();
    } finally {
      setSaving(false);
    }
  };

  const del = async (id: number) => {
    if (!confirm("Delete this package? This cannot be undone.")) return;
    await adminApi.deletePackage(id);
    setItems((prev) => prev.filter((p) => p.id !== id));
  };

  const showForm = creating || editing !== null;

  return (
    <AdminLayout>
      <div className="space-y-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl font-medium text-foreground">Packages</h2>
            <p className="text-sm text-muted-foreground mt-1">{items.length} packages</p>
          </div>
          {!showForm && (
            <button onClick={startCreate}
              className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-primary/90 transition-colors">
              <Plus className="w-4 h-4" /> Add Package
            </button>
          )}
        </div>

        {showForm && (
          <div className="bg-card border border-card-border rounded-xl p-5 space-y-4">
            <h3 className="font-medium text-foreground">{editing ? "Edit Package" : "New Package"}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Name</label>
                <input value={form.name} onChange={(e) => field("name", e.target.value)}
                  className="w-full border border-input rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Slug (URL)</label>
                <input value={form.slug} onChange={(e) => field("slug", e.target.value)}
                  className="w-full border border-input rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Category</label>
                <select value={form.category} onChange={(e) => field("category", e.target.value)}
                  className="w-full border border-input rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background">
                  {categories.map((c) => <option key={c} value={c} className="capitalize">{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Accommodation</label>
                <select value={form.accommodationId} onChange={(e) => field("accommodationId", Number(e.target.value))}
                  className="w-full border border-input rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background">
                  {accommodations.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Min Days</label>
                <input type="number" min={1} value={form.minDays} onChange={(e) => field("minDays", Number(e.target.value))}
                  className="w-full border border-input rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Max Days</label>
                <input type="number" min={1} value={form.maxDays} onChange={(e) => field("maxDays", Number(e.target.value))}
                  className="w-full border border-input rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Base Price / Person / Day ($)</label>
                <input type="number" value={form.basePricePerPersonPerDay} onChange={(e) => field("basePricePerPersonPerDay", Number(e.target.value))}
                  className="w-full border border-input rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Rating (1–5)</label>
                <input type="number" step="0.1" min={1} max={5} value={form.rating} onChange={(e) => field("rating", Number(e.target.value))}
                  className="w-full border border-input rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-muted-foreground mb-1">Tagline</label>
                <input value={form.tagline} onChange={(e) => field("tagline", e.target.value)} placeholder="One-line selling point"
                  className="w-full border border-input rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-muted-foreground mb-1">Image URL</label>
                <input value={form.imageUrl} onChange={(e) => field("imageUrl", e.target.value)} placeholder="https://..."
                  className="w-full border border-input rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-muted-foreground mb-1">Highlights (comma-separated)</label>
                <input value={highlightsInput} onChange={(e) => setHighlightsInput(e.target.value)}
                  placeholder="Sunset dhow cruise, Private beach, Spice farm visit"
                  className="w-full border border-input rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-muted-foreground mb-1">Description</label>
                <textarea value={form.description} onChange={(e) => field("description", e.target.value)} rows={4}
                  className="w-full border border-input rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none" />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="featured" checked={form.isFeatured} onChange={(e) => field("isFeatured", e.target.checked)} className="rounded" />
                <label htmlFor="featured" className="text-sm text-foreground">Featured on homepage</label>
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <button onClick={save} disabled={saving}
                className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors">
                <Check className="w-4 h-4" /> {saving ? "Saving..." : "Save Package"}
              </button>
              <button onClick={cancel}
                className="flex items-center gap-2 border border-input px-4 py-2 rounded-full text-sm font-medium hover:bg-muted transition-colors">
                <X className="w-4 h-4" /> Cancel
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-sm text-muted-foreground">Loading...</div>
        ) : (
          <div className="bg-card border border-card-border rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 border-b border-card-border">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Package</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider hidden sm:table-cell">Category</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider hidden md:table-cell">Duration</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Price/day</th>
                  <th className="px-4 py-3 w-20"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-card-border">
                {items.map((p) => (
                  <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-medium text-foreground">{p.name}</div>
                      <div className="text-xs text-muted-foreground truncate max-w-xs">{p.tagline}</div>
                      {p.isFeatured && <span className="text-xs text-accent font-medium">Featured</span>}
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className="capitalize text-muted-foreground">{p.category}</span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{p.minDays}–{p.maxDays} days</td>
                    <td className="px-4 py-3 text-foreground">${p.basePricePerPersonPerDay}/person</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 justify-end">
                        <button onClick={() => startEdit(p)} className="p-1.5 text-muted-foreground hover:text-primary transition-colors rounded hover:bg-primary/10">
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => del(p.id)} className="p-1.5 text-muted-foreground hover:text-destructive transition-colors rounded hover:bg-destructive/10">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
