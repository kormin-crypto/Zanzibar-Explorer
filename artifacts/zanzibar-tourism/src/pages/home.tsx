import { Link } from "wouter";
import { ArrowRight, Star, Users, MapPin, Award, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import PackageCard from "@/components/PackageCard";
import {
  useGetFeaturedPackages,
  useGetSummary,
} from "@workspace/api-client-react";
import heroImage from "@/assets/hero-nungwi.jpg";

const stats = [
  { label: "Happy Travelers", value: "12,000+", icon: Users },
  { label: "Curated Packages", value: "25+", icon: Award },
  { label: "Unique Activities", value: "40+", icon: MapPin },
  { label: "Average Rating", value: "4.9/5", icon: Star },
];

const testimonials = [
  {
    name: "Emma & James",
    country: "United Kingdom",
    text: "Zanzibar Pearls made our honeymoon absolutely magical. Every detail was perfect — from the private dhow cruise to the candlelit beach dinner. We will never forget it.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?w=80",
  },
  {
    name: "Lars Eriksen",
    country: "Norway",
    text: "The Ocean Adventure package exceeded every expectation. Diving at Mnemba Atoll was one of the greatest experiences of my life. Expert guides, seamless logistics.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80",
  },
  {
    name: "Chen Family",
    country: "Singapore",
    text: "Our children are still talking about the giant tortoises and the colobus monkeys. The family package was perfectly paced and the accommodation was wonderful.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80",
  },
];

export default function Home() {
  const { data: featuredPackages, isLoading: loadingPackages } = useGetFeaturedPackages();
  const { data: summary } = useGetSummary();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Zanzibar paradise beach"
            className="w-full h-full object-cover"
          />
          <div className="hero-gradient absolute inset-0" />
        </div>

        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <p className="text-sm uppercase tracking-[0.3em] text-white/80 mb-4 font-medium">
            East Africa's Spice Island
          </p>
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-light leading-tight mb-6">
            Where Paradise<br />
            <span className="italic font-medium">Meets You</span>
          </h1>
          <p className="text-lg sm:text-xl text-white/85 mb-10 max-w-2xl mx-auto leading-relaxed font-light">
            Discover Zanzibar's turquoise waters, ancient spice trails, and world-class marine life. 
            Tailor your perfect island escape with our expert guides.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/packages">
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-white/90 rounded-full px-8 h-12 text-base font-medium"
                data-testid="button-explore-packages"
              >
                Explore Packages
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link href="/builder">
              <Button
                size="lg"
                variant="outline"
                className="border-white/50 text-white hover:bg-white/10 rounded-full px-8 h-12 text-base"
                data-testid="button-build-trip"
              >
                Build Your Trip
              </Button>
            </Link>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 animate-bounce">
          <ChevronDown className="w-6 h-6" />
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-primary-foreground/20">
            {stats.map((stat) => (
              <div key={stat.label} className="py-6 px-6 text-center">
                <stat.icon className="w-5 h-5 mx-auto mb-2 text-primary-foreground/70" />
                <div className="font-display text-2xl font-semibold">{stat.value}</div>
                <div className="text-sm text-primary-foreground/70 mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Packages */}
      <section className="py-20 lg:py-28 sand-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-sm uppercase tracking-widest text-primary font-medium mb-3">
              Our Finest Offerings
            </p>
            <h2 className="font-display text-4xl lg:text-5xl font-medium text-foreground mb-4">
              Featured Packages
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Handcrafted experiences that capture everything Zanzibar has to offer — from pristine beaches to cultural immersions.
            </p>
          </div>

          {loadingPackages ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-96 rounded-2xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(featuredPackages || []).map((pkg) => (
                <PackageCard key={pkg.id} pkg={pkg} />
              ))}
            </div>
          )}

          <div className="text-center mt-10">
            <Link href="/packages">
              <Button
                variant="outline"
                size="lg"
                className="rounded-full border-primary text-primary hover:bg-primary/5 px-8"
                data-testid="button-all-packages"
              >
                View All Packages
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* About / Why Zanzibar */}
      <section className="py-20 lg:py-28 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-sm uppercase tracking-widest text-primary font-medium mb-3">
                About Zanzibar
              </p>
              <h2 className="font-display text-4xl lg:text-5xl font-medium text-foreground mb-6 leading-tight">
                The Island That<br />
                <span className="italic">Has Everything</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-5">
                Zanzibar — the fabled Spice Island off the coast of Tanzania — has enchanted travelers for centuries. 
                With pristine white-sand beaches lapped by turquoise Indian Ocean waters, a rich Swahili-Arab-African 
                cultural heritage, and some of the world's best coral reef diving, it is a destination unlike any other.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-8">
                From the UNESCO World Heritage-listed Stone Town to the remote beaches of the east coast, 
                every corner of this magical island tells a story. Let Zanzibar Pearls be your guide.
              </p>
              <div className="grid grid-cols-2 gap-6">
                {[
                  { label: "Year-round sunshine", icon: "☀️" },
                  { label: "World-class diving", icon: "🤿" },
                  { label: "Rich spice heritage", icon: "🌿" },
                  { label: "Pristine beaches", icon: "🏖️" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-3 text-sm text-foreground font-medium">
                    <span className="text-xl">{item.icon}</span>
                    {item.label}
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <img
                  src="https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600"
                  alt="Spice market"
                  className="rounded-2xl w-full aspect-square object-cover"
                />
                <img
                  src="https://images.unsplash.com/photo-1559827291-72ee739d0d9a?w=600"
                  alt="Dhow cruise"
                  className="rounded-2xl w-full aspect-[4/3] object-cover"
                />
              </div>
              <div className="space-y-4 mt-8">
                <img
                  src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600"
                  alt="Snorkeling"
                  className="rounded-2xl w-full aspect-[4/3] object-cover"
                />
                <img
                  src="https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600"
                  alt="Stone Town"
                  className="rounded-2xl w-full aspect-square object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Activities Teaser */}
      <section className="py-20 lg:py-28 ocean-gradient text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm uppercase tracking-widest text-white/70 font-medium mb-3">
            {summary?.totalActivities || 40}+ Experiences Await
          </p>
          <h2 className="font-display text-4xl lg:text-5xl font-light mb-6">
            Choose Your Adventure
          </h2>
          <p className="text-white/80 max-w-xl mx-auto leading-relaxed mb-10">
            From diving with sea turtles to exploring ancient spice plantations — every day in Zanzibar is a new story to tell.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10 max-w-3xl mx-auto">
            {[
              { label: "Water Sports", count: "8 experiences" },
              { label: "Cultural", count: "6 experiences" },
              { label: "Nature", count: "5 experiences" },
              { label: "Culinary", count: "4 experiences" },
            ].map((cat) => (
              <div key={cat.label} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="font-display text-base font-medium mb-1">{cat.label}</div>
                <div className="text-sm text-white/70">{cat.count}</div>
              </div>
            ))}
          </div>
          <Link href="/activities">
            <Button
              size="lg"
              className="bg-white text-primary hover:bg-white/90 rounded-full px-8"
              data-testid="button-explore-activities"
            >
              Browse All Activities
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 lg:py-28 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-sm uppercase tracking-widest text-primary font-medium mb-3">
              What Travelers Say
            </p>
            <h2 className="font-display text-4xl lg:text-5xl font-medium text-foreground">
              Stories from Paradise
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-card border border-card-border rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-muted-foreground leading-relaxed text-sm mb-5 italic">
                  "{t.text}"
                </p>
                <div className="flex items-center gap-3">
                  <img
                    src={t.image}
                    alt={t.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-medium text-sm text-foreground">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.country}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-accent">
        <div className="max-w-4xl mx-auto px-4 text-center text-accent-foreground">
          <h2 className="font-display text-4xl lg:text-5xl font-medium mb-4">
            Ready to Discover Zanzibar?
          </h2>
          <p className="text-accent-foreground/80 mb-8 text-lg">
            Build your perfect trip today — choose your accommodation, activities, duration, and get an instant price estimate.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/builder">
              <Button
                size="lg"
                className="bg-white text-accent hover:bg-white/90 rounded-full px-8 h-12 font-medium"
                data-testid="button-cta-builder"
              >
                Build Your Package
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                size="lg"
                variant="outline"
                className="border-white/50 text-white hover:bg-white/10 rounded-full px-8 h-12"
                data-testid="button-cta-contact"
              >
                Talk to an Expert
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
