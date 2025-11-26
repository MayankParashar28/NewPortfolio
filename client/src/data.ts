import { Github, Linkedin, Mail } from "lucide-react";
import mlDashboardImg from "@assets/generated_images/ml_project_dashboard_mockup.png";
import cvProjectImg from "@assets/generated_images/computer_vision_project_interface.png";
import dlResearchImg from "@assets/generated_images/deep_learning_research_visualization.png";
import myPhoto from "@assets/myphoto.png";
import neuralNetworkImg from "@assets/generated_images/ai_neural_network_visualization.png";

import certBadge1 from "@assets/generated_images/ai_certification_badge_design.png";
import certBadge2 from "@assets/generated_images/ml_certification_emblem.png";

export const user = {
    name: "Mayank Parashar",
    title: "AI & Machine Learning Student",
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
        description1: "I'm a dedicated AI and Machine Learning student with a strong foundation in computer science and a burning curiosity for intelligent systems. My journey in AI has been driven by the desire to create technology that can learn, adapt, and solve meaningful problems.",
        description2: "From developing neural networks to implementing computer vision solutions, I'm constantly pushing the boundaries of what's possible with machine learning. I believe in the power of AI to transform industries and improve lives, and I'm committed to being part of that transformation.",
        image: myPhoto,
    },
    projects: [
        {
            title: "Face Analysis System",
            description: "A full-stack web application developed with Django and Python that leverages Computer Vision and Deep Learning to analyze human faces. ",
            image: mlDashboardImg,
            tags: ["Python", "Django", "Image Processing", "Computer Vision", "Deep Learning", "Machine Learning"],
            links: {
                github: "https://github.com/MayankParashar28/Face_Analysis",
                demo: "#",
            },
        },
        {
            title: "Intelligent Video Analysis System",
            description: "A robust AI application built with Python and Streamlit that transforms lengthy digital content into concise summaries. By integrating LangChain and the Groq API, the system processes both YouTube videos and standard web pages to extract key insights in real-time.",
            image: cvProjectImg,
            tags: ["Generative AI", "LangChain", "Groq", "Streamlit", "Content Summarization"],
            links: {
                github: "https://github.com/MayankParashar28/WebTube-Insight",
                demo: "#",
            },
        },
        {
            title: "Intelligent Text Completion",
            description: "Next-Predict is an intelligent text completion engine that brings autocomplete capabilities to the next level. Unlike static dictionary lookups",
            image: dlResearchImg,
            tags: ["NLP", "BERT", "Transformers", "Python", "TextGeneration"],
            links: {
                github: "https://github.com/MayankParashar28/Next-Predict",
                demo: "#",
            },
        },
        {
            title: "NeuroSearch Agent: AI Agent for Information Retrieval",
            description: "NeuroSearch is an advanced conversational agent,The core intelligence is powered by Llama3 running on Groq’s high-performance inference engine, ensuring near-instantaneous responses.",
            image: neuralNetworkImg,
            tags: ["Generative AI", "Groq", "Llama3", "Streamlit", "Content Summarization", "LangChain"],
            links: {
                github: "https://github.com/MayankParashar28/Open_Search",
                demo: "#",
            },
        },
        {
            title: "RentRipple",
            description: "RentRipple is a web application that helps users find and book affordable rental properties in their area. It is a comprehensive peer-to-peer rental marketplace designed to simulate real-world booking ecosystems.",
            image: mlDashboardImg,
            tags: ["FullStack", "WebDevelopment", "NodeJS", "MVCArchitecture", "MongoDB", "Stripe", "Cloudinary"],
            links: {
                github: "https://github.com/MayankParashar28/RentRipple",
                demo: "#",
            },

        }, {
            title: "EaseNavigator",
            description: "EaseNavigator is a smart logistics platform designed to solve range anxiety for Electric Vehicle (EV) drivers. It uses this system integrates a predictive energy model that calculates real-time battery drainage based on specific vehicle efficiency data, distance, and route constraints",
            image: mlDashboardImg,
            tags: ["FullStack", "WebDevelopment", "OSRM", "MVCArchitecture", "PredictiveModeling", "Stripe", "Cloudinary"],
            links: {
                github: "https://github.com/MayankParashar28/EaseNavigator",
                demo: "#",
            },
        }, {
            title: "BlogiFy: Secure SSR Blogging",
            description: "BlogiFy redefines the writing experience by embedding artificial intelligence directly into the editorial workflow. Unlike static blogging sites, this application functions as an intelligent co-pilot, helping users brainstorm.",
            image: mlDashboardImg,
            tags: ["FullStack", "WebDevelopment", "BackendEngineering", "MVCArchitecture", "LLMIntegration", "Stripe", "Security"],
            links: {
                github: "https://github.com/MayankParashar28/BlogiFy",
                demo: "#",
            },
        }
    ],

    certificates: [
        {
            title: "Deep Learning Specialization",
            issuer: "Coursera & DeepLearning.AI",
            date: "2024",
            description: "Comprehensive specialization covering neural networks, CNNs, RNNs, and deployment strategies.",
            image: certBadge1,
            credentialUrl: "#"
        },
        {
            title: "Machine Learning Engineering",
            issuer: "Stanford Online",
            date: "2024",
            description: "Advanced course on production ML systems, MLOps, and scalable AI infrastructure.",
            image: certBadge2,
            credentialUrl: "#"
        },
        {
            title: "TensorFlow Developer Certificate",
            issuer: "Google",
            date: "2023",
            description: "Professional certification in building and training neural networks using TensorFlow.",
            image: certBadge1,
            credentialUrl: "#"
        },
        {
            title: "Natural Language Processing",
            issuer: "Hugging Face",
            date: "2023",
            description: "Specialized training in transformer models, BERT, GPT, and state-of-the-art NLP techniques.",
            image: certBadge2,
            credentialUrl: "#"
        },
        {
            title: "AWS Machine Learning Specialty",
            issuer: "Amazon Web Services",
            date: "2024",
            description: "Validated expertise in building, training, tuning, and deploying machine learning models on AWS.",
            image: certBadge1,
            credentialUrl: "#"
        },
        {
            title: "Microsoft Azure AI Engineer",
            issuer: "Microsoft",
            date: "2024",
            description: "Certification for designing and implementing AI solutions using Azure Cognitive Services and Azure Machine Learning.",
            image: certBadge2,
            credentialUrl: "#"
        }
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
