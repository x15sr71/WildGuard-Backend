import express from "express";
import prisma from "../../prisma/prisma";
import { Storage } from "@google-cloud/storage";
import { URL } from "url";

const router = express.Router();
const storage = new Storage();
const bucket = storage.bucket(process.env.GCS_BUCKET_NAME!);

// Check if signed URL is expired with improved parameter checking
const isSignedUrlExpired = (urlString: string): boolean => {
  try {
    const url = new URL(urlString);

    // Check for both lowercase and uppercase Expires parameters (GCS can vary)
    const expiresParam =
      url.searchParams.get("Expires") ||
      url.searchParams.get("expires") ||
      url.searchParams.get("X-Goog-Expires") ||
      url.searchParams.get("x-goog-expires");

    if (!expiresParam) {
      console.log(`No expires parameter found in URL: ${urlString}`);
      return true;
    }

    const expiresAt = parseInt(expiresParam) * 1000;
    const isExpired = Date.now() > expiresAt;

    // Debug logging
    console.log(`URL expiration check: ${urlString}`);
    console.log(`- Expires timestamp: ${expiresAt}`);
    console.log(`- Current time: ${Date.now()}`);
    console.log(`- Is expired: ${isExpired}`);

    return isExpired;
  } catch (error) {
    console.error(`Error checking URL expiration: ${error}`);
    return true;
  }
};

// Improved extraction of file path from URL
const extractFilePathFromSignedUrl = (urlString: string): string => {
  try {
    const url = new URL(urlString);
    const pathname = decodeURIComponent(url.pathname);

    const bucketName = process.env.GCS_BUCKET_NAME!;
    let filePath = pathname;

    // Handle various URL formats
    if (pathname.startsWith(`/${bucketName}/`)) {
      filePath = pathname.replace(`/${bucketName}/`, "");
    } else if (pathname.startsWith("/")) {
      filePath = pathname.slice(1);
    }

    console.log(`Extracted file path: "${filePath}" from URL: ${urlString}`);
    return filePath;
  } catch (err) {
    console.error(`❌ Failed to extract file path from URL: ${urlString}`, err);
    return "";
  }
};

// Enhanced regeneration of signed URLs
const regenerateSignedUrls = async (imageUrls: string[], postId: string) => {
  const results = await Promise.all(
    imageUrls.map(async (url, index) => {
      // Force regeneration for debugging
      const expired = isSignedUrlExpired(url);
      console.log(`URL ${index + 1} expired check: ${expired}`);

      if (!expired) {
        console.log(`URL ${index + 1} not expired, keeping existing URL`);
        return url;
      }

      const filePath = extractFilePathFromSignedUrl(url);
      if (!filePath) {
        console.error(
          `❌ [${postId}] Skipping image ${
            index + 1
          }, could not extract file path.`
        );
        return url;
      }

      try {
        console.log(`Generating new URL for file: ${filePath}`);
        const file = bucket.file(filePath);

        // Check if file exists
        const [exists] = await file.exists();
        if (!exists) {
          console.error(
            `❌ [${postId}] File ${filePath} does not exist in bucket`
          );
          return url;
        }

        // Generate with unique cache buster to ensure different URLs
        const [newUrl] = await file.getSignedUrl({
          version: "v4",
          action: "read",
          expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
          queryParams: { cacheBuster: Date.now().toString() },
        });

        console.log(`🔁 [${postId}] Image ${index + 1} expired.`);
        console.log(`Old: ${url}`);
        console.log(`New: ${newUrl}`);

        return newUrl;
      } catch (err) {
        console.error(
          `❌ [${postId}] Failed to regenerate signed URL for image ${
            index + 1
          }:`,
          err
        );
        return url;
      }
    })
  );

  return results;
};

// GET /api/posts
router.get("/", async (req, res) => {
  try {
    const posts = await prisma.animalHelpPost.findMany({
      include: {
        volunteer: {
          include: {
            user: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const updatedPosts = await Promise.all(
      posts.map(async (post) => {
        console.log(`Processing post: ${post.id}`);

        // Deep clone the images array to compare later
        const originalImages = [...post.images];
        const updatedImages = await regenerateSignedUrls(
          originalImages,
          post.id
        );

        // Better comparison to detect changes
        const changed = updatedImages.some(
          (newUrl, i) => newUrl !== originalImages[i]
        );

        if (changed) {
          console.log(
            `Changes detected for post ${post.id}, updating database`
          );
          await prisma.animalHelpPost.update({
            where: { id: post.id },
            data: { images: updatedImages },
          });
          console.log(`✅ [${post.id}] Updated expired image URLs in DB`);
        } else {
          console.log(`No changes for post ${post.id}`);
        }

        return { ...post, images: updatedImages };
      })
    );

    res.json(updatedPosts);
  } catch (error) {
    console.error("❗ Failed to fetch/update posts:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
