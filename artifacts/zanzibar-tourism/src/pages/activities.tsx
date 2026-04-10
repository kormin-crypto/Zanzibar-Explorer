import { useState } from "react";
import { Waves, Landmark, Zap, Leaf, UtensilsCrossed } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import ActivityCard from "@/components/ActivityCard";
import { useListActivities } from "@workspace/api-client-react";

const categoryFilters = [
  { value: "", label: "All", icon: null },
  { value: "water", label: "Water Sports", icon: Waves },
  { value: "cultural", label: "Cultural", icon: Landmark },
  { value: "adventure", label: "Adventure", icon: Zap },
  { value: "nature", label: "Nature", icon: Leaf },
  { value: "food", label: "Food & Cooking", icon: UtensilsCrossed },
];

export default function ActivitiesPage() {
  const [selected, setSelected] = useState("");
  const { data: activities, isLoading } = useListActivities();

  const filtered = selected
    ? (activities || []).filter((a) => a.category === selected)
    : activities || [];

  return (
    <div className="min-h-screen bg-background pt-20">
      {/* Header */}
      <div
        className="relative py-20 lg:py-24 overflow-hidden"
        style={{
          background: "linear-gradient(135deg, hsl(185,55%,20%) 0%, hsl(16,75%,45%) 100%)",
        }}
      >
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1400')", backgroundSize: "cover", backgroundPosition: "center" }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <p className="text-sm uppercase tracking-widest text-white/70 font-medium mb-3">
            {(activities || []).length}+ Unique Experiences
          </p>
          <h1 className="font-display text-4xl lg:text-5xl font-light mb-4">
            Activities & Experiences
          </h1>
          <p className="text-white/80 max-w-xl mx-auto leading-relaxed">
            From snorkeling pristine coral reefs to exploring spice plantations — every activity is an invitation to discover a new side of Zanzibar.
          </p>
        </div>
      </div>

      {/* Category filters */}
      <div className="sticky top-16 z-30 bg-white/95 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {categoryFilters.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSelected(cat.value)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  selected === cat.value
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
                data-testid={`filter-activity-${cat.value || "all"}`}
              >
                {cat.icon && <cat.icon className="w-3.5 h-3.5" />}
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Activities grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <Skeleton key={i} className="h-72 rounded-2xl" />
            ))}
          </div>
        ) : !filtered.length ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🤿</div>
            <h3 className="font-display text-2xl font-medium mb-2">No activities found</h3>
            <p className="text-muted-foreground">Try a different category.</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-muted-foreground mb-6">
              Showing <strong>{filtered.length}</strong> activit{filtered.length !== 1 ? "ies" : "y"}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filtered.map((activity) => (
                <ActivityCard key={activity.id} activity={activity} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
