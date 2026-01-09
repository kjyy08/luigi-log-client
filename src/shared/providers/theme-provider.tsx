import { createContext, useContext, useEffect, useState } from "react"

type Theme = "dark" | "light" | "system"

type ThemeProviderProps = {
    children: React.ReactNode
    defaultTheme?: Theme
    storageKey?: string
}

type ThemeProviderState = {
    theme: Theme
    resolvedTheme: "dark" | "light"
    setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
    theme: "system",
    resolvedTheme: "light",
    setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
    children,
    defaultTheme = "system",
    storageKey = "vite-ui-theme",
}: ThemeProviderProps) {
    const [theme, setTheme] = useState<Theme>(
        () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
    )

    const [resolvedTheme, setResolvedTheme] = useState<"dark" | "light">(() => {
        const currentTheme = (localStorage.getItem(storageKey) as Theme) || defaultTheme;
        if (currentTheme === "system") {
            return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
        }
        return currentTheme === "dark" ? "dark" : "light";
    });

    useEffect(() => {
        const root = window.document.documentElement
        root.classList.remove("light", "dark")

        if (theme === "system") {
            const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")

            const applySystemTheme = () => {
                const systemTheme = mediaQuery.matches ? "dark" : "light"
                root.classList.add(systemTheme)
                setResolvedTheme(systemTheme)
            }

            applySystemTheme()

            mediaQuery.addEventListener("change", applySystemTheme)
            return () => mediaQuery.removeEventListener("change", applySystemTheme)
        }

        root.classList.add(theme)
        setResolvedTheme(theme === "dark" ? "dark" : "light")
    }, [theme])

    const value = {
        theme,
        resolvedTheme,
        setTheme: (theme: Theme) => {
            localStorage.setItem(storageKey, theme)
            setTheme(theme)
        },
    }

    return (
        <ThemeProviderContext.Provider value={value}>
            {children}
        </ThemeProviderContext.Provider>
    )
}

export const useTheme = () => {
    const context = useContext(ThemeProviderContext)

    if (context === undefined)
        throw new Error("useTheme must be used within a ThemeProvider")

    return context
}
