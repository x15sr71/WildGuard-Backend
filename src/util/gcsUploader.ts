// gcsUploader.ts
import { Storage } from "@google-cloud/storage";

const storage = new Storage(); // Uses Cloud Run's service account
const bucket = storage.bucket(process.env.GCS_BUCKET_NAME!);

export const uploadToGCS = async (
  buffer: Buffer,
  mimetype: string,
  filename: string
): Promise<string> => {
  const file = bucket.file(filename);

  const stream = file.createWriteStream({
    metadata: {
      contentType: mimetype,
    },
    resumable: false,
  });

  return new Promise((resolve, reject) => {
    stream.on("error", (err) => {
      console.error("❌ GCS Upload Error:", err); // ← ADD THIS
      reject(err);
    });

    stream.on("finish", async () => {
      try {
        const [url] = await file.getSignedUrl({
          version: "v4",
          action: "read",
          expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        });

        resolve(url);
      } catch (error) {
        console.error("❌ Failed to generate signed URL:", error); // ← ADD THIS
        reject(error);
      }
    });

    stream.end(buffer);
  });
};
