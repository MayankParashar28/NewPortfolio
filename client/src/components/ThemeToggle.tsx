import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <button
      onClick={toggleTheme}
      className="relative w-16 h-8 rounded-full bg-muted border border-border overflow-hidden group"
      style={{
        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2), 0 2px 4px rgba(0,0,0,0.1)',
        transition: 'all 0.3s ease'
      }}
      data-testid="button-theme-toggle"
      aria-label="Toggle theme"
    >
      <div
        className="absolute top-1 left-1 w-6 h-6 rounded-full bg-foreground transition-all duration-300 ease-in-out flex items-center justify-center"
        style={{
          transform: theme === "dark" ? "translateX(32px)" : "translateX(0)",
          boxShadow: '0 2px 8px rgba(0,0,0,0.3), inset 0 -2px 4px rgba(0,0,0,0.2), inset 0 2px 4px rgba(255,255,255,0.1)',
        }}
      >
        {theme === "light" ? (
          <Sun className="w-4 h-4 text-background" />
        ) : (
          <Moon className="w-4 h-4 text-background" />
        )}
      </div>
      
      <div className="absolute inset-0 flex items-center justify-between px-2 pointer-events-none">
        <Sun className={`w-3 h-3 transition-opacity duration-300 ${theme === "light" ? "opacity-0" : "opacity-40"}`} />
        <Moon className={`w-3 h-3 transition-opacity duration-300 ${theme === "dark" ? "opacity-0" : "opacity-40"}`} />
      </div>
    </button>
  );
}
