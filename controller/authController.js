import prisma from "../db/db.js";
import bcrypt from "bcrypt";
import generateToken from "../utils/generateJWT.js";

const signup = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;
  
  try {
    // Check if all required fields are provided
    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Check if user already exists
    const isExist = await prisma.users.findFirst({
      where: { email },
    });
    if (isExist) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password before storing
    const hashPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await prisma.users.create({
      data: {
        name,
        email,
        password: hashPassword,
      },
    });

    // Check if user creation is successful
    if (!user) {
      return res.status(400).json({ message: "User not registered" });
    }
const{password:_,...User} = user;
    // Return success response
    return res.status(201).json({
      message: "User registration successful",
      User
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    // Check if fields are provided
    if (!email || !password) {
      return res.status(400).json({ message: "Fields are required" });
    }

    // Find user by email
    const user = await prisma.users.findUnique({
      where: { email },
    });
    if (!user) {
      return res.status(404).json({ message: "User not found, please signup" });
    }

    // Compare password with hashed password in the database
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = generateToken(user.id);

    // Return success response with token
    return res.status(200).json({
      message: "User login successful",
      token: `Bearer ${token}`,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export { signup, login };
