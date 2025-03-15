import admin from "../firebase";
import prisma from "../../prisma/prisma";

export async function findOrCreateUser(
  decodedToken: admin.auth.DecodedIdToken
) {
  // Look for the user in the database by their Firebase UID.
  let user = await prisma.user.findUnique({
    where: { firebaseId: decodedToken.uid },
  });

  if (user) {
    console.log("User found in database:", {
      firebaseId: user.firebaseId,
      email: user.email,
      name: user.name,
    });
    return user;
  }

  // Log details extracted from the token
  console.log("User not found in database. Creating new user with details:");
  console.log("firebaseId:", decodedToken.uid);
  console.log("email:", decodedToken.email);
  console.log("name:", decodedToken.name);
  if (decodedToken.picture) {
    console.log("profilePicture:", decodedToken.picture);
  }

  // Create a new user record in the database
  user = await prisma.user.create({
    data: {
      firebaseId: decodedToken.uid,
      email: decodedToken.email || "",
      name: decodedToken.name || "",
      // Extend your Prisma model if you need to store a profile picture.
    },
  });

  console.log("New user created:", {
    firebaseId: user.firebaseId,
    email: user.email,
    name: user.name,
  });

  return user;
}
