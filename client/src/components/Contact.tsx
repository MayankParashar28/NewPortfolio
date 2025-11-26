import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Send, Mail, Github, Linkedin } from "lucide-react";
import { useState } from "react";
import { user } from "@/data";
import { motion } from "framer-motion";
import TextScramble from "@/components/TextScramble";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { name, email, subject, message } = formData;
    const mailtoLink = `mailto:${user.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    )}`;
    window.location.href = mailtoLink;
    setFormData({ name: "", email: "", subject: "", message: "" });
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
            <p className="text-muted-foreground mt-6 max-w-2xl mx-auto">
              Let's collaborate on exciting AI projects or discuss opportunities in machine learning
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
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        placeholder="Your name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        data-testid="input-name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        data-testid="input-email"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      placeholder="What's this about?"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      required
                      data-testid="input-subject"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Your message here..."
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                      data-testid="input-message"
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full"
                    data-testid="button-submit"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                </form>
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
