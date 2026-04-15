import { useEffect, useState } from "react";
import AdminLayout from "./_layout";
import { adminApi, type Inquiry } from "@/lib/adminApi";
import { Trash2, RefreshCw } from "lucide-react";

const statuses = ["pending", "contacted", "confirmed", "cancelled"];

const statusColor: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  contacted: "bg-blue-100 text-blue-800",
  confirmed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

export default function AdminInquiries() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const load = () => {
    setLoading(true);
    adminApi.getInquiries().then((data) => setInquiries(data.slice().reverse())).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const filtered = filter === "all" ? inquiries : inquiries.filter((i) => i.status === filter);

  const handleStatus = async (id: number, status: string) => {
    const updated = await adminApi.updateInquiryStatus(id, status);
    setInquiries((prev) => prev.map((i) => (i.id === id ? { ...i, status: updated.status } : i)));
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this inquiry?")) return;
    await adminApi.deleteInquiry(id);
    setInquiries((prev) => prev.filter((i) => i.id !== id));
  };

  return (
    <AdminLayout>
      <div className="space-y-5">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <h2 className="font-display text-2xl font-medium text-foreground">Inquiries</h2>
            <p className="text-sm text-muted-foreground mt-1">Booking inquiries from customers</p>
          </div>
          <button onClick={load} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 flex-wrap">
          {["all", ...statuses].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-colors ${
                filter === s ? "bg-primary text-white" : "bg-card border border-card-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {s} {s === "all" ? `(${inquiries.length})` : `(${inquiries.filter((i) => i.status === s).length})`}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-sm text-muted-foreground">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="bg-card border border-card-border rounded-xl p-8 text-center text-sm text-muted-foreground">
            No inquiries found.
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((inq) => (
              <div key={inq.id} className="bg-card border border-card-border rounded-xl p-4 lg:p-5">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-foreground">{inq.firstName} {inq.lastName}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${statusColor[inq.status] ?? "bg-muted text-muted-foreground"}`}>
                        {inq.status}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground mt-0.5">{inq.email}{inq.phone ? ` · ${inq.phone}` : ""}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {inq.numberOfVisitors} visitor{inq.numberOfVisitors !== 1 ? "s" : ""} · {inq.numberOfDays} day{inq.numberOfDays !== 1 ? "s" : ""}
                      {inq.preferredStartDate ? ` · Start: ${inq.preferredStartDate}` : ""}
                      {inq.estimatedTotal ? ` · Est. $${inq.estimatedTotal.toLocaleString()}` : ""}
                    </div>
                    <p className="text-sm text-foreground/80 mt-2 leading-relaxed max-w-xl">{inq.message}</p>
                    <div className="text-xs text-muted-foreground mt-2">
                      Received {new Date(inq.createdAt).toLocaleString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <select
                      value={inq.status}
                      onChange={(e) => handleStatus(inq.id, e.target.value)}
                      className="text-xs border border-input rounded-lg px-2 py-1.5 bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      {statuses.map((s) => (
                        <option key={s} value={s} className="capitalize">{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                      ))}
                    </select>
                    <button
                      onClick={() => handleDelete(inq.id)}
                      className="p-1.5 text-muted-foreground hover:text-destructive transition-colors rounded-md hover:bg-destructive/10"
                      title="Delete inquiry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
