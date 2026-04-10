import { useState } from "react";
import { useParams, Link } from "wouter";
import { Star, Clock, Users, MapPin, ArrowLeft, ChevronLeft, ChevronRight, Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import ActivityCard from "@/components/ActivityCard";
import { useGetPackage, useEstimateCost } from "@workspace/api-client-react";

export default function PackageDetailPage() {
  const params = useParams<{ id: string }>();
  const packageId = Number(params.id);

  const [visitors, setVisitors] = useState(2);
  const [days, setDays] = useState<number | null>(null);
  const [galleryIndex, setGalleryIndex] = useState(0);

  const { data: pkg, isLoading } = useGetPackage(packageId, {
    query: { enabled: !!packageId, queryKey: ["package", packageId] },
  });

  const estimateMutation = useEstimateCost();

  const handleEstimate = () => {
    if (!pkg) return;
    estimateMutation.mutate({
      data: {
        accommodationId: pkg.accommodation.id,
        activityIds: pkg.includedActivities.map((a) => a.id),
        numberOfVisitors: visitors,
        numberOfDays: days ?? pkg.minDays,
      },
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <Skeleton className="h-[50vh] w-full rounded-2xl mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-24 w-full" />
            </div>
            <Skeleton className="h-64 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!pkg) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background pt-20">
        <div className="text-center">
          <div className="text-5xl mb-4">🏖️</div>
          <h2 className="font-display text-2xl font-medium mb-2">Package not found</h2>
          <Link href="/packages">
            <Button variant="outline" className="rounded-full mt-4">Back to Packages</Button>
          </Link>
        </div>
      </div>
    );
  }

  const allImages = [pkg.imageUrl, ...pkg.galleryImages].filter(Boolean);
  const effectiveDays = days ?? pkg.minDays;
  const estimate = estimateMutation.data;

  return (
    <div className="min-h-screen bg-background pt-20">
      {/* Back link */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <Link href="/packages" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Packages
        </Link>
      </div>

      {/* Hero gallery */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
        <div className="relative rounded-2xl overflow-hidden aspect-[16/7] bg-muted">
          <img
            src={allImages[galleryIndex]}
            alt={pkg.name}
            className="w-full h-full object-cover transition-all duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          {allImages.length > 1 && (
            <>
              <button
                onClick={() => setGalleryIndex((i) => (i - 1 + allImages.length) % allImages.length)}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-md transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setGalleryIndex((i) => (i + 1) % allImages.length)}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-md transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {allImages.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setGalleryIndex(i)}
                    className={`w-2 h-2 rounded-full transition-all ${i === galleryIndex ? "bg-white w-6" : "bg-white/50"}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <Badge className="capitalize bg-primary/10 text-primary border-0">{pkg.category}</Badge>
                <div className="flex items-center gap-1 text-sm">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <strong>{pkg.rating.toFixed(1)}</strong>
                  <span className="text-muted-foreground">({pkg.reviewCount} reviews)</span>
                </div>
              </div>
              <h1 className="font-display text-3xl lg:text-4xl font-medium text-foreground mb-2">
                {pkg.name}
              </h1>
              <p className="text-lg text-muted-foreground italic">{pkg.tagline}</p>
            </div>

            <div className="flex flex-wrap gap-5 text-sm text-muted-foreground border-y border-border py-5">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                <span><strong className="text-foreground">{pkg.minDays}–{pkg.maxDays} days</strong> duration</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                <span><strong className="text-foreground">{pkg.includedActivities.length}</strong> activities included</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span>{pkg.accommodation.location}</span>
              </div>
            </div>

            <div>
              <h2 className="font-display text-2xl font-medium mb-3">About This Package</h2>
              <p className="text-muted-foreground leading-relaxed">{pkg.description}</p>
            </div>

            <div>
              <h2 className="font-display text-2xl font-medium mb-4">Package Highlights</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {pkg.highlights.map((h, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-primary" />
                    </div>
                    <span className="text-foreground">{h}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Accommodation */}
            <div>
              <h2 className="font-display text-2xl font-medium mb-4">Accommodation</h2>
              <div className="bg-card border border-card-border rounded-2xl overflow-hidden flex flex-col sm:flex-row">
                <img
                  src={pkg.accommodation.imageUrl}
                  alt={pkg.accommodation.name}
                  className="w-full sm:w-48 h-48 sm:h-auto object-cover"
                />
                <div className="p-5 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-display text-xl font-semibold">{pkg.accommodation.name}</h3>
                    <div className="flex">
                      {Array.from({ length: pkg.accommodation.stars }).map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />{pkg.accommodation.location}
                  </p>
                  <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{pkg.accommodation.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {pkg.accommodation.amenities.slice(0, 5).map((a) => (
                      <span key={a} className="text-xs bg-muted text-muted-foreground px-2.5 py-1 rounded-full">{a}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Included Activities */}
            {pkg.includedActivities.length > 0 && (
              <div>
                <h2 className="font-display text-2xl font-medium mb-4">Included Activities</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {pkg.includedActivities.map((activity) => (
                    <ActivityCard key={activity.id} activity={activity} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar — Price Estimator */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-card border border-card-border rounded-2xl p-6 shadow-md">
              <h3 className="font-display text-xl font-semibold mb-1">Estimate Your Cost</h3>
              <p className="text-sm text-muted-foreground mb-5">
                From <strong className="text-primary text-base">${pkg.basePricePerPersonPerDay}</strong>/person/day
              </p>

              <div className="space-y-4 mb-5">
                <div>
                  <label className="text-sm font-medium text-foreground block mb-1.5">
                    Number of visitors
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setVisitors(Math.max(1, visitors - 1))}
                      className="w-8 h-8 rounded-full border border-border hover:bg-muted flex items-center justify-center text-foreground"
                    >−</button>
                    <span className="font-semibold text-lg w-8 text-center">{visitors}</span>
                    <button
                      onClick={() => setVisitors(visitors + 1)}
                      className="w-8 h-8 rounded-full border border-border hover:bg-muted flex items-center justify-center text-foreground"
                    >+</button>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground block mb-1.5">
                    Number of days
                  </label>
                  <select
                    className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                    value={effectiveDays}
                    onChange={(e) => setDays(Number(e.target.value))}
                    data-testid="select-days"
                  >
                    {Array.from({ length: pkg.maxDays - pkg.minDays + 1 }, (_, i) => pkg.minDays + i).map((d) => (
                      <option key={d} value={d}>{d} days</option>
                    ))}
                  </select>
                </div>
              </div>

              <Button
                className="w-full rounded-full bg-primary text-primary-foreground mb-4"
                onClick={handleEstimate}
                disabled={estimateMutation.isPending}
                data-testid="button-calculate-cost"
              >
                {estimateMutation.isPending ? "Calculating..." : "Calculate Cost"}
              </Button>

              {estimate && (
                <div className="bg-muted/50 rounded-xl p-4 mb-4 space-y-2 text-sm">
                  {estimate.breakdown.map((item, i) => (
                    <div key={i} className="flex items-start justify-between gap-2">
                      <span className="text-muted-foreground">{item.label}</span>
                      <span className="font-medium text-foreground shrink-0">${item.amount.toFixed(0)}</span>
                    </div>
                  ))}
                  <div className="border-t border-border pt-2 mt-2 flex items-center justify-between font-semibold">
                    <span>Total</span>
                    <span className="text-primary text-lg font-display">${estimate.totalCost.toFixed(0)}</span>
                  </div>
                  <p className="text-xs text-muted-foreground text-center">
                    ${estimate.perPersonCost.toFixed(0)}/person
                  </p>
                </div>
              )}

              <Link href={`/contact?packageId=${pkg.id}&visitors=${visitors}&days=${effectiveDays}`}>
                <Button
                  variant="outline"
                  className="w-full rounded-full border-primary text-primary hover:bg-primary/5"
                  data-testid="button-book-inquiry"
                >
                  Send Booking Inquiry
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
