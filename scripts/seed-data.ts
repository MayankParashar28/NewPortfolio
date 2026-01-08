import "dotenv/config";
import { db } from "../server/db";
import { projects, skills, certificates, users } from "../shared/schema";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";
import { eq } from "drizzle-orm";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
    const salt = randomBytes(16).toString("hex");
    const buf = (await scryptAsync(password, salt, 64)) as Buffer;
    return `${buf.toString("hex")}.${salt}`;
}

async function main() {
    console.log("Seeding database...");

    try {
        // 0. Seed Admin User
        console.log("Seeding Admin User...");
        const existingUser = await db.query.users.findFirst({
            where: eq(users.username, "parasharmayank")
        });

        if (!existingUser) {
            const hashedPassword = await hashPassword("admin123");
            await db.insert(users).values({
                username: "parasharmayank",
                password: hashedPassword
            });
            console.log("Admin user created.");
        } else {
            console.log("Admin user already exists. Skipping.");
        }

        // 1. Seed Projects
        console.log("Seeding Projects...");
        const projectData = [
            {
                title: "Intelligent Video Analysis System",
                description: "A robust AI application built with Python and Streamlit that transforms lengthy digital content into concise summaries. By integrating LangChain and the Groq API, the system processes both YouTube videos and standard web pages to extract key insights in real-time.",
                image: "/assets/generated_images/ml_project_dashboard_mockup.png",
                tags: ["Generative AI", "LangChain", "Groq", "Streamlit", "Content Summarization"],
                category: "AI & Machine Learning",
                githubLink: "https://github.com/MayankParashar28/WebTube-Insight",
                demoLink: "",
                featured: false
            },
            {
                title: "NeuroSearch Agent: AI Agent for Information Retrieval",
                description: "NeuroSearch is an advanced conversational agent powered by Llama3 running on Groq’s high-performance inference engine, ensuring near-instantaneous responses.",
                image: "/assets/generated_images/ai_neural_network_visualization.png",
                tags: ["Generative AI", "Groq", "Llama3", "Streamlit", "Content Summarization", "LangChain"],
                category: "AI & Machine Learning",
                githubLink: "https://github.com/MayankParashar28/Open_Search",
                demoLink: "",
                featured: false
            },
            {
                title: "Intelligent Text Completion",
                description: "Next-Predict is an intelligent text completion engine that brings autocomplete capabilities to the next level. Unlike static dictionary lookups, it uses Transformers.",
                image: "/assets/generated_images/deep_learning_research_visualization.png",
                tags: ["NLP", "BERT", "Transformers", "Python", "TextGeneration"],
                category: "AI & Machine Learning",
                githubLink: "https://github.com/MayankParashar28/Next-Predict",
                demoLink: "",
                featured: false
            },
            {
                title: "Face Analysis System",
                description: "A full-stack web application developed with Django and Python that leverages Computer Vision and Deep Learning to analyze human faces.",
                image: "/assets/generated_images/computer_vision_project_interface.png",
                tags: ["Python", "Django", "Image Processing", "Computer Vision", "Deep Learning", "Machine Learning"],
                category: "AI & Machine Learning",
                githubLink: "https://github.com/MayankParashar28/Face_Analysis",
                demoLink: "",
                featured: false
            },
            {
                title: "RentRipple",
                description: "RentRipple is a web application that helps users find and book affordable rental properties in their area. It is a comprehensive peer-to-peer rental marketplace.",
                image: "/assets/generated_images/ml_project_dashboard_mockup.png",
                tags: ["FullStack", "WebDevelopment", "NodeJS", "MVCArchitecture", "MongoDB", "Stripe", "Cloudinary"],
                category: "Full-Stack Development",
                githubLink: "https://github.com/MayankParashar28/RentRipple",
                demoLink: "",
                featured: false
            },
            {
                title: "EaseNavigator",
                description: "EaseNavigator is a smart logistics platform designed to solve range anxiety for Electric Vehicle (EV) drivers. It reduces EV range anxiety by suggesting optimal routes.",
                image: "/assets/generated_images/deep_learning_research_visualization.png",
                tags: ["FullStack", "WebDevelopment", "OSRM", "MVCArchitecture", "PredictiveModeling", "Stripe", "Cloudinary"],
                category: "Full-Stack Development",
                githubLink: "https://github.com/MayankParashar28/EaseNavigator",
                demoLink: "",
                featured: false
            },
            {
                title: "BlogiFy: Secure SSR Blogging",
                description: "BlogiFy redefines the writing experience by embedding artificial intelligence directly into the editorial workflow.",
                image: "/assets/generated_images/ai_neural_network_visualization.png",
                tags: ["FullStack", "WebDevelopment", "BackendEngineering", "MVCArchitecture", "LLMIntegration", "Stripe", "Security"],
                category: "Full-Stack Development",
                githubLink: "https://github.com/MayankParashar28/BlogiFy",
                demoLink: "",
                featured: false
            }
        ];

        for (const project of projectData) {
            const existing = await db.query.projects.findFirst({
                where: eq(projects.title, project.title)
            });
            if (!existing) {
                await db.insert(projects).values(project);
                console.log(`Added project: ${project.title}`);
            }
        }

        // 2. Seed Skills
        console.log("Seeding Skills...");
        const skillData = [
            // Core ML/AI
            { name: "Python", category: "Core ML/AI", color: "#3776AB" },
            { name: "TensorFlow", category: "Core ML/AI", color: "#FF6F00" },
            { name: "PyTorch", category: "Core ML/AI", color: "#EE4C2C" },
            { name: "Scikit-learn", category: "Core ML/AI", color: "#F7931E" },
            { name: "Deep Learning", category: "Core ML/AI", color: "#9333EA" },
            { name: "Computer Vision", category: "Core ML/AI", color: "#06B6D4" },
            { name: "NLP", category: "Core ML/AI", color: "#22C55E" },
            { name: "Generative AI", category: "Core ML/AI", color: "#9F7AEA" },
            { name: "LangChain", category: "Core ML/AI", color: "#1C3C3C" },
            { name: "Streamlit", category: "Core ML/AI", color: "#FF4B4B" },
            { name: "Hugging Face", category: "Core ML/AI", color: "#FFD21E" },

            // Software Engineering
            { name: "React", category: "Software Engineering", color: "#61DAFB" },
            { name: "TypeScript", category: "Software Engineering", color: "#3178C6" },
            { name: "Node.js", category: "Software Engineering", color: "#339933" },
            { name: "PostgreSQL", category: "Software Engineering", color: "#4169E1" },
            { name: "Git", category: "Software Engineering", color: "#F05032" },

            // Cloud/DevOps
            { name: "Docker", category: "Cloud/DevOps", color: "#2496ED" },
            { name: "AWS", category: "Cloud/DevOps", color: "#FF9900" },
        ];

        for (const skill of skillData) {
            const existing = await db.query.skills.findFirst({
                where: eq(skills.name, skill.name)
            });
            if (!existing) {
                await db.insert(skills).values(skill);
                console.log(`Added skill: ${skill.name}`);
            }
        }

        // 3. Seed Certificates
        console.log("Seeding Certificates...");
        const certData = [
            {
                title: "Machine Learning with Python",
                issuer: "IBM SkillsBuild",
                date: "2025",
                description: "Successfully completed and received a passing grade in Machine Learning with Python (ML0101EN).",
                image: "/assets/ibm_logo.png",
                credentialUrl: "https://courses.skillsbuild.skillsnetwork.site/certificates/b7e655cd0afc424894dc886e403fb5d6"
            },
            {
                title: "Deep Learning Specialization",
                issuer: "Coursera & DeepLearning.AI",
                date: "2024",
                description: "Comprehensive specialization covering neural networks, CNNs, RNNs, and deployment strategies.",
                image: "/assets/generated_images/ai_certification_badge_design.png",
                credentialUrl: ""
            },
            {
                title: "Software Engineering Job Simulation",
                issuer: "JPMorgan Chase & Co.",
                date: "2025",
                description: "Completed practical tasks in software engineering, focusing on setting up a dev environment, fixing broken code, and data visualization.",
                image: "/assets/jpmorgan_logo_2.jpg",
                credentialUrl: "https://drive.google.com/file/d/1iWf5f6gCCn4ztuUH8jkmwSzFfsxAa11f/view?usp=sharing"
            },
            {
                title: "Data Labeling Job Simulation",
                issuer: "Forage",
                date: "2025",
                description: "Completed practical tasks in Batch Labeling & PII Awareness, Review, Quality Control & Iteration.",
                image: "/assets/forage_logo.png",
                credentialUrl: "https://drive.google.com/file/d/16FaBRCMNMLQhprN0B0egIY1IDxQ59wCf/view?usp=sharing"
            },
            {
                title: "AWS Cloud Practitioner Essentials",
                issuer: "AWS Training and Certification",
                date: "2025",
                description: "This course covers the essential building blocks of cloud, AWS global infrastructure, and key services used to design, deploy, and manage modern cloud applications.",
                image: "/assets/aws_logo.png",
                credentialUrl: "https://drive.google.com/file/d/1EdJiTyNmyPzqC518YoQz_6Yh-dPm88He/view?usp=sharing"
            },
            {
                title: "TensorFlow Developer Certificate",
                issuer: "Google",
                date: "2023",
                description: "Professional certification in building and training neural networks using TensorFlow.",
                image: "/assets/generated_images/ai_certification_badge_design.png",
                credentialUrl: ""
            },
            {
                title: "Natural Language Processing",
                issuer: "Hugging Face",
                date: "2023",
                description: "Specialized training in transformer models, BERT, GPT, and state-of-the-art NLP techniques.",
                image: "/assets/generated_images/ml_certification_emblem.png",
                credentialUrl: ""
            },
            {
                title: "AWS Machine Learning Specialty",
                issuer: "Amazon Web Services",
                date: "2024",
                description: "Validated expertise in building, training, tuning, and deploying machine learning models on AWS.",
                image: "/assets/generated_images/ai_certification_badge_design.png",
                credentialUrl: ""
            },
            {
                title: "Prompt Engineering for Developers",
                issuer: "DeepLearning.AI",
                date: "2025",
                description: "Mastered the art of designing robust prompts for Large Language Models (LLMs) to build powerful AI applications.",
                image: "/assets/generated_images/ml_certification_emblem.png",
                credentialUrl: ""
            },
            {
                title: "Generative AI with Large Language Models",
                issuer: "Coursera & AWS",
                date: "2025",
                description: "Deep dive into the transformer architecture and the complete generative AI lifecycle from data gathering to deployment.",
                image: "/assets/generated_images/ai_certification_badge_design.png",
                credentialUrl: ""
            },
        ];

        for (const cert of certData) {
            const existing = await db.query.certificates.findFirst({
                where: eq(certificates.title, cert.title)
            });
            if (!existing) {
                await db.insert(certificates).values(cert);
                console.log(`Added certificate: ${cert.title}`);
            }
        }

        console.log("Seeding completed successfully!");
        process.exit(0);
    } catch (error) {
        console.error("Error seeding database:", error);
        process.exit(1);
    }
}

main();
