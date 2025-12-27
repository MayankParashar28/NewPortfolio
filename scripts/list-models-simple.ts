
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    console.log("No API Key in env process");
    process.exit(1);
}

console.log("Fetching models...");
fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`)
    .then(res => res.json())
    .then(data => {
        if (data.models) {
            console.log("SUCCESS. Found models:");
            data.models.forEach(m => console.log(m.name));
        } else {
            console.log("FAILED or NO MODELS:", data);
        }
    })
    .catch(err => console.error("FETCH ERROR:", err));
