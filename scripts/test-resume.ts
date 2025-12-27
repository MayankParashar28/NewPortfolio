
import fs from 'fs';
import fetch from 'node-fetch';
import path from 'path';

async function main() {
    try {
        // Find a PDF
        const possiblePaths = [
            path.join(process.cwd(), 'client', 'public', 'MayankResume.pdf'),
            path.join(process.cwd(), 'MayankResume.pdf')
        ];
        let pdfPath = possiblePaths.find(p => fs.existsSync(p));

        if (!pdfPath) {
            console.log("No PDF found for testing. Please ensure MayankResume.pdf exists in client/public.");
            return;
        }

        console.log(`Testing with PDF: ${pdfPath}`);
        const pdfBuffer = fs.readFileSync(pdfPath);
        const base64 = "data:application/pdf;base64," + pdfBuffer.toString('base64');

        const res = await fetch('http://localhost:5000/api/analyze-resume', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ resumeBase64: base64 })
        });

        // Check for JSON or Text
        const contentType = res.headers.get('content-type');
        let body;
        if (contentType?.includes('application/json')) {
            body = await res.json();
        } else {
            body = await res.text();
        }

        console.log(`Status: ${res.status}`);
        console.log(`Body:`, body);

    } catch (err) {
        console.error("Test failed:", err);
    }
}

main();
