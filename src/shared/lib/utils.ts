import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";


export const cn = (...inputs: ClassValue[]) => {
    return twMerge(clsx(inputs));
}

/**
 * Validates and formats a slug according to backend rules:
 * - Allowed: Korean (가-힣), English (a-zA-Z), Numbers (0-9), Brackets ([])
 * - Replaces invalid chars with hyphens
 * - No start/end hyphens, no consecutive hyphens
 * - Max 500 chars
 */
export const generateSlug = (input: string): string => {
    let slug = input.trim();

    // 1. Replace invalid characters with hyphens
    // Allowed: a-z, A-Z, 0-9, 가-힣
    slug = slug.replace(/[^a-zA-Z0-9가-힣]+/g, "-");

    // 2. Remove leading/trailing hyphens (backend rule: cannot start/end with hyphen)
    slug = slug.replace(/^-+|-+$/g, "");

    // 3. Ensure no consecutive hyphens (already handled by + in reg step 1, but safety check)
    // Actually step 1 replaces 'space' with '-', so 'a  b' -> 'a--b'. We need to collapse them.
    slug = slug.replace(/-+/g, "-");

    // 4. Max length 500
    if (slug.length > 500) {
        slug = slug.substring(0, 500);
        // After truncation, it might end with a hyphen again
        slug = slug.replace(/-+$/, "");
    }

    return slug;
}

