import * as React from "react"
import { cn } from "@/shared/lib/utils"

const TabsContext = React.createContext<{
    value: string
    onValueChange: (value: string) => void
} | null>(null)

interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
    defaultValue: string
    value?: string
    onValueChange?: (value: string) => void
}

export function Tabs({ defaultValue, value, onValueChange, className, children, ...props }: TabsProps) {
    const [stateValue, setStateValue] = React.useState(defaultValue)
    const finalValue = value !== undefined ? value : stateValue
    const finalOnValueChange = onValueChange || setStateValue

    return (
        <TabsContext.Provider value={{ value: finalValue, onValueChange: finalOnValueChange }}>
            <div className={cn("w-full", className)} {...props}>
                {children}
            </div>
        </TabsContext.Provider>
    )
}

export function TabsList({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn(
                "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
                className
            )}
            {...props}
        />
    )
}

interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    value: string
}

export function TabsTrigger({ className, value, ...props }: TabsTriggerProps) {
    const context = React.useContext(TabsContext)
    if (!context) throw new Error("TabsTrigger must be used within Tabs")

    const isActive = context.value === value

    return (
        <button
            type="button"
            onClick={() => context.onValueChange(value)}
            data-state={isActive ? "active" : "inactive"}
            className={cn(
                "inline-flex items-center justify-center whitespace-nowrap rounded-t-md px-4 py-2 text-sm font-medium ring-offset-background transition-[color,background-color,border-color,box-shadow,transform] duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:scale-[0.985] disabled:pointer-events-none disabled:opacity-50 motion-reduce:transition-none motion-reduce:active:scale-100",
                "border-b-2 border-transparent text-muted-foreground hover:bg-foreground/[0.03] hover:text-foreground data-[state=active]:border-luigi-gold data-[state=active]:bg-foreground/[0.04] data-[state=active]:font-semibold data-[state=active]:text-foreground data-[state=active]:shadow-[inset_0_-1px_0_rgba(234,179,8,0.25)]",
                className
            )}
            {...props}
        />
    )
}

interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
    value: string
}

export function TabsContent({ className, value, ...props }: TabsContentProps) {
    const context = React.useContext(TabsContext)
    if (!context) throw new Error("TabsContent must be used within Tabs")

    if (context.value !== value) return null

    return (
        <div
            className={cn(
                "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                className
            )}
            {...props}
        />
    )
}
