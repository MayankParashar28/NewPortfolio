// Minimal Vercel Blob client.
//
// This talks to the Blob REST API with fetch instead of using @vercel/blob.
// The SDK is the supported path and is a thin wrapper over exactly these
// calls; swap to it when convenient. The only thing to watch is the
// x-api-version header below, which the SDK normally keeps in step.

const BLOB_API = "https://blob.vercel-storage.com";
const BLOB_API_VERSION = "7";

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

export function isBlobConfigured() {
    return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

export type ParsedDataUrl = { contentType: string; bytes: Buffer };

/** Splits a base64 data URL into its media type and decoded bytes. */
export function parseDataUrl(value: string): ParsedDataUrl | null {
    const match = /^data:([a-z0-9][a-z0-9!#$&^_.+-]*\/[a-z0-9!#$&^_.+-]+);base64,(.+)$/is.exec(
        value.trim(),
    );
    if (!match) return null;
    return { contentType: match[1].toLowerCase(), bytes: Buffer.from(match[2], "base64") };
}

export function isDataUrl(value: unknown): value is string {
    return typeof value === "string" && value.startsWith("data:");
}

/** Uploads bytes and returns the public, immutable URL. */
export async function putBlob(
    pathname: string,
    bytes: Buffer,
    contentType: string,
): Promise<string> {
    const token = process.env.BLOB_READ_WRITE_TOKEN;
    if (!token) {
        throw new Error(
            "BLOB_READ_WRITE_TOKEN is not set. Create a Blob store in the Vercel dashboard and connect it to this project.",
        );
    }
    if (bytes.length > MAX_UPLOAD_BYTES) {
        throw new Error(`File is ${Math.round(bytes.length / 1024)} KB; the limit is 5 MB.`);
    }

    const res = await fetch(`${BLOB_API}/${encodeURI(pathname)}`, {
        method: "PUT",
        headers: {
            authorization: `Bearer ${token}`,
            "x-api-version": BLOB_API_VERSION,
            "x-content-type": contentType,
            // Blob URLs are content-addressed by this suffix, so they can be
            // cached forever without risking a stale image after a re-upload.
            "x-add-random-suffix": "1",
            "x-cache-control-max-age": "31536000",
        },
        body: new Uint8Array(bytes),
    });

    if (!res.ok) {
        throw new Error(`Blob upload failed (${res.status}): ${await res.text()}`);
    }

    const body = (await res.json()) as { url?: string };
    if (!body.url) throw new Error("Blob upload returned no URL");
    return body.url;
}

const EXTENSIONS: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
    "image/avif": "avif",
    "image/svg+xml": "svg",
    "application/pdf": "pdf",
};

export function extensionFor(contentType: string) {
    return EXTENSIONS[contentType] ?? "bin";
}

/** Strips anything that does not belong in a URL path segment. */
export function safeName(name: string, fallback = "upload") {
    const base = name.replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9._-]+/g, "-");
    const trimmed = base.replace(/^-+|-+$/g, "").slice(0, 60);
    return trimmed || fallback;
}
