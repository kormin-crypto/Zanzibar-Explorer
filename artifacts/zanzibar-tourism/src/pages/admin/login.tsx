import { useState } from "react";
import { useLocation } from "wouter";
import { adminApi } from "@/lib/adminApi";
import logoSrc from "@/assets/logo.png";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [, navigate] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await adminApi.login(password);
      navigate("/admin/dashboard");
    } catch {
      setError("Incorrect password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <img src={logoSrc} alt="Zanzibar Pearls" className="h-16 w-auto mx-auto mb-4 object-contain" />
          <h1 className="font-display text-2xl font-medium text-foreground">Admin Panel</h1>
          <p className="text-sm text-muted-foreground mt-1">Sign in to manage your website content</p>
        </div>
        <form
          onSubmit={handleSubmit}
          className="bg-card border border-card-border rounded-2xl p-6 shadow-sm space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-input rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter admin password"
              autoFocus
              data-testid="input-admin-password"
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <button
            type="submit"
            disabled={loading || !password}
            className="w-full bg-primary text-primary-foreground rounded-full py-2.5 text-sm font-medium disabled:opacity-50 hover:bg-primary/90 transition-colors"
            data-testid="button-admin-login"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
        <p className="text-center text-xs text-muted-foreground mt-4">
          <a href="/" className="hover:text-primary transition-colors">← Back to website</a>
        </p>
      </div>
    </div>
  );
}
