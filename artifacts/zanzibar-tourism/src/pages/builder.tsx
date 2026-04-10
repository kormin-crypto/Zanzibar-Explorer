import { useState, useEffect } from "react";
import { Link } from "wouter";
import { ArrowRight, Calculator, Hotel, Activity, Users, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import ActivityCard from "@/components/ActivityCard";
import { useListActivities, useListAccommodations, useEstimateCost } from "@workspace/api-client-react";

type Step = "accommodation" | "activities" | "details" | "estimate";

const steps: { key: Step; label: string; icon: typeof Hotel }[] = [
  { key: "accommodation", label: "Accommodation", icon: Hotel },
  { key: "activities", label: "Activities", icon: Activity },
  { key: "details", label: "Trip Details", icon: Calendar },
  { key: "estimate", label: "Your Estimate", icon: Calculator },
];

export default function BuilderPage() {
  const [currentStep, setCurrentStep] = useState<Step>("accommodation");
  const [selectedAccommodation, setSelectedAccommodation] = useState<number | null>(null);
  const [selectedActivities, setSelectedActivities] = useState<number[]>([]);
  const [visitors, setVisitors] = useState(2);
  const [days, setDays] = useState(5);
  const [categoryFilter, setCategoryFilter] = useState("");

  const { data: activities, isLoading: loadingActivities } = useListActivities();
  const { data: accommodations, isLoading: loadingAccommodations } = useListAccommodations();
  const estimateMutation = useEstimateCost();

  const stepIndex = steps.findIndex((s) => s.key === currentStep);

  const toggleActivity = (id: number) => {
    setSelectedActivities((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const calculateEstimate = () => {
    if (!selectedAccommodation) return;
    estimateMutation.mutate({
      data: {
        accommodationId: selectedAccommodation,
        activityIds: selectedActivities,
        numberOfVisitors: visitors,
        numberOfDays: days,
      },
    });
    setCurrentStep("estimate");
  };

  const selectedAccommodationData = accommodations?.find((a) => a.id === selectedAccommodation);
  const selectedActivitiesData = (activities || []).filter((a) => selectedActivities.includes(a.id));

  const filteredActivities = categoryFilter
    ? (activities || []).filter((a) => a.category === categoryFilter)
    : activities || [];

  const categoryFilters = [
    { value: "", label: "All" },
    { value: "water", label: "Water" },
    { value: "cultural", label: "Cultural" },
    { value: "adventure", label: "Adventure" },
    { value: "nature", label: "Nature" },
    { value: "food", label: "Food" },
  ];

  return (
    <div className="min-h-screen bg-background pt-20">
      {/* Header */}
      <div className="ocean-gradient text-white py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-display text-3xl lg:text-4xl font-light mb-2">
            Build Your Perfect Trip
          </h1>
          <p className="text-white/80">
            Choose your accommodation and activities, set your trip details, and get an instant cost estimate.
          </p>
        </div>
      </div>

      {/* Step progress */}
      <div className="sticky top-16 z-30 bg-white/95 backdrop-blur-md border-b border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 overflow-x-auto">
            {steps.map((step, i) => (
              <div key={step.key} className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => {
                    if (i < stepIndex || (i === stepIndex + 1 && selectedAccommodation)) {
                      setCurrentStep(step.key);
                    }
                  }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-all ${
                    step.key === currentStep
                      ? "bg-primary text-primary-foreground"
                      : i < stepIndex
                      ? "bg-primary/10 text-primary cursor-pointer"
                      : "bg-muted text-muted-foreground cursor-default"
                  }`}
                  data-testid={`step-${step.key}`}
                >
                  <step.icon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{step.label}</span>
                  <span className="sm:hidden">{i + 1}</span>
                </button>
                {i < steps.length - 1 && (
                  <div className={`w-6 h-px ${i < stepIndex ? "bg-primary" : "bg-border"}`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Step 1: Accommodation */}
        {currentStep === "accommodation" && (
          <div>
            <h2 className="font-display text-2xl font-medium mb-2">Choose Your Accommodation</h2>
            <p className="text-muted-foreground mb-6">Select where you'd like to stay during your Zanzibar journey.</p>
            {loadingAccommodations ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-56 rounded-2xl" />)}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
                {(accommodations || []).map((acc) => (
                  <div
                    key={acc.id}
                    onClick={() => setSelectedAccommodation(acc.id)}
                    className={`group bg-card rounded-2xl overflow-hidden border cursor-pointer transition-all ${
                      selectedAccommodation === acc.id
                        ? "border-primary ring-2 ring-primary/20 shadow-md"
                        : "border-card-border shadow-sm hover:shadow-md card-hover"
                    }`}
                    data-testid={`accommodation-${acc.id}`}
                  >
                    <div className="relative aspect-video overflow-hidden">
                      <img src={acc.imageUrl} alt={acc.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      <div className="absolute bottom-3 left-3">
                        <Badge className="bg-accent text-accent-foreground border-0 text-xs capitalize">{acc.type.replace("-", " ")}</Badge>
                      </div>
                      {selectedAccommodation === acc.id && (
                        <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-primary flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" viewBox="0 0 12 12" fill="none">
                            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-display text-base font-semibold">{acc.name}</h3>
                        <span className="font-display text-primary font-semibold">${acc.pricePerNight}<span className="text-xs font-normal text-muted-foreground">/night</span></span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">{acc.location}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {acc.amenities.slice(0, 4).map((a) => (
                          <span key={a} className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">{a}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="flex justify-end">
              <Button
                onClick={() => setCurrentStep("activities")}
                disabled={!selectedAccommodation}
                className="rounded-full px-8 bg-primary text-primary-foreground"
                data-testid="button-next-activities"
              >
                Next: Choose Activities <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Activities */}
        {currentStep === "activities" && (
          <div>
            <h2 className="font-display text-2xl font-medium mb-1">Choose Your Activities</h2>
            <p className="text-muted-foreground mb-4">Select as many activities as you'd like. You can add more later.</p>

            {selectedActivities.length > 0 && (
              <div className="bg-primary/5 border border-primary/20 rounded-xl px-4 py-3 mb-5 flex items-center justify-between">
                <span className="text-sm text-primary font-medium">
                  {selectedActivities.length} activit{selectedActivities.length !== 1 ? "ies" : "y"} selected
                </span>
                <button onClick={() => setSelectedActivities([])} className="text-xs text-muted-foreground hover:text-destructive transition-colors">Clear all</button>
              </div>
            )}

            <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
              {categoryFilters.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setCategoryFilter(cat.value)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                    categoryFilter === cat.value ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {loadingActivities ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => <Skeleton key={i} className="h-64 rounded-2xl" />)}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {filteredActivities.map((activity) => (
                  <ActivityCard
                    key={activity.id}
                    activity={activity}
                    selected={selectedActivities.includes(activity.id)}
                    onToggle={toggleActivity}
                    showCheckbox
                  />
                ))}
              </div>
            )}

            <div className="flex items-center justify-between">
              <Button variant="outline" onClick={() => setCurrentStep("accommodation")} className="rounded-full">
                Back
              </Button>
              <Button
                onClick={() => setCurrentStep("details")}
                className="rounded-full px-8 bg-primary text-primary-foreground"
                data-testid="button-next-details"
              >
                Next: Trip Details <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Details */}
        {currentStep === "details" && (
          <div>
            <h2 className="font-display text-2xl font-medium mb-2">Trip Details</h2>
            <p className="text-muted-foreground mb-8">Set your group size and travel duration.</p>

            <div className="max-w-md space-y-8 mb-10">
              <div>
                <label className="block text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" /> Number of Visitors
                </label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setVisitors(Math.max(1, visitors - 1))}
                    className="w-10 h-10 rounded-full border-2 border-border hover:border-primary flex items-center justify-center text-lg font-medium transition-colors"
                  >−</button>
                  <span className="font-display text-3xl font-semibold w-12 text-center" data-testid="text-visitors">{visitors}</span>
                  <button
                    onClick={() => setVisitors(visitors + 1)}
                    className="w-10 h-10 rounded-full border-2 border-border hover:border-primary flex items-center justify-center text-lg font-medium transition-colors"
                  >+</button>
                  <span className="text-muted-foreground text-sm">person{visitors !== 1 ? "s" : ""}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" /> Number of Days
                </label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setDays(Math.max(1, days - 1))}
                    className="w-10 h-10 rounded-full border-2 border-border hover:border-primary flex items-center justify-center text-lg font-medium transition-colors"
                  >−</button>
                  <span className="font-display text-3xl font-semibold w-12 text-center" data-testid="text-days">{days}</span>
                  <button
                    onClick={() => setDays(days + 1)}
                    className="w-10 h-10 rounded-full border-2 border-border hover:border-primary flex items-center justify-center text-lg font-medium transition-colors"
                  >+</button>
                  <span className="text-muted-foreground text-sm">day{days !== 1 ? "s" : ""}</span>
                </div>
              </div>
            </div>

            {/* Summary before estimate */}
            <div className="bg-card border border-card-border rounded-2xl p-5 mb-8 max-w-md">
              <h3 className="font-display text-base font-semibold mb-3">Your Selection</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Accommodation</span>
                  <span className="font-medium">{selectedAccommodationData?.name || "None"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Activities</span>
                  <span className="font-medium">{selectedActivities.length} selected</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Group size</span>
                  <span className="font-medium">{visitors} {visitors === 1 ? "person" : "people"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Duration</span>
                  <span className="font-medium">{days} days</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between max-w-md">
              <Button variant="outline" onClick={() => setCurrentStep("activities")} className="rounded-full">Back</Button>
              <Button
                onClick={calculateEstimate}
                disabled={estimateMutation.isPending || !selectedAccommodation}
                className="rounded-full px-8 bg-primary text-primary-foreground"
                data-testid="button-get-estimate"
              >
                {estimateMutation.isPending ? "Calculating..." : "Get Estimate"} <Calculator className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Estimate */}
        {currentStep === "estimate" && (
          <div>
            <h2 className="font-display text-2xl font-medium mb-2">Your Trip Estimate</h2>
            <p className="text-muted-foreground mb-8">Here's the estimated cost breakdown for your custom Zanzibar experience.</p>

            {estimateMutation.isPending ? (
              <Skeleton className="h-64 rounded-2xl" />
            ) : estimateMutation.data ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <div className="bg-primary ocean-gradient text-white rounded-2xl p-6 mb-5">
                    <div className="text-sm text-white/70 mb-1">Total estimated cost</div>
                    <div className="font-display text-5xl font-semibold mb-1">
                      ${estimateMutation.data.totalCost.toFixed(0)}
                    </div>
                    <div className="text-sm text-white/80">
                      ${estimateMutation.data.perPersonCost.toFixed(0)} per person · {visitors} {visitors === 1 ? "person" : "people"} · {days} days
                    </div>
                  </div>

                  <div className="bg-card border border-card-border rounded-2xl p-5">
                    <h3 className="font-display text-base font-semibold mb-4">Cost Breakdown</h3>
                    <div className="space-y-3">
                      {estimateMutation.data.breakdown.map((item, i) => (
                        <div key={i}>
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="text-sm font-medium text-foreground">{item.label}</span>
                            <span className="font-semibold text-primary">${item.amount.toFixed(0)}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">{item.detail}</p>
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-border mt-4 pt-4 flex items-center justify-between">
                      <span className="font-semibold">Grand Total</span>
                      <span className="font-display text-xl font-semibold text-primary">
                        ${estimateMutation.data.totalCost.toFixed(0)}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="bg-card border border-card-border rounded-2xl p-5 mb-5">
                    <h3 className="font-display text-base font-semibold mb-3">Your Selections</h3>
                    <div className="space-y-3 text-sm">
                      <div>
                        <span className="text-muted-foreground block mb-1">Accommodation</span>
                        <span className="font-medium">{selectedAccommodationData?.name}</span>
                      </div>
                      {selectedActivitiesData.length > 0 && (
                        <div>
                          <span className="text-muted-foreground block mb-2">Activities</span>
                          <div className="flex flex-wrap gap-2">
                            {selectedActivitiesData.map((a) => (
                              <Badge key={a.id} className="bg-primary/10 text-primary border-0 text-xs">{a.name}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Ready to make this trip a reality? Send us an inquiry and our team will get back to you within 24 hours.
                    </p>
                    <Link href="/contact">
                      <Button className="w-full rounded-full bg-accent text-accent-foreground hover:bg-accent/90" data-testid="button-send-inquiry">
                        Send Booking Inquiry
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </Link>
                    <Button variant="outline" onClick={() => setCurrentStep("accommodation")} className="w-full rounded-full">
                      Start Over
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Something went wrong. Please try again.</p>
                <Button onClick={() => setCurrentStep("details")} variant="outline" className="mt-4 rounded-full">Go Back</Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
