import jwt from "jsonwebtoken";
import prisma from "../db/db.js";

const authMiddleware = async (req, res, next) => {
  // 1. Get the token from the Authorization header
  const header = req.headers.authorization;
  console.log(header);
  
  if(header==null ||header==undefined) return res.status(402).json("not Authorization")
  const token = header.split(" ")[1]
  // 2. Check if token is provided
  console.log(token);
  
  if (!token) {
    return res.status(400).json({ message: "Token not provided" });
  }

  try {
    // 3. Decode the token and verify
    const decoded = jwt.verify(token, process.env.JWT_SECRET);    
    // 4. If token is invalid or expired
    if (!decoded) {
      return res.status(401).json({ message: "Not authorized" });
    }

    // 5. Find the user in the database using the decoded user ID
    const user = await prisma.users.findFirst({
      where: { id: decoded.userId },  // Assuming your token has a userId field
      select: {
        name: true,
        email: true,
        createdAt:true,
        profile:true
      },
    });

    // 6. If no user is found
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // 7. Attach the user to the request object
    req.user = user;
    
    // 8. Move to the next middleware or route handler
    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default authMiddleware;
