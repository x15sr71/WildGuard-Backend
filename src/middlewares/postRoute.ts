import express from "express";
import prisma from "../../prisma/prisma";

const router = express.Router();

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

    res.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
