import type { CSSProperties } from "react";

type CodeBlockTheme = "dark" | "light" | undefined;

interface CodeBlockSyntaxStyles {
    customStyle: CSSProperties;
    codeTagProps: {
        style: CSSProperties;
    };
    lineProps: {
        style: CSSProperties;
    };
}

const monospaceFont = "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace";

export const getCodeBlockSyntaxStyles = (theme: CodeBlockTheme): CodeBlockSyntaxStyles => {
    const isDark = theme === "dark";

    return {
        customStyle: {
            margin: 0,
            padding: "1.25rem",
            background: "transparent",
            color: isDark ? "rgba(255, 255, 255, 0.84)" : "rgba(15, 23, 42, 0.86)",
            fontSize: "0.92rem",
            lineHeight: 1.7,
            overflowX: "auto",
        },
        codeTagProps: {
            style: {
                background: "transparent",
                fontFamily: monospaceFont,
                lineHeight: "inherit",
            },
        },
        lineProps: {
            style: {
                background: "transparent",
                display: "block",
            },
        },
    };
};
