import { Request, Response, NextFunction } from "express";
import prisma from "../../prisma/prisma";

export const searchMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const query = req.query.query as string;

  console.log("Search query received:", query);

  if (!query || query.trim() === "") {
    res.status(400).json({ error: "Query parameter is required." });
    return;
  }

  try {
    const results = await prisma.volunteerProfile.findMany({
      where: {
        OR: [
          { skills: { has: query } },
          { geoLocation: { contains: query, mode: "insensitive" } },
          {
            user: {
              name: { contains: query, mode: "insensitive" },
            },
          },
        ],
      },
    });

    res.json(results);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ error: "Server error" });
  }
};
  