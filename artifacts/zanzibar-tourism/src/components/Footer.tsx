import { Link } from "wouter";
import { Mail, Phone, MapPin, Facebook, Instagram, Youtube } from "lucide-react";
import logoSrc from "@/assets/logo.png";

export default function Footer() {
  return (
    <footer className="bg-foreground text-background/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div className="lg:col-span-1">
            <div className="flex items-center mb-4">
              <img
                src={logoSrc}
                alt="Zanzibar Pearls"
                className="h-12 w-auto object-contain brightness-0 invert opacity-90"
              />
            </div>
            <p className="text-sm text-background/60 leading-relaxed mb-5">
              Your gateway to the magic of Zanzibar — the Spice Island of East Africa. Unforgettable experiences crafted with care.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-8 h-8 rounded-full bg-white/10 hover:bg-primary/30 flex items-center justify-center transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/10 hover:bg-primary/30 flex items-center justify-center transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/10 hover:bg-primary/30 flex items-center justify-center transition-colors">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-display text-background font-medium mb-4 text-base">Explore</h4>
            <ul className="space-y-2 text-sm text-background/60">
              {[
                { href: "/packages", label: "All Packages" },
                { href: "/activities", label: "Activities" },
                { href: "/builder", label: "Build Your Trip" },
                { href: "/contact", label: "Contact Us" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-primary transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display text-background font-medium mb-4 text-base">Packages</h4>
            <ul className="space-y-2 text-sm text-background/60">
              {[
                "Beach Escape",
                "Cultural Journey",
                "Ocean Adventure",
                "Luxury Honeymoon",
                "Family Safari",
              ].map((name) => (
                <li key={name}>
                  <Link href="/packages" className="hover:text-primary transition-colors">
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display text-background font-medium mb-4 text-base">Contact</h4>
            <ul className="space-y-3 text-sm text-background/60">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                <span>Shangani Street, Stone Town<br />Zanzibar, Tanzania</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary shrink-0" />
                <span>+255 777 123 456</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary shrink-0" />
                <span>info@zanzibar-pearls.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-background/40">
          <p>© 2026 Zanzibar Pearls. All rights reserved.</p>
          <p>Crafted with passion for the Spice Island</p>
        </div>
      </div>
    </footer>
  );
}
