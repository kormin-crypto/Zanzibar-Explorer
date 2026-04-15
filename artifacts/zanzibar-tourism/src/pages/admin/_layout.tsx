import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  MessageSquare,
  Package,
  Activity,
  Hotel,
  LogOut,
  Menu,
  X,
  ExternalLink,
} from "lucide-react";
import { adminApi } from "@/lib/adminApi";
import logoSrc from "@/assets/logo.png";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/inquiries", label: "Inquiries", icon: MessageSquare },
  { href: "/admin/packages", label: "Packages", icon: Package },
  { href: "/admin/activities", label: "Activities", icon: Activity },
  { href: "/admin/accommodations", label: "Accommodations", icon: Hotel },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location, navigate] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const pw = localStorage.getItem("admin_password");
    if (!pw) { navigate("/admin"); return; }
    adminApi.getInquiries().catch(() => {
      localStorage.removeItem("admin_password");
      navigate("/admin");
    });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("admin_password");
    navigate("/admin");
  };

  return (
    <div className="min-h-screen bg-muted flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-60 bg-foreground text-background flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-5 border-b border-white/10">
          <img src={logoSrc} alt="Zanzibar Pearls Admin" className="h-10 w-auto brightness-0 invert opacity-90" />
          <p className="text-xs text-background/40 mt-1 font-medium uppercase tracking-widest">Admin Panel</p>
        </div>

        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const active = location === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? "bg-primary text-white"
                    : "text-background/70 hover:bg-white/10 hover:text-background"
                }`}
              >
                <item.icon className="w-4 h-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-white/10 space-y-1">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-background/60 hover:bg-white/10 hover:text-background transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            View Website
          </a>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-background/60 hover:bg-white/10 hover:text-background transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 lg:ml-60 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-card border-b border-card-border px-4 h-14 flex items-center gap-3 shadow-sm">
          <button
            className="lg:hidden p-1.5 rounded-md hover:bg-muted transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="text-sm font-semibold text-foreground capitalize">
            {navItems.find((n) => n.href === location)?.label ?? "Admin"}
          </h1>
        </header>

        <main className="flex-1 p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
