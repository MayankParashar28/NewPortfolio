import { useAuth } from "@/context/AuthProvider";
import React, { useState, useEffect, useRef } from "react";
import { Redirect } from "wouter";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Project, Skill, Certificate, Profile, insertProjectSchema, insertSkillSchema, insertCertificateSchema, insertProfileSchema } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { motion, Reorder, useDragControls } from "framer-motion";
import { Plus, Trash2, LogOut, Loader2, Pencil, LayoutDashboard, Code2, GraduationCap, User as UserIcon, FileText, Github, Linkedin, Mail, Check, Sparkles, AlertCircle, Upload, X, GripVertical } from "lucide-react";
import { compressImage } from "@/lib/imageUtils";
import { getIcon } from "@/lib/skillIcons";
import { ImageUploadZone } from "@/components/ui/image-upload-zone";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import ReactMarkdown from "react-markdown";
import { useToast } from "@/hooks/use-toast";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogDescription,
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
                            Welcome back, Mahir
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

    const [localProjects, setLocalProjects] = useState<Project[]>([]);
    const [isOrderChanged, setIsOrderChanged] = useState(false);
    const [projectToDelete, setProjectToDelete] = useState<number | null>(null);

    useEffect(() => {
        if (projects) {
            setLocalProjects(projects);
            setIsOrderChanged(false);
        }
    }, [projects]);

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
            // Invalidate only if it's not part of a bulk reorder to avoid spam, 
            // but here simple invalidation is fine as we will re-fetch sorted list.
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
        onSuccess: (data, id) => {
            // Optimistically remove from local state
            setLocalProjects(prev => prev.filter(p => p.id !== id));
            queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
            toast({ title: "Project deleted" });
        },
    });

    const saveOrder = async () => {
        try {
            const items = localProjects.map((p, i) => ({ id: p.id, order: i }));
            console.log("Saving order:", items);
            await apiRequest("POST", "/api/projects/reorder", { items });

            queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
            toast({ title: "Order saved", description: "Project order has been updated." });
            setIsOrderChanged(false);
        } catch (error: any) {
            console.error("Failed to save order:", error);
            toast({ title: "Failed to save order", description: error.message || "Unknown error occurred", variant: "destructive" });
        }
    };

    const handleReorder = (newOrder: Project[]) => {
        setLocalProjects(newOrder);
        setIsOrderChanged(true);
    };

    if (isLoading) return <Loader2 className="animate-spin h-8 w-8 mx-auto text-primary" />;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <Card className="bg-card/30 backdrop-blur-sm border-border/40 border-none shadow-none">
                <div className="flex flex-row items-center justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-semibold text-foreground">Project List</h2>
                        <p className="text-sm text-muted-foreground">
                            {isOrderChanged ? "Unsaved changes to order!" : "Manage your portfolio projects"}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        {isOrderChanged && (
                            <Button
                                onClick={saveOrder}
                                variant="outline"
                                className="border-yellow-500/50 text-yellow-500 hover:bg-yellow-500/10"
                            >
                                Save Order
                            </Button>
                        )}
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
                </div>

                <div className="grid gap-4">
                    <Reorder.Group axis="y" values={localProjects} onReorder={handleReorder} className="flex flex-col gap-4">
                        {localProjects.map((project) => (
                            <SortableProjectItem
                                key={project.id}
                                project={project}
                                index={localProjects.findIndex(p => p.id === project.id)}
                                onUpdate={(data) => updateProjectMutation.mutateAsync({ id: project.id, data })}
                                onDelete={() => setProjectToDelete(project.id)}
                                isUpdatePending={updateProjectMutation.isPending}
                            />
                        ))}
                    </Reorder.Group>
                    {projects?.length === 0 && <p className="text-center text-muted-foreground py-12 bg-muted/20 rounded-xl border border-border/20 border-dashed">No projects found. Add one to get started!</p>}
                </div>
            </Card>

            <AlertDialog open={!!projectToDelete} onOpenChange={(open) => !open && setProjectToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This project will be permanently deleted. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                if (projectToDelete) deleteProjectMutation.mutate(projectToDelete);
                                setProjectToDelete(null);
                            }}
                            className="bg-destructive hover:bg-destructive/90"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </motion.div>
    );
}

function SortableProjectItem({
    project,
    index,
    onUpdate,
    onDelete,
    isUpdatePending
}: {
    project: Project,
    index: number,
    onUpdate: (data: any) => Promise<any>,
    onDelete: () => void,
    isUpdatePending: boolean
}) {
    const dragControls = useDragControls();

    return (
        <Reorder.Item
            value={project}
            dragListener={false}
            dragControls={dragControls}
        >
            <div className="flex items-center justify-between p-4 border border-border/40 rounded-xl bg-card/40 hover:bg-muted/50 transition-all duration-300 group select-none relative">
                <div className="flex items-center gap-4">
                    <div
                        className="cursor-grab active:cursor-grabbing text-muted-foreground/50 hover:text-foreground p-2 -ml-2 hover:bg-muted rounded-md touch-none"
                        onPointerDown={(e) => dragControls.start(e)}
                    >
                        <GripVertical className="h-5 w-5" />
                    </div>
                    <div className="relative overflow-hidden rounded-lg w-16 h-16 group-hover:shadow-md transition-all pointer-events-none">
                        <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{project.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-1 max-w-md">{project.description}</p>
                        <div className="flex flex-col gap-1.5 mt-1">
                            <p className="text-xs text-muted-foreground/60">
                                Order: {index + 1}
                                {project.updatedAt && (
                                    <> • Updated: {new Date(project.updatedAt).toLocaleDateString()}</>
                                )}
                            </p>
                            <div className="flex gap-2">
                                {project.featured && <span className="text-[10px] px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-500 font-medium border border-yellow-500/20">Featured</span>}
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">{project.category}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex gap-2">
                    <ProjectDialog
                        trigger={
                            <Button type="button" variant="ghost" size="icon" className="hover:bg-primary/10 hover:text-primary">
                                <Pencil className="h-4 w-4" />
                            </Button>
                        }
                        onSubmit={onUpdate}
                        isPending={isUpdatePending}
                        defaultValues={project}
                        title="Edit Project"
                    />
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="hover:bg-destructive/10 hover:text-destructive z-10 relative"
                        onClick={(e) => {
                            console.log("Delete button clicked for project:", project.id);
                            e.stopPropagation();
                            e.preventDefault(); // Add preventDefault just in case
                            onDelete();
                        }}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </Reorder.Item>
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
    const { toast } = useToast();
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
            order: defaultValues?.order || 0,
        }
    });

    useEffect(() => {
        if (defaultValues) {
            form.reset({
                title: defaultValues.title || "",
                description: defaultValues.description || "",
                image: defaultValues.image || "",
                tags: defaultValues.tags || [],
                category: defaultValues.category ?
                    (defaultValues.category.toLowerCase().includes("machine learning") && defaultValues.category.toLowerCase().includes("ai") ? "AI / Machine Learning" : defaultValues.category)
                    : "Full Stack",
                githubLink: defaultValues.githubLink || "",
                demoLink: defaultValues.demoLink || "",
                featured: defaultValues.featured || false,
                order: defaultValues.order || 0,
            });
        }
    }, [defaultValues, form]);

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

    const optimizeMutation = useMutation({
        mutationFn: async (data: any) => {
            const res = await apiRequest("POST", "/api/optimize-project", data);
            return await res.json();
        },
        onSuccess: (data) => {
            form.setValue("title", data.title);
            form.setValue("description", data.description);
            form.setValue("tags", data.tags);
            form.setValue("category", data.category);
            toast({ title: "Content Optimized", description: "AI has polished your project details." });
        },
        onError: (error: Error) => {
            let message = error.message;
            try {
                // apiRequest throws "Status: Body", so we try to parse the body if it looks like JSON
                const parts = message.split(": ");
                if (parts.length > 1) {
                    const jsonPart = parts.slice(1).join(": ");
                    const data = JSON.parse(jsonPart);
                    if (data.message) message = data.message;
                }
            } catch (e) {
                // Fallback to raw message if parsing fails
            }

            console.error("Optimization Error Details:", { original: error, message });

            toast({
                title: "Optimization failed",
                description: message || "Please check your internet connection or try again later.",
                variant: "destructive"
            });
        }
    });

    const handleOptimize = (e: React.MouseEvent) => {
        e.preventDefault();
        const values = form.getValues();
        optimizeMutation.mutate(values);
    };

    const handleSubmit = async (values: any, e?: React.BaseSyntheticEvent) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        try {
            // Force strict normalization for AI/ML category
            if (values.category &&
                values.category.toLowerCase().includes("machine learning") &&
                values.category.toLowerCase().includes("ai")) {
                values.category = "AI / Machine Learning";
            }

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
            <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-y-auto border-border/50 bg-background/95 backdrop-blur-xl">
                <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className="flex flex-col gap-1">
                        <DialogTitle className="text-xl font-heading text-foreground">{title}</DialogTitle>
                        <DialogDescription className="text-sm text-muted-foreground">
                            Fill in the details below to {defaultValues ? 'update' : 'create'} your project.
                        </DialogDescription>
                    </div>
                    <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={handleOptimize}
                        disabled={optimizeMutation.isPending}
                        className="bg-primary/5 border-primary/20 text-primary hover:bg-primary/10 transition-colors"
                    >
                        {optimizeMutation.isPending ? <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" /> : <Sparkles className="mr-2 h-3.5 w-3.5" />}
                        Optimize with AI
                    </Button>
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
                                <FormLabel>Cover Image <span className="text-destructive">*</span></FormLabel>
                                <FormControl>
                                    <div className="space-y-4">
                                        <Tabs defaultValue="url" className="w-full">
                                            <TabsList className="grid w-full grid-cols-2">
                                                <TabsTrigger value="url">Image URL</TabsTrigger>
                                                <TabsTrigger value="upload">Upload File</TabsTrigger>
                                            </TabsList>
                                            <TabsContent value="url" className="mt-4">
                                                <Input
                                                    placeholder="https://..."
                                                    {...field}
                                                    value={field.value?.toString().startsWith('data:') ? '' : field.value}
                                                    className="bg-muted/30 border-primary/20 focus:border-primary focus:ring-primary/20 transition-all"
                                                />
                                            </TabsContent>
                                            <TabsContent value="upload" className="mt-4">
                                                <ImageUploadZone onImageSelected={async (file) => {
                                                    try {
                                                        const compressed = await compressImage(file);
                                                        field.onChange(compressed);
                                                    } catch (err) {
                                                        console.error("Compression failed", err);
                                                    }
                                                }} />
                                            </TabsContent>
                                        </Tabs>

                                        {field.value && (
                                            <div className="mt-4 rounded-lg overflow-hidden border border-border bg-muted/20 p-2 fade-in-20 animate-in">
                                                <div className="flex justify-between items-center mb-2 px-1">
                                                    <p className="text-xs text-muted-foreground">Preview:</p>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => field.onChange("")}
                                                        className="h-6 w-6 p-0 text-destructive hover:bg-destructive/10"
                                                    >
                                                        <Trash2 className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                                <div className="relative aspect-video w-full rounded-md overflow-hidden bg-background/50">
                                                    <img
                                                        key={field.value?.toString().substring(0, 50)}
                                                        src={field.value?.toString()}
                                                        alt="Preview"
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            (e.target as HTMLImageElement).style.display = 'none';
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </FormControl>
                                <FormMessage className="text-destructive text-xs" />
                            </FormItem>
                        )} />

                        <FormField control={form.control} name="featured" render={({ field }) => (
                            <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-4 border border-primary/10 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors">
                                <FormControl>
                                    <Checkbox checked={field.value ?? false} onCheckedChange={field.onChange} className="data-[state=checked]:bg-primary data-[state=checked]:border-primary" />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                    <FormLabel className="cursor-pointer font-medium text-primary">Featured Project</FormLabel>
                                </div>
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



function SkillDialog({ trigger, onSubmit, isPending, defaultValues, title }: {
    trigger: React.ReactNode,
    onSubmit: (data: any) => Promise<any>,
    isPending: boolean,
    defaultValues?: Partial<Skill>,
    title: string
}) {
    const { toast } = useToast();
    const [open, setOpen] = useState(false);
    const [suggestions, setSuggestions] = useState<any[]>([]);

    const form = useForm({
        resolver: zodResolver(insertSkillSchema),
        defaultValues: {
            name: defaultValues?.name || "",
            category: defaultValues?.category || "Languages",
            icon: defaultValues?.icon || "default",
            color: defaultValues?.color || "#000000",
        }
    });

    useEffect(() => {
        if (defaultValues) {
            form.reset({
                name: defaultValues.name || "",
                category: defaultValues.category || "Languages",
                icon: defaultValues.icon || "default",
                color: defaultValues.color || "#000000",
            });
        }
    }, [defaultValues, form]);

    // Auto-detection map (kept for icon mapping)
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
        "Core ML/AI",
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
                <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
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

function SkillsManager() {
    const { toast } = useToast();
    const { data: skills, isLoading } = useQuery<Skill[]>({
        queryKey: ["/api/skills"],
    });

    const [localSkills, setLocalSkills] = useState<Skill[]>([]);
    const [isOrderChanged, setIsOrderChanged] = useState(false);
    const [skillToDelete, setSkillToDelete] = useState<number | null>(null);

    useEffect(() => {
        if (skills) {
            setLocalSkills(skills);
            setIsOrderChanged(false);
        }
    }, [skills]);

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
        onSuccess: (data, id) => {
            setLocalSkills(prev => prev.filter(s => s.id !== id));
            queryClient.invalidateQueries({ queryKey: ["/api/skills"] });
            toast({ title: "Skill deleted" });
        },
    });

    const saveOrder = async () => {
        try {
            for (let i = 0; i < localSkills.length; i++) {
                const skill = localSkills[i];
                await apiRequest("PATCH", `/api/skills/${skill.id}`, { order: i });
            }
            queryClient.invalidateQueries({ queryKey: ["/api/skills"] });
            toast({ title: "Order saved", description: "Skill order has been updated." });
            setIsOrderChanged(false);
        } catch (error: any) {
            console.error("Failed to save order:", error);
            toast({ title: "Failed to save order", description: error.message || "Unknown error occurred", variant: "destructive" });
        }
    };

    const handleReorder = (newOrder: Skill[]) => {
        setLocalSkills(newOrder);
        setIsOrderChanged(true);
    };

    if (isLoading) return <Loader2 className="animate-spin h-8 w-8 mx-auto text-primary" />;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <Card className="bg-card/30 backdrop-blur-sm border-border/40 border-none shadow-none">
                <div className="flex flex-row items-center justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-semibold text-foreground">Skills</h2>
                        <p className="text-sm text-muted-foreground">
                            {isOrderChanged ? "Unsaved changes to order!" : "Manage your technical expertise"}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        {isOrderChanged && (
                            <Button
                                onClick={saveOrder}
                                variant="outline"
                                className="border-yellow-500/50 text-yellow-500 hover:bg-yellow-500/10"
                            >
                                Save Order
                            </Button>
                        )}
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
                </div>

                <div className="grid gap-4">
                    <Reorder.Group axis="y" values={localSkills} onReorder={handleReorder} className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {localSkills.map((skill) => (
                            <SortableSkillItem
                                key={skill.id}
                                skill={skill}
                                onUpdate={(data) => updateSkillMutation.mutateAsync({ id: skill.id, data })}
                                onDelete={() => setSkillToDelete(skill.id)}
                                isUpdatePending={updateSkillMutation.isPending}
                            />
                        ))}
                    </Reorder.Group>
                    {skills?.length === 0 && <p className="text-center text-muted-foreground py-12 bg-muted/20 rounded-xl border border-border/20 border-dashed">No skills found. Add one to get started!</p>}
                </div>
            </Card>

            <AlertDialog open={!!skillToDelete} onOpenChange={(open) => !open && setSkillToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This skill will be permanently deleted.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                if (skillToDelete) deleteSkillMutation.mutate(skillToDelete);
                                setSkillToDelete(null);
                            }}
                            className="bg-destructive hover:bg-destructive/90"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </motion.div>
    );
}

function CertificatesManager() {
    const { toast } = useToast();
    const { data: certificates, isLoading } = useQuery<Certificate[]>({
        queryKey: ["/api/certificates"],
    });

    const [localCertificates, setLocalCertificates] = useState<Certificate[]>([]);
    const [isOrderChanged, setIsOrderChanged] = useState(false);
    const [certToDelete, setCertToDelete] = useState<number | null>(null);

    useEffect(() => {
        if (certificates) {
            setLocalCertificates(certificates);
            setIsOrderChanged(false);
        }
    }, [certificates]);

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
        onSuccess: (data, id) => {
            setLocalCertificates(prev => prev.filter(c => c.id !== id));
            queryClient.invalidateQueries({ queryKey: ["/api/certificates"] });
            toast({ title: "Certificate deleted" });
        },
    });

    const saveOrder = async () => {
        try {
            for (let i = 0; i < localCertificates.length; i++) {
                const cert = localCertificates[i];
                await apiRequest("PATCH", `/api/certificates/${cert.id}`, { order: i });
            }
            queryClient.invalidateQueries({ queryKey: ["/api/certificates"] });
            toast({ title: "Order saved", description: "Certificate order has been updated." });
            setIsOrderChanged(false);
        } catch (error: any) {
            console.error("Failed to save order:", error);
            toast({ title: "Failed to save order", description: error.message || "Unknown error occurred", variant: "destructive" });
        }
    };

    const handleReorder = (newOrder: Certificate[]) => {
        setLocalCertificates(newOrder);
        setIsOrderChanged(true);
    };

    if (isLoading) return <Loader2 className="animate-spin h-8 w-8 mx-auto text-primary" />;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <Card className="bg-card/30 backdrop-blur-sm border-border/40 border-none shadow-none">
                <div className="flex flex-row items-center justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-semibold text-foreground">Certificates</h2>
                        <p className="text-sm text-muted-foreground">Manage your certifications and achievements</p>
                    </div>
                    <div className="flex gap-2">
                        {isOrderChanged && (
                            <Button
                                onClick={saveOrder}
                                variant="outline"
                                className="border-yellow-500/50 text-yellow-500 hover:bg-yellow-500/10"
                            >
                                Save Order
                            </Button>
                        )}
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
                </div>

                <div className="grid gap-4">
                    <Reorder.Group axis="y" values={localCertificates} onReorder={handleReorder} className="flex flex-col gap-4">
                        {localCertificates.map((cert) => (
                            <SortableCertificateItem
                                key={cert.id}
                                cert={cert}
                                onUpdate={(data) => updateCertificateMutation.mutateAsync({ id: cert.id, data })}
                                onDelete={() => setCertToDelete(cert.id)}
                                isUpdatePending={updateCertificateMutation.isPending}
                            />
                        ))}
                    </Reorder.Group>
                    {certificates?.length === 0 && <p className="text-center text-muted-foreground py-12 bg-muted/20 rounded-xl border border-border/20 border-dashed">No certificates found. Add one to get started!</p>}
                </div>
            </Card>

            <AlertDialog open={!!certToDelete} onOpenChange={(open) => !open && setCertToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This certificate will be permanently deleted.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                if (certToDelete) deleteCertificateMutation.mutate(certToDelete);
                                setCertToDelete(null);
                            }}
                            className="bg-destructive hover:bg-destructive/90"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
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
    const { toast } = useToast();
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

    useEffect(() => {
        if (defaultValues) {
            form.reset({
                title: defaultValues.title || "",
                issuer: defaultValues.issuer || "",
                date: defaultValues.date || "",
                description: defaultValues.description || "",
                image: defaultValues.image || "",
                credentialUrl: defaultValues.credentialUrl || "",
            });
        }
    }, [defaultValues, form]);

    const optimizeMutation = useMutation({
        mutationFn: async (data: any) => {
            const res = await apiRequest("POST", "/api/optimize-certificate", data);
            return await res.json();
        },
        onSuccess: (data) => {
            if (data.description) form.setValue("description", data.description);
            toast({ title: "Content Optimized", description: "AI has polished your certificate description." });
        },
        onError: () => {
            toast({ title: "Optimization failed", variant: "destructive" });
        }
    });

    const handleOptimize = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation(); // Stop propagation
        const { title, issuer, date } = form.getValues();
        if (!title || !issuer) {
            toast({ title: "Missing Info", description: "Please fill in Title and Issuer first.", variant: "destructive" });
            return;
        }
        optimizeMutation.mutate({ title, issuer, date });
    };

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
                <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <DialogTitle className="text-xl font-heading text-foreground">{title}</DialogTitle>
                    <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={handleOptimize}
                        disabled={optimizeMutation.isPending}
                        className="bg-primary/5 border-primary/20 text-primary hover:bg-primary/10 transition-colors"
                    >
                        {optimizeMutation.isPending ? <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" /> : <Sparkles className="mr-2 h-3.5 w-3.5" />}
                        Optimize with AI
                    </Button>
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
            atsScore: defaultValues?.atsScore || 0,
            atsFeedback: defaultValues?.atsFeedback || null,
        }
    });

    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisFeedback, setAnalysisFeedback] = useState<any | null>(defaultValues?.atsFeedback || null);
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
        if (!fileName) {
            toast({ title: "No Resume Selected", description: "Please upload a new resume PDF to analyze.", variant: "destructive" });
            return;
        }

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
                form.setValue("atsScore", data.score || 0);
                form.setValue("atsFeedback", data);
                // toast({ title: "Analysis Complete", description: "Score updated. Save resume to persist." });
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
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full mx-auto py-4">
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
                                disabled={isAnalyzing}
                                className="shrink-0"
                            >
                                {isAnalyzing ? <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
                                {isAnalyzing ? "Analyzing..." : "Analyze Resume"}
                            </Button>
                        </div>

                        {(analysisFeedback && (analysisFeedback.score !== undefined || analysisFeedback.scoreColor)) && (
                            <div className="mt-12 pt-8 border-t border-border animate-in fade-in slide-in-from-top-6 duration-700">

                                {/* Hero Score Card */}
                                <div className="bg-gradient-to-br from-background to-muted/20 rounded-3xl p-8 border border-border/50 shadow-xl relative overflow-hidden mb-8">
                                    <div className="absolute top-0 right-0 p-8 opacity-10 blur-3xl rounded-full bg-primary w-64 h-64 -mr-20 -mt-20 pointer-events-none"></div>
                                    <div className="flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10 text-center lg:text-left">
                                        <div className="flex flex-col items-center lg:items-start space-y-4 max-w-xl">
                                            <h3 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                                                Resume Audit Report
                                            </h3>
                                            <p className="text-muted-foreground text-lg md:text-xl leading-relaxed">
                                                {analysisFeedback.summary || "Analysis complete. Review the breakdown below."}
                                            </p>
                                        </div>

                                        <div className="flex flex-col items-center">
                                            <div className="relative w-48 h-48 flex items-center justify-center">
                                                <svg className="w-full h-full transform -rotate-90 drop-shadow-2xl">
                                                    <circle className="text-muted/10" strokeWidth="12" stroke="currentColor" fill="transparent" r="88" cx="96" cy="96" />
                                                    <circle
                                                        className="transition-all duration-[2000ms] ease-out"
                                                        strokeWidth="12"
                                                        strokeDasharray={552.9}
                                                        strokeDashoffset={552.9 - ((552.9 * (analysisFeedback.score || 0)) / 100)}
                                                        strokeLinecap="round"
                                                        stroke={analysisFeedback.scoreColor || "#22c55e"}
                                                        fill="transparent"
                                                        r="88"
                                                        cx="96"
                                                        cy="96"
                                                    />
                                                </svg>
                                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                    <span className="text-6xl font-black tracking-tighter" style={{ color: analysisFeedback.scoreColor || "#22c55e" }}>
                                                        {analysisFeedback.score || 0}
                                                    </span>
                                                    <span className="text-sm text-muted-foreground uppercase font-bold tracking-widest mt-1">ATS Score</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-8">
                                    {/* Strengths Card */}
                                    {analysisFeedback.strengths && Array.isArray(analysisFeedback.strengths) && (
                                        <div className="group rounded-2xl p-6 bg-gradient-to-b from-green-500/5 to-transparent border border-green-500/10 hover:border-green-500/30 transition-all shadow-sm">
                                            <div className="flex items-center gap-3 mb-6">
                                                <div className="p-3 rounded-xl bg-green-500/10 text-green-600 group-hover:scale-110 transition-transform">
                                                    <Check className="w-6 h-6" />
                                                </div>
                                                <h4 className="text-xl font-bold text-foreground">Top Strengths</h4>
                                            </div>
                                            <ul className="space-y-4">
                                                {analysisFeedback.strengths.map((s: string, i: number) => (
                                                    <li key={i} className="flex gap-4 items-start p-3 rounded-lg hover:bg-green-500/5 transition-colors">
                                                        <div className="w-2 h-2 rounded-full bg-green-500 mt-2 shrink-0 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                                                        <span className="text-base text-muted-foreground font-medium">{s}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {/* Weaknesses Card (New) */}
                                    {analysisFeedback.weaknesses && Array.isArray(analysisFeedback.weaknesses) && (
                                        <div className="group rounded-2xl p-6 bg-gradient-to-b from-red-500/5 to-transparent border border-red-500/10 hover:border-red-500/30 transition-all shadow-sm">
                                            <div className="flex items-center gap-3 mb-6">
                                                <div className="p-3 rounded-xl bg-red-500/10 text-red-600 group-hover:scale-110 transition-transform">
                                                    <AlertCircle className="w-6 h-6" />
                                                </div>
                                                <h4 className="text-xl font-bold text-foreground">Critical Issues</h4>
                                            </div>
                                            <ul className="space-y-4">
                                                {analysisFeedback.weaknesses.map((s: string, i: number) => (
                                                    <li key={i} className="flex gap-4 items-start p-3 rounded-lg hover:bg-red-500/5 transition-colors">
                                                        <div className="w-2 h-2 rounded-full bg-red-500 mt-2 shrink-0 shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
                                                        <span className="text-base text-muted-foreground font-medium">{s}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>

                                {/* Action Plan Card */}
                                {analysisFeedback.suggestions && Array.isArray(analysisFeedback.suggestions) && (
                                    <div className="mt-8 rounded-2xl p-8 bg-gradient-to-r from-blue-500/5 via-indigo-500/5 to-purple-500/5 border border-indigo-500/10 shadow-lg">
                                        <div className="flex items-center gap-4 mb-8">
                                            <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-600">
                                                <Sparkles className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h4 className="text-2xl font-bold text-foreground">Improvement Plan</h4>
                                                <p className="text-muted-foreground">Actionable steps to increase your ATS score</p>
                                            </div>
                                        </div>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            {analysisFeedback.suggestions.map((s: string, i: number) => (
                                                <div key={i} className="flex gap-4 p-4 rounded-xl bg-background/50 border border-border/50 hover:bg-background hover:shadow-md transition-all">
                                                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold text-sm shrink-0 dark:bg-indigo-900 dark:text-indigo-300">
                                                        {i + 1}
                                                    </span>
                                                    <span className="text-base text-muted-foreground font-medium mt-1">{s}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
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

function SortableSkillItem({ skill, onUpdate, onDelete, isUpdatePending }: {
    skill: Skill,
    onUpdate: (data: any) => Promise<any>,
    onDelete: () => void,
    isUpdatePending: boolean
}) {
    const dragControls = useDragControls();

    return (
        <Reorder.Item
            value={skill}
            id={String(skill.id)}
            dragListener={false}
            dragControls={dragControls}
            className="relative"
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center p-6 border border-border/40 rounded-xl bg-card/40 hover:bg-muted/50 transition-all duration-300 group select-none aspect-square relative"
            >
                <div className="absolute top-2 left-2 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-50 hover:!opacity-100 transition-opacity p-1" onPointerDown={(e) => dragControls.start(e)}>
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                </div>

                <div className="flex flex-col items-center gap-3 mb-2 w-full">
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center font-bold text-xl bg-primary/10 text-primary">
                        {React.createElement(getIcon(skill), { className: "w-6 h-6" })}
                    </div>
                    <div className="text-center">
                        <p className="font-semibold text-base text-foreground">{skill.name}</p>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{skill.category}</p>
                    </div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity absolute top-2 right-2">
                    <SkillDialog
                        trigger={
                            <Button type="button" variant="ghost" size="icon" className="h-6 w-6 hover:bg-primary/10 hover:text-primary">
                                <Pencil className="h-3 w-3" />
                            </Button>
                        }
                        onSubmit={onUpdate}
                        isPending={isUpdatePending}
                        defaultValues={skill}
                        title="Edit Skill"
                    />
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 hover:bg-destructive/10 text-destructive"
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete();
                        }}
                    >
                        <Trash2 className="h-3 w-3" />
                    </Button>
                </div>
            </motion.div>
        </Reorder.Item>
    );
}

function SortableCertificateItem({ cert, onUpdate, onDelete, isUpdatePending }: {
    cert: Certificate,
    onUpdate: (data: any) => Promise<any>,
    onDelete: () => void,
    isUpdatePending: boolean
}) {
    const dragControls = useDragControls();

    return (
        <Reorder.Item
            value={cert}
            id={String(cert.id)}
            dragListener={false}
            dragControls={dragControls}
            className="relative"
        >
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between p-4 border border-border/40 rounded-xl bg-card/40 hover:bg-muted/50 transition-all duration-300 group"
            >
                <div className="flex items-center gap-4">
                    <div className="cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-50 hover:!opacity-100 transition-opacity p-1" onPointerDown={(e) => dragControls.start(e)}>
                        <GripVertical className="h-4 w-4 text-muted-foreground" />
                    </div>

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
                            <Button type="button" variant="ghost" size="icon" className="hover:bg-primary/10 hover:text-primary">
                                <Pencil className="h-4 w-4" />
                            </Button>
                        }
                        onSubmit={onUpdate}
                        isPending={isUpdatePending}
                        defaultValues={cert}
                        title="Edit Certificate"
                    />
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="hover:bg-destructive/10 hover:text-destructive"
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete();
                        }}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </motion.div>
        </Reorder.Item>
    );
}

