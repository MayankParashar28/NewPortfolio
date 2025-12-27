import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Send, Mail, Github, Linkedin, Loader2 } from "lucide-react";
import { useState } from "react";
import { user } from "@/data";
import { motion } from "framer-motion";
import TextScramble from "@/components/TextScramble";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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

export default function Contact() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    try {
      const response = await fetch("https://formspree.io/f/xqavoekj", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        toast({
          title: "Message sent!",
          description: "Thanks for reaching out. I'll get back to you soon.",
        });
        form.reset();
      } else {
        throw new Error("Failed to send message");
      }
    } catch (error) {
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
            <Card className="border border-border h-full">
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
                              <Input placeholder="Your name" {...field} disabled={isSubmitting} data-testid="input-name" />
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
                              <Input placeholder="your.email@example.com" {...field} disabled={isSubmitting} data-testid="input-email" />
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
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full"
                      disabled={isSubmitting}
                      data-testid="button-submit"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
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
              <CardContent className="space-y-4">
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
                  <a
                    key={index}
                    href={method.link}
                    className="flex items-start gap-3 p-3 border border-border rounded-md hover-elevate active-elevate-2 transition-all group"
                    target="_blank"
                    rel="noopener noreferrer"
                    data-testid={`link-contact-${index}`}
                  >
                    <method.icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium">{method.label}</div>
                      <div className="text-xs text-muted-foreground truncate">{method.value}</div>
                    </div>
                  </a>
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
