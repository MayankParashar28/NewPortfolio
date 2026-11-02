
import { apiRequest } from "@/lib/queryClient";

/**
 * Compresses an image file to a lower quality JPEG to reduce size.
 * @param file The file to compress.
 * @param maxWidth The maximum width of the output image.
 * @param quality The quality of the JPEG (0 to 1).
 * @returns A promise that resolves to the base64 string of the compressed image.
 */
export async function compressImage(file: File, maxWidth = 800, quality = 0.6): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                if (width > maxWidth) {
                    height = Math.floor(height * (maxWidth / width));
                    width = maxWidth;
                }

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    reject(new Error('Failed to get canvas context'));
                    return;
                }

                ctx.drawImage(img, 0, 0, width, height);
                // Compress to JPEG
                const dataUrl = canvas.toDataURL('image/jpeg', quality);
                resolve(dataUrl);
            };
            img.onerror = (error) => reject(error);
        };
        reader.onerror = (error) => reject(error);
    });
}

/**
 * Compresses an image and uploads it to blob storage, returning its URL.
 *
 * Prefer this over compressImage for anything that gets saved: a data URL
 * stored in the database is sent to every visitor inside the API response,
 * cannot be cached separately by the browser, and cannot be served by a CDN.
 */
export async function compressAndUpload(file: File, maxWidth = 1200, quality = 0.82): Promise<string> {
    const dataUrl = await compressImage(file, maxWidth, quality);
    const res = await apiRequest("POST", "/api/upload", { dataUrl, filename: file.name });
    const { url } = (await res.json()) as { url: string };
    return url;
}
