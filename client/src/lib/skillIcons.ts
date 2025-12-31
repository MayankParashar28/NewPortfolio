import {
    SiPython, SiTensorflow, SiPytorch, SiScikitlearn, SiJupyter, SiGit, SiReact,
    SiTypescript, SiNodedotjs, SiDocker, SiMongodb, SiPostgresql, SiAmazon,
    SiStreamlit, SiHuggingface, SiJavascript, SiHtml5, SiCss3, SiNextdotjs,
    SiTailwindcss, SiFirebase, SiGraphql, SiMysql, SiRedis, SiLinux,
    SiKubernetes, SiGo, SiRust, SiCplusplus, SiAngular, SiVuedotjs, SiSvelte,
    SiSpring, SiDjango, SiFlask, SiFastapi, SiExpress, SiGooglecloud,
    SiLangchain, SiOpenai, SiKeras, SiOpencv
} from "react-icons/si";
import {
    Brain, Database, Code2, Terminal, Cpu, Globe, Sparkles, Workflow,
    Loader2, Server, Cloud, Layout, Eye, MessageSquareText, Bot
} from "lucide-react";

// Comprehensive icon map
export const iconMap: Record<string, any> = {
    // Manual text mapping
    "Python": SiPython,
    "python": SiPython,
    "TensorFlow": SiTensorflow,
    "Deep Learning": Brain,
    "React": SiReact,
    "react": SiReact,
    "React.js": SiReact,
    "Vue": SiVuedotjs,
    "vue": SiVuedotjs,
    "Angular": SiAngular,
    "angular": SiAngular,
    "Node.js": SiNodedotjs,
    "Node": SiNodedotjs,
    "node": SiNodedotjs,
    "TypeScript": SiTypescript,
    "typescript": SiTypescript,
    "JavaScript": SiJavascript,
    "javascript": SiJavascript,
    "Java": SiSpring,
    "java": SiSpring,
    "C++": SiCplusplus,
    "c++": SiCplusplus,
    "Go": SiGo,
    "go": SiGo,
    "Rust": SiRust,
    "rust": SiRust,
    "Docker": SiDocker,
    "docker": SiDocker,
    "AWS": SiAmazon,
    "aws": SiAmazon,
    "Git": SiGit,
    "git": SiGit,
    "PostgreSQL": SiPostgresql,
    "MongoDB": SiMongodb,
    "Tailwind": SiTailwindcss,
    "CSS": SiCss3,
    "HTML": SiHtml5,
    "Next.js": SiNextdotjs,
    "next.js": SiNextdotjs,

    // AI / ML Specific
    "scikit-learn": SiScikitlearn,
    "sciketlearn": SiScikitlearn, // typo handling
    "sklearn": SiScikitlearn,
    "Computer Vision": SiOpencv, // Prefer OpenCV icon or generic
    "computer vision": SiOpencv,
    "compuer vision": SiOpencv, // typo
    "cv": SiOpencv,
    "opencv": SiOpencv,
    "NLP": MessageSquareText,
    "nlp": MessageSquareText,
    "Natural Language Processing": MessageSquareText,
    "Gen AI": Sparkles,
    "gen ai": Sparkles,
    "Generative AI": Sparkles,
    "LLM": Bot,
    "llm": Bot,
    "LangChain": SiLangchain,
    "langchain": SiLangchain,
    "Streamlit": SiStreamlit,
    "streamlit": SiStreamlit,
    "OpenAI": SiOpenai,
    "openai": SiOpenai,
    "Keras": SiKeras,
    "keras": SiKeras,
    "Pytorch": SiPytorch,
    "pytorch": SiPytorch,

    // Direct icon name mapping
    "SiPython": SiPython,
    "SiTensorflow": SiTensorflow,
    "SiPytorch": SiPytorch,
    "SiScikitlearn": SiScikitlearn,
    "SiJupyter": SiJupyter,
    "SiGit": SiGit,
    "SiReact": SiReact,
    "SiTypescript": SiTypescript,
    "SiNodedotjs": SiNodedotjs,
    "SiDocker": SiDocker,
    "SiMongodb": SiMongodb,
    "SiPostgresql": SiPostgresql,
    "SiAmazon": SiAmazon,
    "SiStreamlit": SiStreamlit,
    "SiHuggingface": SiHuggingface,
    "SiJavascript": SiJavascript,
    "SiHtml5": SiHtml5,
    "SiCss3": SiHtml5, // Fallback or distinct
    "SiNextdotjs": SiNextdotjs,
    "SiTailwindcss": SiTailwindcss,
    "SiFirebase": SiFirebase,
    "SiGraphql": SiGraphql,
    "SiMysql": SiMysql,
    "SiRedis": SiRedis,
    "SiLinux": SiLinux,
    "SiKubernetes": SiKubernetes,
    "SiGo": SiGo,
    "SiRust": SiRust,
    "SiCplusplus": SiCplusplus,
    "SiAngular": SiAngular,
    "SiVue": SiVuedotjs,
    "SiSvelte": SiSvelte,
    "SiSpring": SiSpring,
    "SiDjango": SiDjango,
    "SiFlask": SiFlask,
    "SiFastapi": SiFastapi,
    "SiExpress": SiExpress,
    "SiGooglecloud": SiGooglecloud,
    "SiLangchain": SiLangchain,
    "SiOpenai": SiOpenai,
    "SiKeras": SiKeras,
    "SiOpencv": SiOpencv,

    // Generic
    "default": Code2,
    "server": Server,
    "database": Database,
    "cloud": Cloud,
    "layout": Layout
};

export const getIcon = (skill: { icon?: string | null; name: string }) => {
    // Try to match by DB icon field first, BUT ignore 'default' placeholder
    if (skill.icon && skill.icon !== "default" && iconMap[skill.icon]) {
        return iconMap[skill.icon];
    }

    // Normalization for robust name matching
    // 1. Exact match
    if (iconMap[skill.name]) return iconMap[skill.name];

    // 2. Lowercase match
    const lower = skill.name.toLowerCase();
    if (iconMap[lower]) return iconMap[lower];

    // 3. Trimmed match
    const trimmed = lower.trim();
    if (iconMap[trimmed]) return iconMap[trimmed];

    return Code2; // Default icon
};
