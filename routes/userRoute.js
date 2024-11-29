import express from "express";
const router = express.Router();
import authMiddleware from "../middlewares/authMiddleware.js";
import { getUserProfile } from "../controller/userController.js";
router.get("/profile",authMiddleware,getUserProfile)
export default router;