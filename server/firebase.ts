import admin from "firebase-admin";

// Parse service account safely
let serviceAccount;
try {
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    }
} catch (error) {
    console.warn("Incomplete or invalid FIREBASE_SERVICE_ACCOUNT environment variable. Firebase features will be disabled.");
}

// Initialize only if we have a valid service account
if (serviceAccount) {
    try {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
        });
        console.log("Firebase Admin initialized successfully.");
    } catch (error) {
        console.error("Failed to initialize Firebase Admin:", error);
    }
} else {
    console.warn("FIREBASE_SERVICE_ACCOUNT not set. Firebase auth features are disabled.");
}

export async function verifyIdToken(token: string) {
    // If Firebase isn't initialized, we can't verify tokens
    if (admin.apps.length === 0) {
        console.warn("Attempted to verify Firebase token but Firebase is not initialized.");
        return null;
    }

    try {
        const auth = admin.auth();
        const decodedToken = await auth.verifyIdToken(token);
        return decodedToken;
    } catch (error) {
        console.error("Error verifying Firebase token:", error);
        return null;
    }
}
