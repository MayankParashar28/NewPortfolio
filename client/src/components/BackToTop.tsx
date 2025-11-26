import { ChevronUp } from "lucide-react";
import { useState, useEffect } from "react";

export default function BackToTop() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            // Show button when page is scrolled down 300px
            if (window.scrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener("scroll", toggleVisibility);

        return () => {
            window.removeEventListener("scroll", toggleVisibility);
        };
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    if (!isVisible) {
        return null;
    }

    return (
        <button
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 bg-black/80 backdrop-blur-sm text-white p-3 rounded-full shadow-lg hover:scale-110 hover:bg-black transition-all z-50"
            aria-label="Back to top"
            data-testid="back-to-top-button"
        >
            <ChevronUp className="w-6 h-6" />
        </button>
    );
}
