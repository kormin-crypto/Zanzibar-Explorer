import { useEffect, useState } from "react";
import AdminLayout from "./_layout";
import { adminApi, type Accommodation } from "@/lib/adminApi";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";

const types = ["villa", "eco_lodge", "boutique_hotel", "guesthouse", "resort", "apartment"];

const emptyForm = (): Omit<Accommodation, "id"> => ({
  name: "",
  type: "villa",
  description: "",
  location: "Zanzibar",
  pricePerNight: 150,
  imageUrl: "",
  amenities: [],
  stars: 4,
});

export default function AdminAccommodations() {
  const [items, setItems] = useState<Accommodation[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Accommodation | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(emptyForm());
  const [amenitiesInput, setAmenitiesInput] = useState("");
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    adminApi.getAccommodations().then(setItems).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const field = (k: keyof typeof form, v: unknown) => setForm((f) => ({ ...f, [k]: v }));

  const startCreate = () => {
    const f = emptyForm();
    setForm(f);
    setAmenitiesInput(f.amenities.join(", "));
    setEditing(null);
    setCreating(true);
  };
  const startEdit = (a: Accommodation) => {
    setForm({ ...a });
    setAmenitiesInput(a.amenities.join(", "));
    setEditing(a);
    setCreating(false);
  };
  const cancel = () => { setCreating(false); setEditing(null); };

  const save = async () => {
    setSaving(true);
    const data = {
      ...form,
      amenities: amenitiesInput.split(",").map((s) => s.trim()).filter(Boolean),
    };
    try {
      if (editing) {
        const updated = await adminApi.updateAccommodation(editing.id, data);
        setItems((prev) => prev.map((a) => (a.id === editing.id ? updated : a)));
      } else {
        const created = await adminApi.createAccommodation(data);
        setItems((prev) => [...prev, created]);
      }
      cancel();
    } finally {
      setSaving(false);
    }
  };

  const del = async (id: number) => {
    if (!confirm("Delete this accommodation?")) return;
    await adminApi.deleteAccommodation(id);
    setItems((prev) => prev.filter((a) => a.id !== id));
  };

  const showForm = creating || editing !== null;

  return (
    <AdminLayout>
      <div className="space-y-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl font-medium text-foreground">Accommodations</h2>
            <p className="text-sm text-muted-foreground mt-1">{items.length} accommodations</p>
          </div>
          {!showForm && (
            <button onClick={startCreate}
              className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-primary/90 transition-colors">
              <Plus className="w-4 h-4" /> Add Accommodation
            </button>
          )}
        </div>

        {showForm && (
          <div className="bg-card border border-card-border rounded-xl p-5 space-y-4">
            <h3 className="font-medium text-foreground">{editing ? "Edit Accommodation" : "New Accommodation"}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Name</label>
                <input value={form.name} onChange={(e) => field("name", e.target.value)}
                  className="w-full border border-input rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Type</label>
                <select value={form.type} onChange={(e) => field("type", e.target.value)}
                  className="w-full border border-input rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background">
                  {types.map((t) => <option key={t} value={t}>{t.replace("_", " ")}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Price per Night ($)</label>
                <input type="number" value={form.pricePerNight} onChange={(e) => field("pricePerNight", Number(e.target.value))}
                  className="w-full border border-input rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Stars (1–5)</label>
                <input type="number" min={1} max={5} value={form.stars} onChange={(e) => field("stars", Number(e.target.value))}
                  className="w-full border border-input rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Location</label>
                <input value={form.location} onChange={(e) => field("location", e.target.value)}
                  className="w-full border border-input rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Amenities (comma-separated)</label>
                <input value={amenitiesInput} onChange={(e) => setAmenitiesInput(e.target.value)}
                  placeholder="Pool, WiFi, Beach access"
                  className="w-full border border-input rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-muted-foreground mb-1">Image URL</label>
                <input value={form.imageUrl} onChange={(e) => field("imageUrl", e.target.value)} placeholder="https://..."
                  className="w-full border border-input rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-muted-foreground mb-1">Description</label>
                <textarea value={form.description} onChange={(e) => field("description", e.target.value)} rows={3}
                  className="w-full border border-input rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none" />
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <button onClick={save} disabled={saving}
                className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors">
                <Check className="w-4 h-4" /> {saving ? "Saving..." : "Save"}
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
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Name</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider hidden sm:table-cell">Type</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider hidden md:table-cell">Stars</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Price/Night</th>
                  <th className="px-4 py-3 w-20"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-card-border">
                {items.map((a) => (
                  <tr key={a.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-medium text-foreground">{a.name}</div>
                      <div className="text-xs text-muted-foreground">{a.location}</div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell capitalize">{a.type.replace("_", " ")}</td>
                    <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{"★".repeat(a.stars)}</td>
                    <td className="px-4 py-3 text-foreground">${a.pricePerNight}/night</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 justify-end">
                        <button onClick={() => startEdit(a)} className="p-1.5 text-muted-foreground hover:text-primary transition-colors rounded hover:bg-primary/10">
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => del(a.id)} className="p-1.5 text-muted-foreground hover:text-destructive transition-colors rounded hover:bg-destructive/10">
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
