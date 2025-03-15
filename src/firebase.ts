import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

// Prevent duplicate initialization
if (!admin.apps.length) {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    try {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    } catch (error) {
      console.error("Error parsing FIREBASE_SERVICE_ACCOUNT:", error);
      process.exit(1);
    }
  } else {
    console.error("❌ FIREBASE_SERVICE_ACCOUNT is not defined in .env");
    process.exit(1);
  }
}

export default admin;
