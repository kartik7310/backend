import jwt from "jsonwebtoken";
import prisma from "../db/db.js";

const authMiddleware = async (req, res, next) => {
  try {
    // Validate Authorization header
    const header = req.headers.authorization;
    // console.log(header);

    if (!header) {
      return res
        .status(401)
        .json({ message: "Authorization header is missing" });
    }

    // Extract token
    const token = header.split(" ")[1];
    if (!token) {
      return res.status(400).json({ message: "Token not provided" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log(decoded);

    if (!decoded) {
      return res.status(401).json({ message: "Invalid token payload" });
    }

    // Find user in the database
    const user = await prisma.users.findUnique({
      where: { id: parseInt(decoded) }, // Use `findUnique` for unique fields like `id`
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        profile: true,
      },
    });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Attach user to the request
    req.user = user;
    next();
  } catch (error) {
    console.error(error);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    } else if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    }

    return res.status(500).json(error.message);
  }
};

export default authMiddleware;
