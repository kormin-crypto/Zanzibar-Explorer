import { Clock, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Activity } from "@workspace/api-client-react";

interface ActivityCardProps {
  activity: Activity;
  selected?: boolean;
  onToggle?: (id: number) => void;
  showCheckbox?: boolean;
}

const categoryColors: Record<string, string> = {
  water: "bg-sky-100 text-sky-700",
  cultural: "bg-amber-100 text-amber-700",
  adventure: "bg-orange-100 text-orange-700",
  nature: "bg-green-100 text-green-700",
  food: "bg-rose-100 text-rose-700",
};

export default function ActivityCard({ activity, selected, onToggle, showCheckbox }: ActivityCardProps) {
  return (
    <div
      className={`group bg-card rounded-2xl overflow-hidden border transition-all duration-200 card-hover cursor-pointer ${
        selected ? "border-primary ring-2 ring-primary/20 shadow-md" : "border-card-border shadow-sm hover:shadow-md"
      }`}
      onClick={() => onToggle?.(activity.id)}
      data-testid={`card-activity-${activity.id}`}
    >
      <div className="relative aspect-video overflow-hidden">
        <img
          src={activity.imageUrl}
          alt={activity.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        {activity.isPopular && (
          <div className="absolute top-3 left-3">
            <Badge className="bg-accent text-accent-foreground border-0 text-xs">Popular</Badge>
          </div>
        )}
        {showCheckbox && (
          <div className={`absolute top-3 right-3 w-6 h-6 rounded-full border-2 transition-all ${
            selected ? "bg-primary border-primary" : "bg-white/80 border-white"
          } flex items-center justify-center`}>
            {selected && (
              <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 12 12" fill="none">
                <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-display text-base font-semibold text-foreground leading-snug">
            {activity.name}
          </h3>
          <span className={`shrink-0 text-xs font-medium px-2 py-0.5 rounded-full capitalize ${categoryColors[activity.category] || "bg-muted text-muted-foreground"}`}>
            {activity.category}
          </span>
        </div>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{activity.description}</p>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-3 text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-primary" />
              <span>{activity.durationHours}h</span>
            </div>
          </div>
          <span className="font-display font-semibold text-primary text-base">
            ${activity.pricePerPerson}<span className="text-xs font-normal text-muted-foreground">/person</span>
          </span>
        </div>
      </div>
    </div>
  );
}
