import express from "express";
const router = express.Router();
import authMiddleware from "../middlewares/authMiddleware.js";
import { getUserProfile ,updateUser} from "../controller/userController.js";
router.get("/profile",authMiddleware,getUserProfile);
router.put("/profile/:id",authMiddleware,updateUser);
export default router;