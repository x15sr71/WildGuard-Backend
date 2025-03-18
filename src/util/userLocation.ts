import { Request, Response, NextFunction } from 'express';
import prisma from '../../prisma/prisma';

export const saveUserLocation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { location } = req.body;
        console.log(location)
        const response = await prisma.user.update({
            where: { id: "7e5beb5e-fa49-4878-b6f4-8f28b272c4bc" },
            data: {
                currentLocation: JSON.stringify(location), // Store location as a JSON string
            },
        });

        console.log("Location updated:", response);
        res.json({ done: "done" })
        //   return res.status(200).json({ message: "Location updated successfully." });
    } catch (error) {
        console.error("Error updating location:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
