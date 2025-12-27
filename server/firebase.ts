import admin from "firebase-admin";

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT
    ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
    : undefined;

if (serviceAccount) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
} else {
    console.warn("FIREBASE_SERVICE_ACCOUNT not set. Phone auth verification will fail.");
}

export const auth = admin.auth();

export async function verifyIdToken(token: string) {
    try {
        const decodedToken = await auth.verifyIdToken(token);
        return decodedToken;
    } catch (error) {
        console.error("Error verifying Firebase token:", error);
        return null;
    }
}
