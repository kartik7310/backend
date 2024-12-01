import 'dotenv/config';
import express from "express";
import fileUpload from 'express-fileupload';
import AuthRoute from "./routes/authRoute.js";
import userRoute from "./routes/userRoute.js";
import newsRoute from "./routes/newsRoute.js"
import limiter from './utils/rateLimiter.js';
import helmet from "helmet";
import cors from "cors"
const app = express();
const port = process.env.PORT || 8080;
app.use(limiter);
app.use(helmet())
app.use(cors())
app.use(express.static("public"));
app.use(express.json()); // Middleware to parse JSON bodies
app.use(express.urlencoded({ extended: false })); 
app.use(fileUpload());// Fixed: Add the correct object with 

app.get("/home", (req, res) => {
  res.json("hello from home page");
});

// Use AuthRoute for "/api/v1/"
app.use("/api/v1/", AuthRoute);
app.use("/api/v1/", userRoute);
app.use("/api/v1/", newsRoute);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
