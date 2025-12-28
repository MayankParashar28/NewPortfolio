import { useAuth } from "@/context/AuthProvider";
import { useState, useEffect } from "react";
import { Redirect } from "wouter";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Project, Skill, Certificate, Profile, insertProjectSchema, insertSkillSchema, insertCertificateSchema, insertProfileSchema } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Plus, Trash2, LogOut, Loader2, Pencil, LayoutDashboard, Code2, GraduationCap, User as UserIcon, FileText, Github, Linkedin, Mail, Check, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useToast } from "@/hooks/use-toast";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { motion } from "framer-motion";
import ThemeToggle from "@/components/ThemeToggle";

export default function Admin() {
    const { user, logoutMutation } = useAuth();
    const { toast } = useToast();

    // Prefetch counts for stats (or just use length from queries if loaded)
    const { data: projects } = useQuery<Project[]>({ queryKey: ["/api/projects"], enabled: !!user });
    const { data: skills } = useQuery<Skill[]>({ queryKey: ["/api/skills"], enabled: !!user });
    const { data: certificates } = useQuery<Certificate[]>({ queryKey: ["/api/certificates"], enabled: !!user });

    if (!user) {
        return <Redirect to="/" />;
    }

    return (
        <div className="min-h-screen bg-background relative overflow-hidden transition-colors duration-300">
            {/* Background Effects - Subtle for both themes */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background pointer-events-none" />

            <div className="max-w-7xl mx-auto p-6 sm:p-10 relative z-10">
                <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-6">
                    <div>
                        <motion.h1
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-4xl font-heading font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/60"
                        >
                            Admin Dashboard
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-muted-foreground mt-1"
                        >
                            Welcome back, {user.username}
                        </motion.p>
                    </div>
                    <div className="flex items-center gap-4">
                        <ThemeToggle />
                        <Button
                            variant="outline"
                            onClick={() => logoutMutation.mutate()}
                            className="border-border hover:bg-muted transition-all duration-300 shadow-sm"
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            Logout
                        </Button>
                    </div>
                </header>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                    <StatCard title="Total Projects" value={projects?.length || 0} icon={LayoutDashboard} delay={0.2} />
                    <StatCard title="Total Skills" value={skills?.length || 0} icon={Code2} delay={0.3} />
                    <StatCard title="Certificates" value={certificates?.length || 0} icon={GraduationCap} delay={0.4} />
                </div>

                <Tabs defaultValue="projects" className="w-full space-y-8">
                    <TabsList className="bg-muted/50 backdrop-blur-sm border border-border p-1 rounded-xl w-full sm:w-auto inline-flex overflow-x-auto justify-start [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                        <TabsTrigger value="projects" className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm rounded-lg px-6 py-2 transition-all">Projects</TabsTrigger>
                        <TabsTrigger value="skills" className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm rounded-lg px-6 py-2 transition-all">Skills</TabsTrigger>
                        <TabsTrigger value="certificates" className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm rounded-lg px-6 py-2 transition-all">Certificates</TabsTrigger>
                        <TabsTrigger value="profile" className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm rounded-lg px-6 py-2 transition-all">Profile</TabsTrigger>
                    </TabsList>

                    <TabsContent value="projects" className="focus-visible:outline-none">
                        <ProjectsManager />
                    </TabsContent>

                    <TabsContent value="skills" className="focus-visible:outline-none">
                        <SkillsManager />
                    </TabsContent>

                    <TabsContent value="certificates" className="focus-visible:outline-none">
                        <CertificatesManager />
                    </TabsContent>

                    <TabsContent value="profile" className="focus-visible:outline-none">
                        <ProfileManager />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon: Icon, delay }: { title: string, value: number, icon: any, delay: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
        >
            <Card className="bg-card/50 backdrop-blur-md border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300 group">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">
                        {title}
                    </CardTitle>
                    <Icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold text-foreground">{value}</div>
                </CardContent>
            </Card>
        </motion.div>
    )
}

function ProjectsManager() {
    const { toast } = useToast();
    const { data: projects, isLoading } = useQuery<Project[]>({
        queryKey: ["/api/projects"],
    });

    const createProjectMutation = useMutation({
        mutationFn: async (newProject: any) => {
            const res = await apiRequest("POST", "/api/projects", newProject);
            return await res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
            toast({ title: "Project created" });
        },
        onError: (error: Error) => {
            toast({ title: "Failed to create project", description: error.message, variant: "destructive" });
        }
    });

    const updateProjectMutation = useMutation({
        mutationFn: async ({ id, data }: { id: number, data: any }) => {
            const res = await apiRequest("PATCH", `/api/projects/${id}`, data);
            return await res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
            toast({ title: "Project updated" });
        },
        onError: (error: Error) => {
            toast({ title: "Failed to update project", description: error.message, variant: "destructive" });
        }
    });

    const deleteProjectMutation = useMutation({
        mutationFn: async (id: number) => {
            await apiRequest("DELETE", `/api/projects/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
            toast({ title: "Project deleted" });
        },
    });

    if (isLoading) return <Loader2 className="animate-spin h-8 w-8 mx-auto text-primary" />;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <Card className="bg-card/30 backdrop-blur-sm border-border/40 border-none shadow-none">
                <div className="flex flex-row items-center justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-semibold text-foreground">Project List</h2>
                        <p className="text-sm text-muted-foreground">Manage your portfolio projects</p>
                    </div>
                    <ProjectDialog
                        trigger={
                            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20">
                                <Plus className="mr-2 h-4 w-4" /> Add Project
                            </Button>
                        }
                        onSubmit={(data) => createProjectMutation.mutateAsync(data)}
                        isPending={createProjectMutation.isPending}
                        title="Add New Project"
                    />
                </div>

                <div className="grid gap-4">
                    {projects?.map((project, index) => (
                        <motion.div
                            key={project.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="flex items-center justify-between p-4 border border-border/40 rounded-xl bg-card/40 hover:bg-muted/50 transition-all duration-300 group"
                        >
                            <div className="flex items-center gap-4">
                                <div className="relative overflow-hidden rounded-lg w-16 h-16 group-hover:shadow-md transition-all">
                                    <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{project.title}</h3>
                                    <p className="text-sm text-muted-foreground line-clamp-1 max-w-md">{project.description}</p>
                                    <div className="flex gap-2 mt-1">
                                        {project.featured && <span className="text-[10px] px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-500 font-medium border border-yellow-500/20">Featured</span>}
                                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">{project.category}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <ProjectDialog
                                    trigger={
                                        <Button variant="ghost" size="icon" className="hover:bg-primary/10 hover:text-primary">
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                    }
                                    onSubmit={(data) => updateProjectMutation.mutateAsync({ id: project.id, data })}
                                    isPending={updateProjectMutation.isPending}
                                    defaultValues={project}
                                    title="Edit Project"
                                />
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="hover:bg-destructive/10 hover:text-destructive"
                                    onClick={() => {
                                        if (confirm("Are you sure?")) deleteProjectMutation.mutate(project.id);
                                    }}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </motion.div>
                    ))}
                    {projects?.length === 0 && <p className="text-center text-muted-foreground py-12 bg-muted/20 rounded-xl border border-border/20 border-dashed">No projects found. Add one to get started!</p>}
                </div>
            </Card>
        </motion.div>
    );
}

function ProjectDialog({ trigger, onSubmit, isPending, defaultValues, title }: {
    trigger: React.ReactNode,
    onSubmit: (data: any) => Promise<any>,
    isPending: boolean,
    defaultValues?: Partial<Project>,
    title: string
}) {
    const [open, setOpen] = useState(false);
    const form = useForm({
        resolver: zodResolver(insertProjectSchema),
        defaultValues: {
            title: defaultValues?.title || "",
            description: defaultValues?.description || "",
            image: defaultValues?.image || "",
            tags: defaultValues?.tags || [],
            category: defaultValues?.category ?
                (defaultValues.category.toLowerCase().includes("machine learning") && defaultValues.category.toLowerCase().includes("ai") ? "AI / Machine Learning" : defaultValues.category)
                : "Full Stack",
            githubLink: defaultValues?.githubLink || "",
            demoLink: defaultValues?.demoLink || "",
            featured: defaultValues?.featured || false,
        }
    });

    const categoryTemplates = [
        "Full Stack Web App",
        "Frontend Application",
        "Backend API / Service",
        "AI / Machine Learning",
        "Mobile Application",
        "Data Visualization",
        "DevOps / Infrastructure",
        "Open Source Library",
        "Other"
    ];

    const handleSubmit = async (values: any) => {
        try {
            await onSubmit(values);
            setOpen(false);
            if (!defaultValues) form.reset();
        } catch (error) {
            // Error handling is done by mutation onError
            console.error(error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] border-border/50 bg-background/95 backdrop-blur-xl">
                <DialogHeader>
                    <DialogTitle className="text-xl font-heading text-foreground">{title}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5 pt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <FormField control={form.control} name="title" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Project Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g. E-Commerce Platform" {...field} className="bg-muted/30 border-primary/20 focus:border-primary focus:ring-primary/20 transition-all" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="category" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Category</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="bg-muted/30 border-primary/20 focus:border-primary focus:ring-primary/20 transition-all">
                                                <SelectValue placeholder="Select a category" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {Array.from(new Set([...categoryTemplates, form.getValues("category")].filter(Boolean))).map((cat) => (
                                                <SelectItem key={cat as string} value={cat as string}>{cat as string}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </div>

                        <FormField control={form.control} name="description" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Describe the project's key features and tech stack..." {...field} className="min-h-[100px] bg-muted/30 border-primary/20 focus:border-primary focus:ring-primary/20 transition-all resize-none" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <FormField control={form.control} name="image" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Cover Image URL</FormLabel>
                                <FormControl>
                                    <Input placeholder="https://..." {...field} className="bg-muted/30 border-primary/20 focus:border-primary focus:ring-primary/20 transition-all" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <FormField control={form.control} name="githubLink" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>GitHub Repository</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Code2 className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input placeholder="https://github.com/..." {...field} className="pl-9 bg-muted/30 border-primary/20 focus:border-primary focus:ring-primary/20 transition-all" />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="demoLink" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Live Demo</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <LayoutDashboard className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input placeholder="https://..." {...field} value={field.value || ""} className="pl-9 bg-muted/30 border-primary/20 focus:border-primary focus:ring-primary/20 transition-all" />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </div>

                        <FormField control={form.control} name="tags" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tags</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="React, TypeScript, Tailwind, Node.js (comma separated)"
                                        onChange={(e) => field.onChange(e.target.value.split(",").map(s => s.trim()).filter(Boolean))}
                                        defaultValue={field.value?.join(", ")}
                                        className="bg-muted/30 border-primary/20 focus:border-primary focus:ring-primary/20 transition-all"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <FormField control={form.control} name="featured" render={({ field }) => (
                            <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-4 border border-primary/10 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors">
                                <FormControl>
                                    <Checkbox checked={field.value ?? false} onCheckedChange={field.onChange} className="data-[state=checked]:bg-primary data-[state=checked]:border-primary" />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                    <FormLabel className="cursor-pointer font-medium text-primary">Featured Project</FormLabel>
                                    <p className="text-xs text-muted-foreground">Pin this project to the top of your portfolio</p>
                                </div>
                            </FormItem>
                        )} />

                        <div className="flex gap-4 pt-2">
                            <DialogTrigger asChild>
                                <Button type="button" variant="outline" className="w-full">Cancel</Button>
                            </DialogTrigger>
                            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25" disabled={isPending}>
                                {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                                {defaultValues ? 'Save Changes' : 'Create Project'}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

function SkillsManager() {
    const { toast } = useToast();
    const { data: skills, isLoading } = useQuery<Skill[]>({
        queryKey: ["/api/skills"],
    });

    const createSkillMutation = useMutation({
        mutationFn: async (newSkill: any) => {
            const res = await apiRequest("POST", "/api/skills", newSkill);
            return await res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/skills"] });
            toast({ title: "Skill added" });
        },
        onError: (error: Error) => {
            toast({ title: "Failed to add skill", description: error.message, variant: "destructive" });
        }
    });

    const updateSkillMutation = useMutation({
        mutationFn: async ({ id, data }: { id: number, data: any }) => {
            const res = await apiRequest("PATCH", `/api/skills/${id}`, data);
            return await res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/skills"] });
            toast({ title: "Skill updated" });
        },
        onError: (error: Error) => {
            toast({ title: "Failed to update skill", description: error.message, variant: "destructive" });
        }
    });

    const deleteSkillMutation = useMutation({
        mutationFn: async (id: number) => {
            await apiRequest("DELETE", `/api/skills/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/skills"] });
            toast({ title: "Skill deleted" });
        },
    });

    if (isLoading) return <Loader2 className="animate-spin h-8 w-8 mx-auto text-primary" />;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <Card className="bg-card/30 backdrop-blur-sm border-border/40 border-none shadow-none">
                <div className="flex flex-row items-center justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-semibold text-foreground">Skill Set</h2>
                        <p className="text-sm text-muted-foreground">Manage your technical skills</p>
                    </div>
                    <SkillDialog
                        trigger={
                            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20">
                                <Plus className="mr-2 h-4 w-4" /> Add Skill
                            </Button>
                        }
                        onSubmit={(data) => createSkillMutation.mutateAsync(data)}
                        isPending={createSkillMutation.isPending}
                        title="Add New Skill"
                    />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {skills?.map((skill, index) => (
                        <motion.div
                            key={skill.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.03 }}
                            className="flex flex-col items-center justify-between p-4 border border-border/40 rounded-xl bg-card/40 hover:bg-muted/50 transition-all duration-300 group relative"
                        >
                            <div className="flex flex-col items-center gap-2 mb-3 w-full">
                                <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shadow-inner" style={{ backgroundColor: `${skill.color || "#000000"}20`, color: skill.color || "#000000" }}>
                                    {skill.name[0]}
                                </div>
                                <div className="text-center">
                                    <p className="font-medium text-sm text-foreground group-hover:text-primary transition-colors">{skill.name}</p>
                                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{skill.category}</p>
                                </div>
                            </div>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity absolute top-2 right-2">
                                <SkillDialog
                                    trigger={<Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-primary/10 hover:text-primary"><Pencil className="h-3 w-3" /></Button>}
                                    onSubmit={(data) => updateSkillMutation.mutateAsync({ id: skill.id, data })}
                                    isPending={updateSkillMutation.isPending}
                                    defaultValues={skill}
                                    title="Edit Skill"
                                />
                                <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-destructive/10 text-destructive" onClick={() => deleteSkillMutation.mutate(skill.id)}>
                                    <Trash2 className="h-3 w-3" />
                                </Button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </Card>
        </motion.div>
    );
}

function SkillDialog({ trigger, onSubmit, isPending, defaultValues, title }: {
    trigger: React.ReactNode,
    onSubmit: (data: any) => Promise<any>,
    isPending: boolean,
    defaultValues?: Partial<Skill>,
    title: string
}) {
    const [open, setOpen] = useState(false);
    const form = useForm({
        resolver: zodResolver(insertSkillSchema),
        defaultValues: {
            name: defaultValues?.name || "",
            category: defaultValues?.category || "Languages",
            icon: defaultValues?.icon || "default",
            color: defaultValues?.color || "#000000",
        }
    });

    // Auto-detection map
    const knownSkills: Record<string, { icon: string, color: string, category: string }> = {
        "react": { icon: "SiReact", color: "#61DAFB", category: "Frontend" },
        "react.js": { icon: "SiReact", color: "#61DAFB", category: "Frontend" },
        "vue": { icon: "SiVue", color: "#4FC08D", category: "Frontend" },
        "vue.js": { icon: "SiVue", color: "#4FC08D", category: "Frontend" },
        "angular": { icon: "SiAngular", color: "#DD0031", category: "Frontend" },
        "svelte": { icon: "SiSvelte", color: "#FF3E00", category: "Frontend" },
        "next.js": { icon: "SiNextdotjs", color: "#000000", category: "Frontend" },
        "typescript": { icon: "SiTypescript", color: "#3178C6", category: "Languages" },
        "javascript": { icon: "SiJavascript", color: "#F7DF1E", category: "Languages" },
        "html": { icon: "SiHtml5", color: "#E34F26", category: "Frontend" },
        "css": { icon: "SiCss3", color: "#1572B6", category: "Frontend" },
        "tailwind": { icon: "SiTailwindcss", color: "#06B6D4", category: "Frontend" },
        "python": { icon: "SiPython", color: "#3776AB", category: "Core ML/AI" },
        "tensorflow": { icon: "SiTensorflow", color: "#FF6F00", category: "Core ML/AI" },
        "node": { icon: "SiNodedotjs", color: "#339933", category: "Backend" },
        "node.js": { icon: "SiNodedotjs", color: "#339933", category: "Backend" },
        "express": { icon: "SiExpress", color: "#000000", category: "Backend" },
        "django": { icon: "SiDjango", color: "#092E20", category: "Backend" },
        "flask": { icon: "SiFlask", color: "#000000", category: "Backend" },
        "fastapi": { icon: "SiFastapi", color: "#009688", category: "Backend" },
        "spring": { icon: "SiSpring", color: "#6DB33F", category: "Backend" },
        "go": { icon: "SiGo", color: "#00ADD8", category: "Languages" },
        "rust": { icon: "SiRust", color: "#000000", category: "Languages" },
        "java": { icon: "SiSpring", color: "#007396", category: "Languages" },
        "c++": { icon: "SiCplusplus", color: "#00599C", category: "Languages" },
        "cpp": { icon: "SiCplusplus", color: "#00599C", category: "Languages" },
        "docker": { icon: "SiDocker", color: "#2496ED", category: "DevOps / Cloud" },
        "kubernetes": { icon: "SiKubernetes", color: "#326CE5", category: "DevOps / Cloud" },
        "aws": { icon: "SiAmazon", color: "#FF9900", category: "DevOps / Cloud" },
        "google cloud": { icon: "SiGooglecloud", color: "#4285F4", category: "DevOps / Cloud" },
        "gcp": { icon: "SiGooglecloud", color: "#4285F4", category: "DevOps / Cloud" },
        "linux": { icon: "SiLinux", color: "#FCC624", category: "DevOps / Cloud" },
        "git": { icon: "SiGit", color: "#F05032", category: "Tools & Utilities" },
        "mongodb": { icon: "SiMongodb", color: "#47A248", category: "Database" },
        "postgresql": { icon: "SiPostgresql", color: "#4169E1", category: "Database" },
        "mysql": { icon: "SiMysql", color: "#4479A1", category: "Database" },
        "redis": { icon: "SiRedis", color: "#DC382D", category: "Database" },
        "firebase": { icon: "SiFirebase", color: "#FFCA28", category: "Database" },
        "graphql": { icon: "SiGraphql", color: "#E10098", category: "Backend" },
        // Expanded AI/ML
        "scikit-learn": { icon: "SiScikitlearn", color: "#F7931E", category: "Core ML/AI" },
        "sciketlearn": { icon: "SiScikitlearn", color: "#F7931E", category: "Core ML/AI" },
        "sklearn": { icon: "SiScikitlearn", color: "#F7931E", category: "Core ML/AI" },
        "jupyter": { icon: "SiJupyter", color: "#F37626", category: "Core ML/AI" },
        "pytorch": { icon: "SiPytorch", color: "#EE4C2C", category: "Core ML/AI" },
        "computer vision": { icon: "SiOpencv", color: "#5C3EE8", category: "Core ML/AI" },
        "compuer vision": { icon: "SiOpencv", color: "#5C3EE8", category: "Core ML/AI" },
        "cv": { icon: "SiOpencv", color: "#5C3EE8", category: "Core ML/AI" },
        "opencv": { icon: "SiOpencv", color: "#5C3EE8", category: "Core ML/AI" },
        "nlp": { icon: "NLP", color: "#10B981", category: "Core ML/AI" },
        "natural language processing": { icon: "NLP", color: "#10B981", category: "Core ML/AI" },
        "gen ai": { icon: "Gen AI", color: "#8E55EA", category: "Core ML/AI" },
        "generative ai": { icon: "Gen AI", color: "#8E55EA", category: "Core ML/AI" },
        "llm": { icon: "LLM", color: "#8E55EA", category: "Core ML/AI" },
        "langchain": { icon: "SiLangchain", color: "#DDDDDD", category: "Core ML/AI" },
        "streamlit": { icon: "SiStreamlit", color: "#FF4B4B", category: "Core ML/AI" },
        "openai": { icon: "SiOpenai", color: "#412991", category: "Core ML/AI" },
        "keras": { icon: "SiKeras", color: "#D00000", category: "Core ML/AI" },
        "hugging face": { icon: "SiHuggingface", color: "#FFD21E", category: "Core ML/AI" },
        "huggingface": { icon: "SiHuggingface", color: "#FFD21E", category: "Core ML/AI" },
    };

    // Watch for name changes to auto-fill
    const watchedName = form.watch("name");
    useEffect(() => {
        if (!watchedName) return;
        const lowerName = watchedName.toLowerCase().trim();
        const match = knownSkills[lowerName];

        if (match) {
            // Only auto-fill if the user hasn't heavily customized (or just overwrite for convenience as per request)
            // The user requested "automatically show correct icon", so we prioritise the match.
            const currentIcon = form.getValues("icon");
            const currentColor = form.getValues("color");

            // If icon is default/empty or different, update it
            if (currentIcon !== match.icon) {
                form.setValue("icon", match.icon);
            }
            // Same for color
            if (currentColor !== match.color) {
                form.setValue("color", match.color);
            }
            // And category if it's the default "Languages" or empty
            const currentCategory = form.getValues("category");
            if (currentCategory === "Languages" || !currentCategory) {
                form.setValue("category", match.category);
            }
        }
    }, [watchedName, form]);

    const skillCategories = [
        "Languages",
        "Frontend",
        "Backend",
        "Database",
        "DevOps / Cloud",
        "Tools & Utilities",
        "Soft Skills",
        "Frameworks",
        "Other"
    ];

    const handleSubmit = async (values: any) => {
        try {
            await onSubmit(values);
            setOpen(false);
            if (!defaultValues) form.reset();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] border-border/50 bg-background/95 backdrop-blur-xl">
                <DialogHeader>
                    <DialogTitle className="text-xl font-heading text-foreground">{title}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 pt-4">
                        <FormField control={form.control} name="name" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Skill Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g. TypeScript" {...field} className="bg-muted/30 border-primary/20 focus:border-primary focus:ring-primary/20 transition-all" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <FormField control={form.control} name="category" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Category</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="bg-muted/30 border-primary/20 focus:border-primary focus:ring-primary/20 transition-all">
                                            <SelectValue placeholder="Select a category" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {Array.from(new Set([...skillCategories, defaultValues?.category].filter(Boolean))).map((cat) => (
                                            <SelectItem key={cat as string} value={cat as string}>{cat as string}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <FormField control={form.control} name="color" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Brand Color</FormLabel>
                                <div className="flex gap-3">
                                    <div className="relative flex-1">
                                        <FormControl>
                                            <Input placeholder="#000000" {...field} value={field.value || ""} className="bg-muted/30 border-primary/20 focus:border-primary focus:ring-primary/20 transition-all font-mono" />
                                        </FormControl>
                                    </div>
                                    <FormControl>
                                        <div className="h-10 w-10 rounded-md border border-border overflow-hidden cursor-pointer relative shadow-sm">
                                            <Input
                                                type="color"
                                                {...field}
                                                value={field.value || "#000000"}
                                                className="absolute inset-0 w-[150%] h-[150%] p-0 -top-1/4 -left-1/4 cursor-pointer"
                                            />
                                        </div>
                                    </FormControl>
                                </div>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <div className="flex gap-4 pt-2">
                            <DialogTrigger asChild>
                                <Button type="button" variant="outline" className="w-full">Cancel</Button>
                            </DialogTrigger>
                            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25" disabled={isPending}>
                                {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                                {defaultValues ? 'Save Changes' : 'Add Skill'}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

function CertificatesManager() {
    const { toast } = useToast();
    const { data: certificates, isLoading } = useQuery<Certificate[]>({
        queryKey: ["/api/certificates"],
    });

    const createCertificateMutation = useMutation({
        mutationFn: async (newCert: any) => {
            const res = await apiRequest("POST", "/api/certificates", newCert);
            return await res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/certificates"] });
            toast({ title: "Certificate added" });
        },
        onError: (error: Error) => {
            toast({ title: "Failed to add certificate", description: error.message, variant: "destructive" });
        }
    });

    const updateCertificateMutation = useMutation({
        mutationFn: async ({ id, data }: { id: number, data: any }) => {
            const res = await apiRequest("PATCH", `/api/certificates/${id}`, data);
            return await res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/certificates"] });
            toast({ title: "Certificate updated" });
        },
        onError: (error: Error) => {
            toast({ title: "Failed to update certificate", description: error.message, variant: "destructive" });
        }
    });

    const deleteCertificateMutation = useMutation({
        mutationFn: async (id: number) => {
            await apiRequest("DELETE", `/api/certificates/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/certificates"] });
            toast({ title: "Certificate deleted" });
        },
    });

    if (isLoading) return <Loader2 className="animate-spin h-8 w-8 mx-auto text-primary" />;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <Card className="bg-card/30 backdrop-blur-sm border-border/40 border-none shadow-none">
                <div className="flex flex-row items-center justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-semibold text-foreground">Certificates</h2>
                        <p className="text-sm text-muted-foreground">Manage your certifications and achievements</p>
                    </div>
                    <CertificateDialog
                        trigger={
                            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20">
                                <Plus className="mr-2 h-4 w-4" /> Add Certificate
                            </Button>
                        }
                        onSubmit={(data) => createCertificateMutation.mutateAsync(data)}
                        isPending={createCertificateMutation.isPending}
                        title="Add New Certificate"
                    />
                </div>

                <div className="grid gap-4">
                    {certificates?.map((cert, index) => (
                        <motion.div
                            key={cert.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="flex items-center justify-between p-4 border border-border/40 rounded-xl bg-card/40 hover:bg-muted/50 transition-all duration-300 group"
                        >
                            <div className="flex items-center gap-4">
                                <div className="relative overflow-hidden rounded-lg w-16 h-16 group-hover:shadow-md transition-all flex items-center justify-center bg-muted/50">
                                    {cert.image ? (
                                        <img src={cert.image} alt={cert.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <GraduationCap className="h-8 w-8 text-muted-foreground" />
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{cert.title}</h3>
                                    <p className="text-sm text-muted-foreground">{cert.issuer} • {cert.date}</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <CertificateDialog
                                    trigger={
                                        <Button variant="ghost" size="icon" className="hover:bg-primary/10 hover:text-primary">
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                    }
                                    onSubmit={(data) => updateCertificateMutation.mutateAsync({ id: cert.id, data })}
                                    isPending={updateCertificateMutation.isPending}
                                    defaultValues={cert}
                                    title="Edit Certificate"
                                />
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="hover:bg-destructive/10 hover:text-destructive"
                                    onClick={() => {
                                        if (confirm("Are you sure?")) deleteCertificateMutation.mutate(cert.id);
                                    }}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </motion.div>
                    ))}
                    {certificates?.length === 0 && <p className="text-center text-muted-foreground py-12 bg-muted/20 rounded-xl border border-border/20 border-dashed">No certificates found. Add one to get started!</p>}
                </div>
            </Card>
        </motion.div>
    );
}

function CertificateDialog({ trigger, onSubmit, isPending, defaultValues, title }: {
    trigger: React.ReactNode,
    onSubmit: (data: any) => Promise<any>,
    isPending: boolean,
    defaultValues?: Partial<Certificate>,
    title: string
}) {
    const [open, setOpen] = useState(false);
    const form = useForm({
        resolver: zodResolver(insertCertificateSchema),
        defaultValues: {
            title: defaultValues?.title || "",
            issuer: defaultValues?.issuer || "",
            date: defaultValues?.date || "",
            description: defaultValues?.description || "",
            image: defaultValues?.image || "",
            credentialUrl: defaultValues?.credentialUrl || "",
        }
    });

    const handleSubmit = async (values: any) => {
        try {
            await onSubmit(values);
            setOpen(false);
            if (!defaultValues) form.reset();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px] border-border/50 bg-background/95 backdrop-blur-xl">
                <DialogHeader>
                    <DialogTitle className="text-xl font-heading text-foreground">{title}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5 pt-4">
                        <FormField control={form.control} name="title" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Certificate Title</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g. AWS Certified Solutions Architect" {...field} className="bg-muted/30 border-primary/20 focus:border-primary focus:ring-primary/20 transition-all" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <FormField control={form.control} name="issuer" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Issuing Organization</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g. Amazon Web Services" {...field} className="bg-muted/30 border-primary/20 focus:border-primary focus:ring-primary/20 transition-all" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="date" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Issue Date</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="e.g. Dec 2024" className="bg-muted/30 border-primary/20 focus:border-primary focus:ring-primary/20 transition-all" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </div>

                        <FormField control={form.control} name="description" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description / Skills Learned</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Briefly describe what this certification covers..." {...field} className="min-h-[100px] bg-muted/30 border-primary/20 focus:border-primary focus:ring-primary/20 transition-all resize-none" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <FormField control={form.control} name="image" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Badge / Logo URL</FormLabel>
                                <FormControl>
                                    <Input placeholder="https://..." {...field} className="bg-muted/30 border-primary/20 focus:border-primary focus:ring-primary/20 transition-all" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <FormField control={form.control} name="credentialUrl" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Credential URL</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <GraduationCap className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input placeholder="https://..." {...field} value={field.value || ""} className="pl-9 bg-muted/30 border-primary/20 focus:border-primary focus:ring-primary/20 transition-all" />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <div className="flex gap-4 pt-2">
                            <DialogTrigger asChild>
                                <Button type="button" variant="outline" className="w-full">Cancel</Button>
                            </DialogTrigger>
                            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25" disabled={isPending}>
                                {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                                {defaultValues ? 'Save Changes' : 'Add Certificate'}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

function ProfileManager() {
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const { data: profile, isLoading } = useQuery<Profile>({
        queryKey: ["/api/profile"],
    });

    const updateProfileMutation = useMutation({
        mutationFn: async (data: any) => {
            const res = await apiRequest("POST", "/api/profile", data);
            return await res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/profile"] });
            toast({ title: "Success", description: "Profile updated successfully" });
        },
        onError: (error) => {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        }
    });

    if (isLoading) return <div>Loading...</div>;

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Card className="border-border/50 bg-card/30 backdrop-blur-md overflow-hidden">
                <CardHeader>
                    <CardTitle className="text-2xl font-heading font-bold text-foreground flex items-center gap-2">
                        <FileText className="w-6 h-6 text-primary" />
                        Resume Manager
                    </CardTitle>
                    <CardDescription>
                        Upload and manage your publicly available resume.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ProfileForm
                        defaultValues={profile}
                        onSubmit={(data) => updateProfileMutation.mutateAsync(data)}
                        isPending={updateProfileMutation.isPending}
                    />
                </CardContent>
            </Card>
        </motion.div>
    );
}

function ProfileForm({ defaultValues, onSubmit, isPending }: {
    defaultValues?: Profile,
    onSubmit: (data: any) => Promise<any>,
    isPending: boolean
}) {
    const form = useForm({
        resolver: zodResolver(insertProfileSchema),
        defaultValues: {
            name: defaultValues?.name || "",
            title: defaultValues?.title || "",
            tagline: defaultValues?.tagline || "",
            bio: defaultValues?.bio || "",
            resumeUrl: defaultValues?.resumeUrl || "",
            githubUrl: defaultValues?.githubUrl || "",
            linkedinUrl: defaultValues?.linkedinUrl || "",
            email: defaultValues?.email || "",
            openaiApiKey: defaultValues?.openaiApiKey || "",
        }
    });

    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisFeedback, setAnalysisFeedback] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);
    const { toast } = useToast();

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Vercel Serverless limit is 4.5MB for the body. 
            // Base64 adds ~33% overhead. 3MB * 1.33 = ~4MB, which is safe.
            if (file.size > 3 * 1024 * 1024) { // Reduced to 3MB limit
                toast({ title: "File too large", description: "Please upload a PDF smaller than 3MB.", variant: "destructive" });
                return;
            }
            setFileName(file.name);
            const reader = new FileReader();
            reader.onloadend = () => {
                form.setValue("resumeUrl", reader.result as string);
                form.trigger("resumeUrl");
                setAnalysisFeedback(null); // Clear previous feedback
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAnalyze = async () => {
        setIsAnalyzing(true);
        try {
            const res = await apiRequest("POST", "/api/analyze-resume", {
                resumeBase64: form.getValues("resumeUrl"),
            });

            let data;
            const contentType = res.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                data = await res.json();
            } else {
                const text = await res.text();
                throw new Error(`Server Error (${res.status}): ${text.substring(0, 100)}...`);
            }

            if (res.ok) {
                setAnalysisFeedback(data); // Expecting full JSON object
                toast({ title: "Analysis Complete", description: "Your resume score is ready." });
            } else {
                throw new Error(data.message || "Failed to analyze");
            }
        } catch (error: any) {
            console.error("Analysis failed:", error);
            toast({ title: "Analysis Failed", description: error.message, variant: "destructive" });
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-xl mx-auto py-4">
                <FormField control={form.control} name="resumeUrl" render={({ field }) => (
                    <FormItem className="space-y-4">
                        <FormLabel className="text-lg font-semibold">Upload Resume (PDF)</FormLabel>
                        <FormControl>
                            <div className="space-y-4">
                                <div className="border-2 border-dashed border-primary/20 hover:border-primary/50 transition-colors rounded-xl p-8 text-center bg-muted/10 hover:bg-muted/20 relative group cursor-pointer">
                                    <input
                                        type="file"
                                        accept="application/pdf"
                                        onChange={handleFileChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    />
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="p-4 rounded-full bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                                            <FileText className="w-8 h-8" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-foreground">Click or drag PDF here</p>
                                            <p className="text-sm text-muted-foreground mt-1">Max file size: 3MB</p>
                                        </div>
                                    </div>
                                </div>

                                {field.value && field.value.startsWith("data:") && (
                                    <div className="flex items-center gap-2 p-3 bg-green-500/10 text-green-500 rounded-lg border border-green-500/20">
                                        <Check className="w-4 h-4" />
                                        <span className="text-sm font-medium">Selected: {fileName || "New File"}</span>
                                    </div>
                                )}

                                {field.value && !field.value.startsWith("data:") && (
                                    <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-background rounded-md border border-border">
                                                <FileText className="w-4 h-4 text-muted-foreground" />
                                            </div>
                                            <div className="text-sm">
                                                <p className="font-medium">Current Resume</p>
                                                <p className="text-xs text-muted-foreground">Active on public site</p>
                                            </div>
                                        </div>
                                        <Button size="sm" variant="outline" asChild>
                                            <a href={field.value} target="_blank" rel="noreferrer" className="gap-2">
                                                View <FileText className="w-3 h-3" />
                                            </a>
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )} />

                {/* AI Analysis Section */}
                <div className="space-y-4 pt-4 border-t border-border/50">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-primary" /> AI Resume Analysis
                        </h3>
                    </div>

                    <div className="bg-primary/5 rounded-xl p-4 border border-primary/10">
                        <div className="flex justify-between items-start gap-4">
                            <div className="text-sm text-muted-foreground">
                                <p>Upload a new PDF above and click analyze to get AI feedback before saving.</p>
                            </div>
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={handleAnalyze}
                                disabled={!form.watch("resumeUrl")?.startsWith("data:") || isAnalyzing}
                                className="shrink-0"
                            >
                                {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
                                {isAnalyzing ? "Analyzing..." : "Analyze Resume"}
                            </Button>
                        </div>

                        {analysisFeedback && (
                            <div className="mt-4 pt-4 border-t border-border/50 animate-in fade-in slide-in-from-top-2 duration-300">
                                <div className="grid md:grid-cols-[160px_1fr] gap-6">
                                    {/* Score Section */}
                                    <div className="flex flex-col items-center justify-center space-y-2 p-4 bg-background rounded-xl border-2 border-border shadow-sm">
                                        <div className="relative w-24 h-24 flex items-center justify-center">
                                            {/* Simple SVG Radial Progress - reusing logic from Skills maybe, or clean SVG */}
                                            <svg className="w-full h-full transform -rotate-90">
                                                <circle className="text-muted/20" strokeWidth="8" stroke="currentColor" fill="transparent" r="40" cx="48" cy="48" />
                                                <circle
                                                    className="transition-all duration-1000 ease-out"
                                                    strokeWidth="8"
                                                    strokeDasharray={251.2}
                                                    strokeDashoffset={251.2 - ((251.2 * (analysisFeedback as any).score) / 100)}
                                                    strokeLinecap="round"
                                                    stroke={(analysisFeedback as any).scoreColor || "#22c55e"}
                                                    fill="transparent"
                                                    r="40"
                                                    cx="48"
                                                    cy="48"
                                                />
                                            </svg>
                                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                <span className="text-2xl font-bold">{(analysisFeedback as any).score}</span>
                                                <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">ATS Score</span>
                                            </div>
                                        </div>
                                        <p className="text-xs text-center text-muted-foreground font-medium px-2">
                                            {(analysisFeedback as any).score >= 80 ? "Excellent" : (analysisFeedback as any).score >= 50 ? "Good Start" : "Needs Work"}
                                        </p>
                                    </div>

                                    {/* Feedback Sections */}
                                    <div className="space-y-4">
                                        <div className="p-3 bg-background rounded-lg border border-border">
                                            <h4 className="text-sm font-semibold mb-1 flex items-center gap-2">
                                                <SiGo className="w-4 h-4 text-primary" /> Summary
                                            </h4>
                                            <p className="text-sm text-muted-foreground leading-relaxed">{(analysisFeedback as any).summary}</p>
                                        </div>

                                        <div className="grid grid-cols-1 gap-3">
                                            {(analysisFeedback as any).strengths && (
                                                <div className="p-3 bg-green-500/5 rounded-lg border border-green-500/10">
                                                    <h4 className="text-xs font-bold uppercase tracking-wider text-green-600 mb-2 flex items-center gap-2">
                                                        <Check className="w-3 h-3" /> Key Strengths
                                                    </h4>
                                                    <ul className="text-sm space-y-1 text-muted-foreground">
                                                        {(analysisFeedback as any).strengths.map((s: string, i: number) => (
                                                            <li key={i} className="flex items-start gap-2">
                                                                <span className="w-1 h-1 rounded-full bg-green-500 mt-2 shrink-0" />
                                                                {s}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}

                                            {(analysisFeedback as any).suggestions && (
                                                <div className="p-3 bg-amber-500/5 rounded-lg border border-amber-500/10">
                                                    <h4 className="text-xs font-bold uppercase tracking-wider text-amber-600 mb-2 flex items-center gap-2">
                                                        <Sparkles className="w-3 h-3" /> Improvements
                                                    </h4>
                                                    <ul className="text-sm space-y-1 text-muted-foreground">
                                                        {(analysisFeedback as any).suggestions.map((s: string, i: number) => (
                                                            <li key={i} className="flex items-start gap-2">
                                                                <span className="w-1 h-1 rounded-full bg-amber-500 mt-2 shrink-0" />
                                                                {s}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-border/50">
                    <Button type="submit" size="lg" className="w-full sm:w-auto font-medium shadow-lg shadow-primary/20" disabled={isPending}>
                        {isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Uploading...
                            </>
                        ) : (
                            "Update Resume"
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    );
}

