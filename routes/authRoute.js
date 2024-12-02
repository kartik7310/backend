// import express from "express";
// const router = express.Router();
// import{signup,login} from "../controller/authController.js"

// router.post("/register",signup);
// router.post("/login",login);

// export default router; 
import express from "express";
const router = express.Router(); 

import { signup, login,sendTextEmail } from "../controller/authController.js";

router.post("/register", signup);
router.post("/login", login);
router.get("/send-email", sendTextEmail);

export default router; // Ensure this is the export
