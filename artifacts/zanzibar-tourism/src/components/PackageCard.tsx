import { Link } from "wouter";
import { Star, Clock, Users, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Package } from "@workspace/api-client-react";

interface PackageCardProps {
  pkg: Package;
}

const categoryColors: Record<string, string> = {
  beach: "bg-sky-100 text-sky-700",
  adventure: "bg-orange-100 text-orange-700",
  cultural: "bg-amber-100 text-amber-700",
  luxury: "bg-purple-100 text-purple-700",
  family: "bg-green-100 text-green-700",
};

export default function PackageCard({ pkg }: PackageCardProps) {
  return (
    <Link href={`/packages/${pkg.id}`} data-testid={`card-package-${pkg.id}`}>
      <div className="group bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-lg card-hover border border-card-border cursor-pointer h-full flex flex-col">
        <div className="relative overflow-hidden aspect-[16/10]">
          <img
            src={pkg.imageUrl}
            alt={pkg.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          {pkg.isFeatured && (
            <div className="absolute top-3 left-3">
              <Badge className="bg-accent text-accent-foreground border-0 text-xs font-medium">
                Featured
              </Badge>
            </div>
          )}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${categoryColors[pkg.category] || "bg-white/20 text-white"}`}>
              {pkg.category}
            </span>
            <div className="flex items-center gap-1 text-white text-sm">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="font-medium">{pkg.rating.toFixed(1)}</span>
              <span className="text-white/70">({pkg.reviewCount})</span>
            </div>
          </div>
        </div>

        <div className="p-5 flex flex-col flex-1">
          <h3 className="font-display text-xl font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
            {pkg.name}
          </h3>
          <p className="text-sm text-muted-foreground mb-3 leading-relaxed line-clamp-2">
            {pkg.tagline}
          </p>

          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-primary" />
              <span>{pkg.minDays}–{pkg.maxDays} days</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-primary" />
              <span>{pkg.includedActivities.length} activities</span>
            </div>
          </div>

          <div className="mt-auto flex items-center justify-between pt-3 border-t border-border">
            <div>
              <span className="text-xs text-muted-foreground">From</span>
              <div className="font-display text-2xl font-semibold text-primary">
                ${pkg.basePricePerPersonPerDay}
                <span className="text-sm font-normal text-muted-foreground">/person/day</span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-sm font-medium text-primary group-hover:gap-2 transition-all">
              View Details <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
