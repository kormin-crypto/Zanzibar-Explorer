import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { MapPin, Phone, Mail, Clock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useCreateInquiry } from "@workspace/api-client-react";
import { useState } from "react";

const formSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Valid email required"),
  phone: z.string().optional(),
  numberOfVisitors: z.coerce.number().min(1, "At least 1 visitor"),
  numberOfDays: z.coerce.number().min(1, "At least 1 day"),
  preferredStartDate: z.string().optional(),
  message: z.string().min(10, "Please tell us a bit more about your plans"),
});

type FormData = z.infer<typeof formSchema>;

const contactInfo = [
  { icon: MapPin, label: "Address", value: "Shangani Street, Stone Town\nZanzibar, Tanzania" },
  { icon: Phone, label: "Phone", value: "+255 777 123 456" },
  { icon: Mail, label: "Email", value: "info@zanzibar-pearls.com" },
  { icon: Clock, label: "Office Hours", value: "Mon–Fri: 8am – 6pm\nSat–Sun: 9am – 4pm (EAT)" },
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const createInquiry = useCreateInquiry();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      numberOfVisitors: 2,
      numberOfDays: 5,
      preferredStartDate: "",
      message: "",
    },
  });

  const onSubmit = (data: FormData) => {
    createInquiry.mutate(
      {
        data: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          numberOfVisitors: data.numberOfVisitors,
          numberOfDays: data.numberOfDays,
          preferredStartDate: data.preferredStartDate,
          message: data.message,
          activityIds: [],
        },
      },
      {
        onSuccess: () => setSubmitted(true),
      }
    );
  };

  return (
    <div className="min-h-screen bg-background pt-20">
      {/* Header */}
      <div className="ocean-gradient text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm uppercase tracking-widest text-white/70 font-medium mb-3">
            Get in Touch
          </p>
          <h1 className="font-display text-4xl lg:text-5xl font-light mb-4">
            Plan Your Zanzibar Adventure
          </h1>
          <p className="text-white/80 max-w-xl mx-auto leading-relaxed">
            Our local experts are ready to craft your perfect Zanzibar experience. We respond within 24 hours.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact info */}
          <div>
            <h2 className="font-display text-2xl font-medium mb-6">Our Details</h2>
            <div className="space-y-6">
              {contactInfo.map((item) => (
                <div key={item.label} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-foreground mb-0.5">{item.label}</div>
                    <div className="text-sm text-muted-foreground whitespace-pre-line">{item.value}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 bg-accent/10 border border-accent/20 rounded-2xl p-5">
              <h3 className="font-display text-base font-semibold text-accent mb-2">
                Quick Response Guarantee
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Every inquiry is personally reviewed by our Zanzibar travel experts. We'll contact you within 24 hours with a detailed proposal tailored to your dream trip.
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            {submitted ? (
              <div className="bg-card border border-card-border rounded-2xl p-10 text-center shadow-sm">
                <CheckCircle2 className="w-16 h-16 text-primary mx-auto mb-4" />
                <h2 className="font-display text-2xl font-medium mb-2">Inquiry Received!</h2>
                <p className="text-muted-foreground max-w-md mx-auto mb-6 leading-relaxed">
                  Thank you for reaching out. Our Zanzibar experts will review your request and contact you within 24 hours with a personalized proposal.
                </p>
                <Button
                  onClick={() => { setSubmitted(false); form.reset(); }}
                  variant="outline"
                  className="rounded-full"
                  data-testid="button-new-inquiry"
                >
                  Send Another Inquiry
                </Button>
              </div>
            ) : (
              <div className="bg-card border border-card-border rounded-2xl p-6 lg:p-8 shadow-sm">
                <h2 className="font-display text-2xl font-medium mb-6">Send an Inquiry</h2>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Jane" {...field} data-testid="input-first-name" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Smith" {...field} data-testid="input-last-name" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="jane@example.com" {...field} data-testid="input-email" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone (optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="+44 7700 900123" {...field} data-testid="input-phone" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                      <FormField
                        control={form.control}
                        name="numberOfVisitors"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Visitors</FormLabel>
                            <FormControl>
                              <Input type="number" min={1} {...field} data-testid="input-visitors" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="numberOfDays"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Days</FormLabel>
                            <FormControl>
                              <Input type="number" min={1} {...field} data-testid="input-days" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="preferredStartDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Preferred Date</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} data-testid="input-date" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tell us about your dream trip</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="E.g. We are a couple looking for a romantic beach experience with some cultural activities. We'd love private accommodation near the water..."
                              rows={5}
                              {...field}
                              data-testid="input-message"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      disabled={createInquiry.isPending}
                      className="w-full rounded-full bg-primary text-primary-foreground h-12 text-base font-medium"
                      data-testid="button-submit-inquiry"
                    >
                      {createInquiry.isPending ? "Sending..." : "Send Inquiry"}
                    </Button>
                  </form>
                </Form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
