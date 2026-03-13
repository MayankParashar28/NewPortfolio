import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Send, Mail, Github, Linkedin, Loader2, CheckCircle2 } from "lucide-react";
import { useState, useRef, useCallback } from "react";
import { user } from "@/data";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import TextScramble from "@/components/TextScramble";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import confetti from "canvas-confetti";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string({
    required_error: "Please select a subject",
  }),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

function fireConfetti() {
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

  confetti({ ...defaults, particleCount: 50, origin: { x: 0.3, y: 0.6 } });
  confetti({ ...defaults, particleCount: 50, origin: { x: 0.7, y: 0.6 } });

  setTimeout(() => {
    confetti({ ...defaults, particleCount: 30, origin: { x: 0.5, y: 0.4 }, startVelocity: 45 });
  }, 150);
}

/**
 * Magnetic contact info card that subtly shifts toward the mouse cursor.
 */
function MagneticContactCard({
  icon: Icon,
  label,
  value,
  link,
  index,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  link: string;
  index: number;
}) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const springX = useSpring(mouseX, { stiffness: 300, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 300, damping: 30 });
  const tx = useTransform(springX, [0, 1], [-8, 8]);
  const ty = useTransform(springY, [0, 1], [-6, 6]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const rect = cardRef.current?.getBoundingClientRect();
      if (!rect) return;
      mouseX.set((e.clientX - rect.left) / rect.width);
      mouseY.set((e.clientY - rect.top) / rect.height);
    },
    [mouseX, mouseY]
  );

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0.5);
    mouseY.set(0.5);
  }, [mouseX, mouseY]);

  return (
    <motion.a
      ref={cardRef}
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      data-testid={`link-contact-${index}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: tx, y: ty }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="flex items-start gap-3 p-3 border border-border rounded-md hover:border-primary/40 hover:shadow-[0_0_20px_hsl(var(--primary)/0.08)] transition-all duration-300 group cursor-pointer"
    >
      <motion.div
        className="mt-0.5 flex-shrink-0"
        whileHover={{ rotate: [0, -12, 12, 0] }}
        transition={{ type: "spring", stiffness: 400, damping: 15 }}
      >
        <Icon className="w-5 h-5 group-hover:text-primary transition-colors duration-300" />
      </motion.div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium group-hover:text-primary transition-colors duration-300">
          {label}
        </div>
        <div className="text-xs text-muted-foreground truncate">{value}</div>
      </div>
    </motion.a>
  );
}

export default function Contact() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [buttonPhase, setButtonPhase] = useState<"idle" | "sending" | "flying" | "done">("idle");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    setButtonPhase("sending");

    try {
      // Show "sending" spinner briefly
      await new Promise((r) => setTimeout(r, 600));
      setButtonPhase("flying");

      const response = await fetch("https://formspree.io/f/xqavoekj", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      // Let the fly animation play out
      await new Promise((r) => setTimeout(r, 800));

      if (response.ok) {
        setButtonPhase("done");
        setIsSuccess(true);
        fireConfetti();
        form.reset();

        setTimeout(() => {
          setIsSuccess(false);
          setButtonPhase("idle");
        }, 4000);
      } else {
        throw new Error("Failed to send message");
      }
    } catch (error) {
      setButtonPhase("idle");
      toast({
        title: "Error",
        description: "Something went wrong. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-border relative overflow-hidden">
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <TextScramble
              text="Get In Touch"
              as="h2"
              className="text-4xl sm:text-5xl font-heading font-bold mb-4"
            />
            <div className="w-20 h-1 bg-foreground mx-auto"></div>
            <p className="text-muted-foreground mt-6 max-w-2xl mx-auto text-lg leading-relaxed">
              Actively looking for <span className="text-primary font-semibold">ML/AI Engineer</span> and <span className="text-primary font-semibold">Computer Vision Engineer</span> roles; available for internships and full-time.
            </p>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Card className="border border-border h-full relative overflow-hidden">
              <AnimatePresence mode="wait">
                {isSuccess ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="flex flex-col items-center justify-center py-20 px-6 text-center"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 12, delay: 0.1 }}
                    >
                      <CheckCircle2 className="w-16 h-16 text-primary mb-4" />
                    </motion.div>
                    <motion.h3
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.25 }}
                      className="text-2xl font-heading font-bold mb-2"
                    >
                      Message Sent!
                    </motion.h3>
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.35 }}
                      className="text-muted-foreground"
                    >
                      Thanks for reaching out. I'll get back to you soon.
                    </motion.p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <CardHeader>
                      <CardTitle className="text-2xl font-heading">Send a Message</CardTitle>
                      <CardDescription>Fill out the form below and I'll get back to you soon</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" autoComplete="off">
                          <div className="grid sm:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="name"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Name</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Your name" {...field} disabled={isSubmitting} data-testid="input-name" className="focus:ring-2 focus:ring-primary/30 transition-shadow" />
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
                                  <FormLabel>Email</FormLabel>
                                  <FormControl>
                                    <Input placeholder="your.email@example.com" {...field} disabled={isSubmitting} data-testid="input-email" className="focus:ring-2 focus:ring-primary/30 transition-shadow" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <FormField
                            control={form.control}
                            name="subject"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Subject</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
                                  <FormControl>
                                    <SelectTrigger data-testid="select-subject">
                                      <SelectValue placeholder="Select a subject" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="Project Inquiry">Project Inquiry</SelectItem>
                                    <SelectItem value="Job Opportunity">Job Opportunity</SelectItem>
                                    <SelectItem value="Collaboration">Collaboration</SelectItem>
                                    <SelectItem value="General Question">General Question</SelectItem>
                                    <SelectItem value="Other">Other</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="message"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Message</FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="Your message here..."
                                    rows={5}
                                    {...field}
                                    disabled={isSubmitting}
                                    data-testid="input-message"
                                    className="focus:ring-2 focus:ring-primary/30 transition-shadow"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {/* ✨ Morphing Submit Button */}
                          <Button
                            type="submit"
                            size="lg"
                            className="w-full relative overflow-hidden group"
                            disabled={isSubmitting}
                            data-testid="button-submit"
                          >
                            <AnimatePresence mode="wait">
                              {buttonPhase === "idle" && (
                                <motion.span
                                  key="idle"
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -20 }}
                                  transition={{ duration: 0.2 }}
                                  className="flex items-center justify-center"
                                >
                                  <Send className="w-4 h-4 mr-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                                  Send Message
                                </motion.span>
                              )}

                              {buttonPhase === "sending" && (
                                <motion.span
                                  key="sending"
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -20 }}
                                  transition={{ duration: 0.2 }}
                                  className="flex items-center justify-center"
                                >
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                  Preparing...
                                </motion.span>
                              )}

                              {buttonPhase === "flying" && (
                                <motion.span
                                  key="flying"
                                  initial={{ opacity: 0, x: -30 }}
                                  animate={{ opacity: [0, 1, 1, 1, 0], x: [-30, 0, 0, 20, 80], y: [0, 0, 0, -5, -25] }}
                                  transition={{ duration: 1.2, times: [0, 0.15, 0.5, 0.75, 1], ease: "easeInOut" }}
                                  className="flex items-center justify-center"
                                >
                                  <Send className="w-5 h-5 mr-2 -rotate-45" />
                                  Sending...
                                </motion.span>
                              )}

                              {buttonPhase === "done" && (
                                <motion.span
                                  key="done"
                                  initial={{ opacity: 0, scale: 0.5 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, scale: 0.5 }}
                                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                                  className="flex items-center justify-center"
                                >
                                  <CheckCircle2 className="w-5 h-5 mr-2" />
                                  Delivered!
                                </motion.span>
                              )}
                            </AnimatePresence>
                          </Button>
                        </form>
                      </Form>
                    </CardContent>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </motion.div>

          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <Card className="border border-border">
              <CardHeader>
                <CardTitle className="text-xl font-heading">Contact Info</CardTitle>
                <CardDescription>Connect with me through these channels</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  {
                    icon: Mail,
                    label: "Email",
                    value: user.email,
                    link: user.socials.email
                  },
                  {
                    icon: Github,
                    label: "GitHub",
                    value: user.socials.github.replace("https://", ""),
                    link: user.socials.github
                  },
                  {
                    icon: Linkedin,
                    label: "LinkedIn",
                    value: user.socials.linkedin.replace("https://", ""),
                    link: user.socials.linkedin
                  }
                ].map((method, index) => (
                  <MagneticContactCard
                    key={index}
                    icon={method.icon}
                    label={method.label}
                    value={method.value}
                    link={method.link}
                    index={index}
                  />
                ))}
              </CardContent>
            </Card>

            <Card className="border border-border">
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Open to freelance opportunities, collaborations, and full-time positions in AI/ML engineering.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
