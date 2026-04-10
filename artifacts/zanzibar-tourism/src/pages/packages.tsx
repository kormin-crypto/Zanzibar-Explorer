import { useState } from "react";
import { Filter, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import PackageCard from "@/components/PackageCard";
import { useListPackages } from "@workspace/api-client-react";

const categories = [
  { value: "", label: "All Packages" },
  { value: "beach", label: "Beach" },
  { value: "adventure", label: "Adventure" },
  { value: "cultural", label: "Cultural" },
  { value: "luxury", label: "Luxury" },
  { value: "family", label: "Family" },
];

const durationFilters = [
  { label: "Any Duration", min: undefined, max: undefined },
  { label: "Weekend (2–4 days)", min: 2, max: 4 },
  { label: "Short (5–7 days)", min: 5, max: 7 },
  { label: "Extended (8–14 days)", min: 8, max: 14 },
];

export default function PackagesPage() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedDuration, setSelectedDuration] = useState(0);

  const dur = durationFilters[selectedDuration];
  const { data: packages, isLoading } = useListPackages(
    {
      ...(selectedCategory ? { category: selectedCategory } : {}),
      ...(dur.min !== undefined ? { minDays: dur.min } : {}),
      ...(dur.max !== undefined ? { maxDays: dur.max } : {}),
    },
    { query: { queryKey: ["packages", selectedCategory, selectedDuration] } }
  );

  return (
    <div className="min-h-screen bg-background pt-20">
      {/* Page header */}
      <div className="ocean-gradient text-white py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm uppercase tracking-widest text-white/70 font-medium mb-3">
            Curated Experiences
          </p>
          <h1 className="font-display text-4xl lg:text-5xl font-light mb-4">
            Our Packages
          </h1>
          <p className="text-white/80 max-w-xl mx-auto leading-relaxed">
            From barefoot beach retreats to deep-ocean adventures, discover the package that matches your dream Zanzibar journey.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="sticky top-16 z-30 bg-white/95 backdrop-blur-md border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Filter className="w-4 h-4" />
              <span>Filter by:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === cat.value
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                  data-testid={`filter-category-${cat.value || "all"}`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
              <select
                className="text-sm border border-border rounded-full px-3 py-1.5 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                value={selectedDuration}
                onChange={(e) => setSelectedDuration(Number(e.target.value))}
                data-testid="filter-duration"
              >
                {durationFilters.map((d, i) => (
                  <option key={i} value={i}>{d.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Package grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-96 rounded-2xl" />
            ))}
          </div>
        ) : !packages?.length ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🏖️</div>
            <h3 className="font-display text-2xl font-medium mb-2">No packages found</h3>
            <p className="text-muted-foreground mb-6">Try adjusting your filters to find more options.</p>
            <Button
              variant="outline"
              onClick={() => { setSelectedCategory(""); setSelectedDuration(0); }}
              className="rounded-full"
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <>
            <p className="text-sm text-muted-foreground mb-6">
              Showing <strong>{packages.length}</strong> package{packages.length !== 1 ? "s" : ""}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {packages.map((pkg) => (
                <PackageCard key={pkg.id} pkg={pkg} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
