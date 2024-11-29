import 'dotenv/config';
import express from "express";
import AuthRoute from "./routes/authRoute.js";
import userRoute from "./routes/userRoute.js";

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json()); // Middleware to parse JSON bodies
app.use(express.urlencoded({ extended: false })); // Fixed: Add the correct object with `extended: false`

app.get("/home", (req, res) => {
  res.json("hello from home page");
});

// Use AuthRoute for "/api/v1/"
app.use("/api/v1/", AuthRoute);
app.use("/api/v1/", userRoute);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
