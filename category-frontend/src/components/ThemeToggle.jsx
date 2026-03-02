import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

/**
 * ThemeToggle — reads/writes localStorage "theme" preference,
 * sets document.documentElement.dataset.theme.
 */
export default function ThemeToggle() {
    const [dark, setDark] = useState(() => {
        return localStorage.getItem("theme") === "dark";
    });

    useEffect(() => {
        const theme = dark ? "dark" : "light";
        document.documentElement.dataset.theme = theme;
        localStorage.setItem("theme", theme);
    }, [dark]);

    return (
        <button
            onClick={() => setDark((d) => !d)}
            aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
            className="p-2 rounded-lg border border-[var(--border-soft)] hover:border-[var(--border-hover)] 
                       bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]
                       transition-colors duration-150"
        >
            {dark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
    );
}
