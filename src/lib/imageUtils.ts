/**
 * Utility function to get the full image URL
 * If the image_url is a relative path (starts with /), prepend the API base URL
 * Otherwise, return as-is (for external URLs)
 */
export function getImageUrl(imageUrl?: string | null): string | undefined {
    if (!imageUrl) return undefined;

    // If it's already a full URL (http:// or https://), return as-is
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
        return imageUrl;
    }

    // If it's a relative path (starts with /), prepend the API base URL
    if (imageUrl.startsWith('/')) {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        return `${API_BASE_URL}${imageUrl}`;
    }

    // Otherwise, return as-is
    return imageUrl;
}

