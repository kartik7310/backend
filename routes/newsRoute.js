import express from "express";
const router = express.Router();
import authMiddleware from "../middlewares/authMiddleware.js";
import { createNews ,fetchAllNews,fetchOneNews,updateNews,deleteNews} from "../controller/newsController.js";
router.post("/news",authMiddleware,createNews)
router.get("/news",fetchAllNews)
router.get("/news/:id",fetchOneNews)
router.put("/news/:id",authMiddleware,updateNews)
router.delete("/news/:id",authMiddleware,deleteNews)
export default router;