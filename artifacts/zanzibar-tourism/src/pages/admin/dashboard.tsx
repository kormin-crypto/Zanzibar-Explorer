import { useEffect, useState } from "react";
import AdminLayout from "./_layout";
import { adminApi, type Inquiry } from "@/lib/adminApi";
import { Package, Activity, Hotel, MessageSquare, Clock, CheckCircle, AlertCircle, TrendingUp } from "lucide-react";
import { Link } from "wouter";

const statusColor: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  contacted: "bg-blue-100 text-blue-800",
  confirmed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

export default function AdminDashboard() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [counts, setCounts] = useState({ packages: 0, activities: 0, accommodations: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      adminApi.getInquiries(),
      adminApi.getPackages(),
      adminApi.getActivities(),
      adminApi.getAccommodations(),
    ]).then(([inqs, pkgs, acts, accs]) => {
      setInquiries(inqs.slice().reverse());
      setCounts({ packages: pkgs.length, activities: acts.length, accommodations: accs.length });
    }).finally(() => setLoading(false));
  }, []);

  const pending = inquiries.filter((i) => i.status === "pending").length;
  const confirmed = inquiries.filter((i) => i.status === "confirmed").length;

  const stats = [
    { label: "Total Inquiries", value: inquiries.length, icon: MessageSquare, color: "bg-primary/10 text-primary", href: "/admin/inquiries" },
    { label: "Pending", value: pending, icon: Clock, color: "bg-yellow-100 text-yellow-700", href: "/admin/inquiries" },
    { label: "Confirmed", value: confirmed, icon: CheckCircle, color: "bg-green-100 text-green-700", href: "/admin/inquiries" },
    { label: "Packages", value: counts.packages, icon: Package, color: "bg-accent/10 text-accent", href: "/admin/packages" },
    { label: "Activities", value: counts.activities, icon: Activity, color: "bg-purple-100 text-purple-700", href: "/admin/activities" },
    { label: "Accommodations", value: counts.accommodations, icon: Hotel, color: "bg-blue-100 text-blue-700", href: "/admin/accommodations" },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="font-display text-2xl font-medium text-foreground">Dashboard</h2>
          <p className="text-sm text-muted-foreground mt-1">Overview of your Zanzibar Pearls website</p>
        </div>

        {loading ? (
          <div className="text-sm text-muted-foreground">Loading...</div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {stats.map((s) => (
                <Link key={s.label} href={s.href}>
                  <div className="bg-card border border-card-border rounded-xl p-4 hover:shadow-md transition-shadow cursor-pointer">
                    <div className={`w-9 h-9 rounded-lg ${s.color} flex items-center justify-center mb-3`}>
                      <s.icon className="w-5 h-5" />
                    </div>
                    <div className="text-2xl font-bold text-foreground">{s.value}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Recent inquiries */}
            <div className="bg-card border border-card-border rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-card-border flex items-center justify-between">
                <h3 className="font-medium text-foreground flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  Recent Inquiries
                </h3>
                <Link href="/admin/inquiries" className="text-xs text-primary hover:underline">View all</Link>
              </div>
              {inquiries.length === 0 ? (
                <div className="px-5 py-8 text-center text-sm text-muted-foreground">
                  No inquiries yet. They'll appear here when customers submit the contact form.
                </div>
              ) : (
                <div className="divide-y divide-card-border">
                  {inquiries.slice(0, 8).map((inq) => (
                    <div key={inq.id} className="px-5 py-3 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-foreground truncate">
                          {inq.firstName} {inq.lastName}
                        </div>
                        <div className="text-xs text-muted-foreground truncate">{inq.email}</div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs text-muted-foreground hidden sm:block">
                          {inq.numberOfVisitors}p · {inq.numberOfDays}d
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${statusColor[inq.status] ?? "bg-muted text-muted-foreground"}`}>
                          {inq.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick tip */}
            {pending > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">
                    You have {pending} pending {pending === 1 ? "inquiry" : "inquiries"}
                  </p>
                  <p className="text-xs text-yellow-700 mt-0.5">
                    <Link href="/admin/inquiries" className="underline">Go to inquiries</Link> to follow up with customers.
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </AdminLayout>
  );
}
