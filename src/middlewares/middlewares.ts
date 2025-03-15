import { Request, Response, NextFunction } from "express";
import admin from "../firebase";

// Extend Express Request type to include a `user` property
export interface AuthenticatedRequest extends Request {
  user?: admin.auth.DecodedIdToken;
}

export const authenticate = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const token = req.headers.authorization?.split(" ")[1];
  console.log(
    "Authenticate middleware: received token:",
    token ? "Token provided" : "No token provided"
  );

  if (!token) {
    console.error("Authentication failed: No token provided");
    res.status(401).json({ message: "Unauthorized - No token provided" });
    return;
  }

  admin
    .auth()
    .verifyIdToken(token)
    .then((decodedToken) => {
      console.log("Token verified successfully for UID:", decodedToken.uid);
      req.user = decodedToken;
      next();
    })
    .catch((error) => {
      console.error("Token verification error:", error);
      res.status(403).json({ message: "Invalid token", error });
    });
};
