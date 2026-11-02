// One-off migration: move base64 data URLs out of the database and into blob
// storage, replacing each with its CDN URL.
//
//   npx tsx scripts/migrate-images-to-blob.ts           # dry run, writes nothing
//   npx tsx scripts/migrate-images-to-blob.ts --apply   # performs the migration
//
// Needs DATABASE_URL and BLOB_READ_WRITE_TOKEN in .env.

import "dotenv/config";
import { eq } from "drizzle-orm";
import { db } from "../server/db";
import { projects, certificates, internships, profile } from "../shared/schema";
import {
    putBlob,
    parseDataUrl,
    extensionFor,
    safeName,
    isDataUrl,
    isBlobConfigured,
} from "../server/blob";

const APPLY = process.argv.includes("--apply");

const KB = (n: number) => `${Math.round(n / 1024)} KB`;

type Target = {
    label: string;
    table: any;
    column: string;
    /** Names the stored object; keeps blob paths readable. */
    nameFrom: (row: any) => string;
};

const TARGETS: Target[] = [
    { label: "projects.image", table: projects, column: "image", nameFrom: (r) => r.title },
    { label: "certificates.image", table: certificates, column: "image", nameFrom: (r) => r.title },
    { label: "internships.image", table: internships, column: "image", nameFrom: (r) => r.role },
    { label: "profile.resumeUrl", table: profile, column: "resumeUrl", nameFrom: (r) => `${r.name}-resume` },
];

async function main() {
    if (!isBlobConfigured()) {
        console.error(
            "BLOB_READ_WRITE_TOKEN is not set.\n" +
            "Create a Blob store in the Vercel dashboard, connect it to this project,\n" +
            "then run: npx vercel env pull .env",
        );
        process.exit(1);
    }

    console.log(APPLY ? "Migrating (writing changes)\n" : "Dry run — nothing will be written\n");

    let migrated = 0;
    let bytesFreed = 0;

    for (const target of TARGETS) {
        const rows = await db.select().from(target.table);

        for (const row of rows) {
            const value = row[target.column];
            if (!isDataUrl(value)) continue;

            const parsed = parseDataUrl(value);
            if (!parsed) {
                console.warn(`  ! ${target.label} id=${row.id}: value starts with data: but did not parse`);
                continue;
            }

            const name = safeName(String(target.nameFrom(row) ?? "upload"));
            const path = `portfolio/${name}.${extensionFor(parsed.contentType)}`;

            console.log(
                `  ${target.label} id=${row.id}  ${parsed.contentType}  ` +
                `${KB(value.length)} inline -> ${KB(parsed.bytes.length)} stored  (${path})`,
            );

            bytesFreed += value.length;
            migrated += 1;

            if (!APPLY) continue;

            const url = await putBlob(path, parsed.bytes, parsed.contentType);
            await db
                .update(target.table)
                .set({ [target.column]: url })
                .where(eq(target.table.id, row.id));
            console.log(`      -> ${url}`);
        }
    }

    if (migrated === 0) {
        console.log("\nNothing to migrate: no data URLs found.");
    } else {
        console.log(
            `\n${migrated} value(s) ${APPLY ? "migrated" : "would be migrated"}; ` +
            `${KB(bytesFreed)} removed from API responses.`,
        );
        if (!APPLY) console.log("Re-run with --apply to perform it.");
    }

    process.exit(0);
}

main().catch((error) => {
    console.error("Migration failed:", error);
    process.exit(1);
});
