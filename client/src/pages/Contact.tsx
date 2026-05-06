import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Mail, Linkedin, Twitter, MapPin, Clock, Zap, Send, Calendar } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function Contact() {
  const { toast } = useToast();
  const { data: settings } = useQuery<Record<string, any>>({ queryKey: ["/api/settings"] });

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", message: "" },
  });

  const mutation = useMutation({
    mutationFn: (data: ContactFormValues) => apiRequest("POST", "/api/contact", data),
    onSuccess: () => {
      toast({ title: "Message sent!", description: "I'll get back to you within 24 hours." });
      form.reset();
    },
    onError: () => {
      toast({ title: "Error", description: "Something went wrong. Please try again.", variant: "destructive" });
    },
  });

  const email = settings?.email ?? "alex@example.com";
  const linkedin = settings?.linkedin ?? "linkedin.com/in/alexmorgan";
  const twitter = settings?.twitter ?? "@alexmorgan";
  const location = settings?.location ?? "San Francisco, CA";
  const availabilityStatus = settings?.availability_status ?? "Currently Available";
  const availabilityNote = settings?.availability_note ?? "Open for new projects";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        {/* Header */}
        <section className="mx-auto max-w-7xl px-6 lg:px-8 py-20 text-center">
          <div className="inline-flex items-center gap-2 bg-muted border border-border rounded-full px-4 py-2 mb-8">
            <span className="text-sm text-muted-foreground">Get In Touch</span>
          </div>
          <h1 className="text-5xl lg:text-6xl font-black text-foreground mb-4">
            Let's build something<br />
            <span className="gradient-text">meaningful together</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            Have a project in mind? Want to collaborate? Or just want to say hi? I'd love to hear from you.
          </p>
        </section>

        {/* Contact Grid */}
        <section className="mx-auto max-w-7xl px-6 lg:px-8 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
            {/* Form */}
            <div className="bg-card border border-border rounded-3xl p-8 lg:p-10">
              <h2 className="text-2xl font-bold text-foreground mb-6">Send a Message</h2>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit((d) => mutation.mutate(d))}
                  className="flex flex-col gap-5"
                  data-testid="contact-form"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-foreground">Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Your name"
                            {...field}
                            className="rounded-xl border-border bg-background"
                            data-testid="input-name"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-foreground">Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="your@email.com"
                            type="email"
                            {...field}
                            className="rounded-xl border-border bg-background"
                            data-testid="input-email"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-foreground">Message</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Tell me about your project..."
                            {...field}
                            rows={5}
                            className="rounded-xl border-border bg-background resize-none"
                            data-testid="input-message"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <button
                    type="submit"
                    disabled={mutation.isPending}
                    className="flex items-center justify-center gap-2 bg-foreground text-background font-semibold px-6 py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                    data-testid="button-send"
                  >
                    {mutation.isPending ? "Sending..." : (
                      <>
                        Send Message
                        <Send size={16} />
                      </>
                    )}
                  </button>
                </form>
              </Form>
            </div>

            {/* Info sidebar */}
            <div className="flex flex-col gap-5">
              {/* Quick info */}
              <div className="bg-card border border-border rounded-3xl p-6">
                <h3 className="text-base font-bold text-foreground mb-4">Quick Info</h3>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <MapPin size={16} className="text-foreground flex-shrink-0" />
                    Based in {location}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Clock size={16} className="text-foreground flex-shrink-0" />
                    Available for freelance projects
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Zap size={16} className="text-foreground flex-shrink-0" />
                    Typically respond within 24 hours
                  </div>
                </div>
              </div>

              {/* Connect */}
              <div className="bg-card border border-border rounded-3xl p-6">
                <h3 className="text-base font-bold text-foreground mb-4">Connect With Me</h3>
                <div className="flex flex-col gap-3">
                  <a
                    href={`mailto:${email}`}
                    className="flex items-center gap-3 p-3 rounded-xl border border-border hover:bg-muted transition-colors group"
                    data-testid="link-email"
                  >
                    <div className="w-9 h-9 rounded-lg bg-blue-500 flex items-center justify-center flex-shrink-0">
                      <Mail size={16} className="text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Email</p>
                      <p className="text-xs text-muted-foreground">{email}</p>
                    </div>
                  </a>
                  <a
                    href={`https://${linkedin}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 p-3 rounded-xl border border-border hover:bg-muted transition-colors"
                    data-testid="link-linkedin"
                  >
                    <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
                      <Linkedin size={16} className="text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">LinkedIn</p>
                      <p className="text-xs text-muted-foreground">{linkedin}</p>
                    </div>
                  </a>
                  <a
                    href={`https://twitter.com/${twitter.replace("@", "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 p-3 rounded-xl border border-border hover:bg-muted transition-colors"
                    data-testid="link-twitter"
                  >
                    <div className="w-9 h-9 rounded-lg bg-sky-500 flex items-center justify-center flex-shrink-0">
                      <Twitter size={16} className="text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Twitter</p>
                      <p className="text-xs text-muted-foreground">{twitter}</p>
                    </div>
                  </a>
                </div>
              </div>

              {/* Availability */}
              <div className="flex items-center gap-3 p-4 bg-card border border-border rounded-2xl">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-foreground">{availabilityStatus}</p>
                  <p className="text-xs text-muted-foreground">{availabilityNote}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Schedule CTA */}
        <section className="mx-auto max-w-7xl px-6 lg:px-8 pb-20">
          <div className="border border-border rounded-3xl p-10 text-center bg-muted/30">
            <h2 className="text-2xl font-bold text-foreground mb-2">Prefer a Quick Chat?</h2>
            <p className="text-muted-foreground mb-6">Sometimes a 15-minute call is all it takes to get started</p>
            <button
              className="inline-flex items-center gap-2 border border-border bg-background text-foreground font-medium px-6 py-3 rounded-xl hover:bg-muted transition-colors"
              data-testid="button-schedule-call"
            >
              <Calendar size={16} />
              Schedule a Call
            </button>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
