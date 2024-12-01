import fs from "fs";
import { randomNameGenerator } from ".//file.js";
import path from "path";
const uploadFile = async (image) => {
  const nameExist = image?.name.split(".");
  const imageName = randomNameGenerator() + "." + nameExist[1];
  const uploadDir = path.join(process.cwd(), "public", "images");

  // Ensure the directory exists
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true }); // Create the directory if it doesn't exist
  }

  const uploadPath = path.join(uploadDir, imageName);
  console.log(uploadPath);

  // Move the file
  await new Promise((resolve, reject) => {
    image.mv(uploadPath, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
  return imageName;
};
export default uploadFile;
