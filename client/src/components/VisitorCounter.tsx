import { Eye } from "lucide-react";
import { useEffect, useState } from "react";

export default function VisitorCounter() {
    const [visits, setVisits] = useState(0);

    useEffect(() => {
        // Simple localStorage-based counter for demo
        const currentCount = parseInt(localStorage.getItem("visitCount") || "0");
        const newCount = currentCount + 1;
        localStorage.setItem("visitCount", newCount.toString());
        setVisits(newCount);
    }, []);

    return (
        <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-primary/10 border border-primary/20">
            <Eye className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-foreground">
                {visits.toLocaleString()} {visits === 1 ? "view" : "views"}
            </span>
        </div>
    );
}
