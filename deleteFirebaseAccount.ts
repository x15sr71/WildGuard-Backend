// deleteUserScript.js
import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || '{}')),
});

const firebaseUid = "NziYpL6wDYgvhso16xvo7jrxrVB2";

admin
  .auth()
  .deleteUser(firebaseUid)
  .then(() => {
    console.log(`Successfully deleted user: ${firebaseUid}`);
  })
  .catch((error) => {
    console.error("Error deleting user:", error);
  });
