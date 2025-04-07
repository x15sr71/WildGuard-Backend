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
    stream.on("error", reject);

    stream.on("finish", async () => {
      try {
        // Generate a V4 signed URL valid for 7 days
        const [url] = await file.getSignedUrl({
          version: "v4",
          action: "read",
          expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days in ms
        });

        resolve(url);
      } catch (error) {
        reject(error);
      }
    });

    stream.end(buffer);
  });
};
