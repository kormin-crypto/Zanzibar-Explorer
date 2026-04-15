import { useEffect, useState } from "react";
import AdminLayout from "./_layout";
import { adminApi, type Activity } from "@/lib/adminApi";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";

const categories = ["Water", "Cultural", "Adventure", "Nature", "Food"];

const emptyForm = (): Omit<Activity, "id"> => ({
  name: "",
  description: "",
  category: "Water",
  durationHours: 2,
  pricePerPerson: 50,
  imageUrl: "",
  isPopular: false,
});

export default function AdminActivities() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Activity | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(emptyForm());
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    adminApi.getActivities().then(setActivities).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const field = (k: keyof typeof form, v: unknown) => setForm((f) => ({ ...f, [k]: v }));

  const startCreate = () => { setForm(emptyForm()); setEditing(null); setCreating(true); };
  const startEdit = (a: Activity) => { setForm({ ...a }); setEditing(a); setCreating(false); };
  const cancel = () => { setCreating(false); setEditing(null); };

  const save = async () => {
    setSaving(true);
    try {
      if (editing) {
        const updated = await adminApi.updateActivity(editing.id, form);
        setActivities((prev) => prev.map((a) => (a.id === editing.id ? updated : a)));
      } else {
        const created = await adminApi.createActivity(form);
        setActivities((prev) => [...prev, created]);
      }
      cancel();
    } finally {
      setSaving(false);
    }
  };

  const del = async (id: number) => {
    if (!confirm("Delete this activity?")) return;
    await adminApi.deleteActivity(id);
    setActivities((prev) => prev.filter((a) => a.id !== id));
  };

  const showForm = creating || editing !== null;

  return (
    <AdminLayout>
      <div className="space-y-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl font-medium text-foreground">Activities</h2>
            <p className="text-sm text-muted-foreground mt-1">{activities.length} activities</p>
          </div>
          {!showForm && (
            <button
              onClick={startCreate}
              className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              <Plus className="w-4 h-4" /> Add Activity
            </button>
          )}
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-card border border-card-border rounded-xl p-5 space-y-4">
            <h3 className="font-medium text-foreground">{editing ? "Edit Activity" : "New Activity"}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Name</label>
                <input value={form.name} onChange={(e) => field("name", e.target.value)}
                  className="w-full border border-input rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Category</label>
                <select value={form.category} onChange={(e) => field("category", e.target.value)}
                  className="w-full border border-input rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background">
                  {categories.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Price per Person ($)</label>
                <input type="number" value={form.pricePerPerson} onChange={(e) => field("pricePerPerson", Number(e.target.value))}
                  className="w-full border border-input rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Duration (hours)</label>
                <input type="number" step="0.5" value={form.durationHours} onChange={(e) => field("durationHours", Number(e.target.value))}
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
              <div className="flex items-center gap-2">
                <input type="checkbox" id="popular" checked={form.isPopular} onChange={(e) => field("isPopular", e.target.checked)}
                  className="rounded border-input" />
                <label htmlFor="popular" className="text-sm text-foreground">Mark as popular</label>
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
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider hidden sm:table-cell">Category</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider hidden md:table-cell">Duration</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Price</th>
                  <th className="px-4 py-3 w-20"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-card-border">
                {activities.map((a) => (
                  <tr key={a.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-medium text-foreground">{a.name}</div>
                      {a.isPopular && <span className="text-xs text-accent font-medium">Popular</span>}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">{a.category}</td>
                    <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{a.durationHours}h</td>
                    <td className="px-4 py-3 text-foreground">${a.pricePerPerson}/person</td>
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
