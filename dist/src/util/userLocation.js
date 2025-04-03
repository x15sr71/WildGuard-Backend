"use strict";
// import { Request, Response, NextFunction } from 'express';
// import prisma from '../../prisma/prisma';
// export const saveUserLocation = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const { location } = req.body;
//         console.log(location);
//         // Fetch the first user based on the createdAt field
//         const firstUser = await prisma.user.findFirst({
//             orderBy: { createdAt: 'asc' },
//         });
//         if (!firstUser) {
//              res.status(404).json({ error: "No user found" });
//             return;
//         }
//         // Update the first user's location
//         const response = await prisma.user.update({
//             where: { id: firstUser.id},
//             data: {
//                 currentLocation: location, // Directly storing as JSON
//             },
//         });
//         console.log("Location updated:", response);
//         res.json({ done: "done" });
//     } catch (error) {
//         console.error("Error updating location:", error);
//         res.status(500).json({ error: "Internal Server Error" });
//     }
// };
