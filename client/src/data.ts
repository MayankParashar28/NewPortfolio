import { Github, Linkedin, Mail } from "lucide-react";
import mlDashboardImg from "@assets/generated_images/ml_project_dashboard_mockup.png";
import cvProjectImg from "@assets/generated_images/computer_vision_project_interface.png";
import dlResearchImg from "@assets/generated_images/deep_learning_research_visualization.png";
import myPhoto from "@assets/myphoto.png";
import neuralNetworkImg from "@assets/generated_images/ai_neural_network_visualization.png";

import ibmLogo from "@assets/ibm_logo.png";

import certBadge1 from "@assets/generated_images/ai_certification_badge_design.png";
import certBadge2 from "@assets/generated_images/ml_certification_emblem.png";
import awsLogo from "@assets/aws_logo.png";
import jpmorganLogo from "@assets/jpmorgan_logo.png";
import jpmorganLogo2 from "@assets/jpmorgan_logo_2.jpg";
import forageLogo from "@assets/forage_logo.png";

export const user = {
    name: "Mayank Parashar",
    title: "AI & Machine Learning Student",
    valueProposition: "AI/ML student specializing in GenAI, computer vision, and ML engineering for production-ready systems",
    tagline: "Building the Future with Artificial Intelligence",
    email: "mayankparashar2808@gmail.com",
    resumeUrl: "/MayankResume.pdf",
    socials: {
        github: "https://github.com/MayankParashar28",
        linkedin: "https://www.linkedin.com/in/mayankparashar28/",
        email: "mailto:mayankparashar2808@gmail.com",
    },
    about: {
        title: "Exploring the Possibilities of AI",
        description1: "My journey began with a deep fascination for computer science and the potential of intelligent systems to solve meaningful problems. I effectively transitioned from curious exploration to rigorous study, building a strong academic and practical foundation in Artificial Intelligence.",
        description2: "Currently, I specialize in Generative AI and Computer Vision, focusing on bridging the gap between theoretical models and production-ready applications. I am now seeking internships and full-time opportunities to leverage my expertise in building scalable, high-impact AI solutions.",
        techFocus: "Current focus: LLM agents, RAG, and scalable ML systems on cloud (AWS).",
        image: myPhoto,
        quote: "Artificial intelligence is not a substitute for human intelligence; it is a tool to amplify human creativity and ingenuity.",
        seeking: ["Internships", "Full-time roles in ML Engineer", "AI Engineer", "Computer Vision Engineer"],
        revealImage: neuralNetworkImg,
    },
    projects: [
        {
            title: "Intelligent Video Analysis System",
            description: "A robust AI application built with Python and Streamlit that transforms lengthy digital content into concise summaries. By integrating LangChain and the Groq API, the system processes both YouTube videos and standard web pages to extract key insights in real-time. Summarizes 60-minute videos into 5‑bullet insights in under 10 seconds using Groq.",
            image: mlDashboardImg,
            tags: ["Generative AI", "LangChain", "Groq", "Streamlit", "Content Summarization"],
            category: "AI & Machine Learning",
            links: {
                github: "https://github.com/MayankParashar28/WebTube-Insight",
                demo: "",
            },
        },
        {
            title: "NeuroSearch Agent: AI Agent for Information Retrieval",
            description: "NeuroSearch is an advanced conversational agent,The core intelligence is powered by Llama3 running on Groq’s high-performance inference engine, ensuring near-instantaneous responses.",
            image: neuralNetworkImg,
            tags: ["Generative AI", "Groq", "Llama3", "Streamlit", "Content Summarization", "LangChain"],
            category: "AI & Machine Learning",
            links: {
                github: "https://github.com/MayankParashar28/Open_Search",
                demo: "",
            },
        },
        {
            title: "Intelligent Text Completion",
            description: "Next-Predict is an intelligent text completion engine that brings autocomplete capabilities to the next level. Unlike static dictionary lookups",
            image: dlResearchImg,
            tags: ["NLP", "BERT", "Transformers", "Python", "TextGeneration"],
            category: "AI & Machine Learning",
            links: {
                github: "https://github.com/MayankParashar28/Next-Predict",
                demo: "",
            },
        },
        {
            title: "Face Analysis System",
            description: "A full-stack web application developed with Django and Python that leverages Computer Vision and Deep Learning to analyze human faces. ",
            image: cvProjectImg,
            tags: ["Python", "Django", "Image Processing", "Computer Vision", "Deep Learning", "Machine Learning"],
            category: "AI & Machine Learning",
            links: {
                github: "https://github.com/MayankParashar28/Face_Analysis",
                demo: "",
            },
        },
        {
            title: "RentRipple",
            description: "RentRipple is a web application that helps users find and book affordable rental properties in their area. It is a comprehensive peer-to-peer rental marketplace designed to simulate real-world booking ecosystems.",
            image: mlDashboardImg,
            tags: ["FullStack", "WebDevelopment", "NodeJS", "MVCArchitecture", "MongoDB", "Stripe", "Cloudinary"],
            category: "Full-Stack Development",
            links: {
                github: "https://github.com/MayankParashar28/RentRipple",
                demo: "",
            },
        },
        {
            title: "EaseNavigator",
            description: "EaseNavigator is a smart logistics platform designed to solve range anxiety for Electric Vehicle (EV) drivers. It reduces EV range anxiety by suggesting optimal routes with battery-aware predictions, calculating real-time battery drainage based on specific vehicle efficiency data and route constraints.",
            image: dlResearchImg,
            tags: ["FullStack", "WebDevelopment", "OSRM", "MVCArchitecture", "PredictiveModeling", "Stripe", "Cloudinary"],
            category: "Full-Stack Development",
            links: {
                github: "https://github.com/MayankParashar28/EaseNavigator",
                demo: "",
            },
        },
        {
            title: "BlogiFy: Secure SSR Blogging",
            description: "BlogiFy redefines the writing experience by embedding artificial intelligence directly into the editorial workflow. Unlike static blogging sites, this application functions as an intelligent co-pilot, helping users brainstorm.",
            image: neuralNetworkImg,
            tags: ["FullStack", "WebDevelopment", "BackendEngineering", "MVCArchitecture", "LLMIntegration", "Stripe", "Security"],
            category: "Full-Stack Development",
            links: {
                github: "https://github.com/MayankParashar28/BlogiFy",
                demo: "",
            },
        }
    ],

    certificates: [
        {
            title: "Machine Learning with Python",
            issuer: "IBM SkillsBuild",
            date: "2025",
            description: "Successfully completed and received a passing grade in Machine Learning with Python (ML0101EN).",
            image: ibmLogo,
            credentialUrl: "https://courses.skillsbuild.skillsnetwork.site/certificates/b7e655cd0afc424894dc886e403fb5d6"
        },
        {
            title: "Deep Learning Specialization",
            issuer: "Coursera & DeepLearning.AI",
            date: "2024",
            description: "Comprehensive specialization covering neural networks, CNNs, RNNs, and deployment strategies.",
            image: certBadge1,
            credentialUrl: ""
        },
        {
            title: "Software Engineering Job Simulation",
            issuer: "JPMorgan Chase & Co.",
            date: "2025",
            description: "Completed practical tasks in software engineering, focusing on setting up a dev environment, fixing broken code, and data visualization.",
            image: jpmorganLogo2,
            logoClassName: "scale-150",
            credentialUrl: "https://drive.google.com/file/d/1iWf5f6gCCn4ztuUH8jkmwSzFfsxAa11f/view?usp=sharing"
        },
        {
            title: "Data Labeling Job Simulation",
            issuer: "Forage",
            date: "2025",
            description: "Completed practical tasks in Batch Labeling & PII Awareness, Review, Quality Control & Iteration.",
            image: forageLogo,
            credentialUrl: "https://drive.google.com/file/d/16FaBRCMNMLQhprN0B0egIY1IDxQ59wCf/view?usp=sharing"
        },
        {
            title: "AWS Cloud Practitioner Essentials",
            issuer: "AWS Training and Certification",
            date: "2025",
            description: "This course covers the essential building blocks of cloud, AWS global infrastructure, and key services used to design, deploy, and manage modern cloud applications.",
            image: awsLogo,
            credentialUrl: "https://drive.google.com/file/d/1EdJiTyNmyPzqC518YoQz_6Yh-dPm88He/view?usp=sharing"
        },
        {
            title: "TensorFlow Developer Certificate",
            issuer: "Google",
            date: "2023",
            description: "Professional certification in building and training neural networks using TensorFlow.",
            image: certBadge1,
            credentialUrl: ""
        },
        {
            title: "Natural Language Processing",
            issuer: "Hugging Face",
            date: "2023",
            description: "Specialized training in transformer models, BERT, GPT, and state-of-the-art NLP techniques.",
            image: certBadge2,
            credentialUrl: ""
        },
        {
            title: "AWS Machine Learning Specialty",
            issuer: "Amazon Web Services",
            date: "2024",
            description: "Validated expertise in building, training, tuning, and deploying machine learning models on AWS.",
            image: certBadge1,
            credentialUrl: ""
        },
        


    ],
    contact: [
        {
            icon: Mail,
            label: "Email",
            value: "mayankparashar2808@gmail.com",
            link: "mailto:mayankparashar2808@gmail.com",
        },
        {
            icon: Github,
            label: "GitHub",
            value: "github.com/MayankParashar28",
            link: "https://github.com/MayankParashar28",
        },
        {
            icon: Linkedin,
            label: "LinkedIn",
            value: "linkedin.com/in/mayankparashar28",
            link: "https://www.linkedin.com/in/mayankparashar28/",
        },
    ],
};
