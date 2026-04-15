import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import logoSrc from "@/assets/logo.png";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/packages", label: "Packages" },
  { href: "/activities", label: "Activities" },
  { href: "/builder", label: "Build Your Trip" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isHome = location === "/";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled || !isHome
          ? "bg-white/95 backdrop-blur-md shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link href="/" className="flex items-center group">
            <img
              src={logoSrc}
              alt="Zanzibar Pearls"
              className="h-12 lg:h-14 w-auto object-contain drop-shadow-sm"
            />
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  location === link.href
                    ? scrolled || !isHome
                      ? "bg-primary text-primary-foreground"
                      : "bg-white/20 text-white"
                    : scrolled || !isHome
                    ? "text-foreground hover:bg-muted"
                    : "text-white/90 hover:text-white hover:bg-white/15"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <Link href="/builder">
              <Button
                className={`rounded-full px-6 transition-all ${
                  scrolled || !isHome
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "bg-white text-primary hover:bg-white/90"
                }`}
              >
                Plan Your Trip
              </Button>
            </Link>
          </div>

          <button
            className={`lg:hidden p-2 rounded-md transition-colors ${
              scrolled || !isHome ? "text-foreground" : "text-white"
            }`}
            onClick={() => setMenuOpen(!menuOpen)}
            data-testid="button-menu-toggle"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden bg-white/98 backdrop-blur-md border-t border-border">
          <nav className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  location === link.href
                    ? "bg-primary/10 text-primary"
                    : "text-foreground hover:bg-muted"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link href="/builder" onClick={() => setMenuOpen(false)}>
              <Button className="mt-2 w-full rounded-full bg-primary text-primary-foreground">
                Plan Your Trip
              </Button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
