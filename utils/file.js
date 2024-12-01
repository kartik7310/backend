import { v4 as uuidv4 } from "uuid";

const fileValidator = (size, mimetype) => {
  console.log("Mimetype received:", mimetype); // Debugging line
  if (byteToMb(size) > 2) {
    return "Image must be less than 2 MB";
  } else if (!fileType.includes(mimetype)) {
    return "File must be png, jpeg, svg, or gif";
  }
  return null;
};

export const byteToMb = (bytes) => {
  return bytes / (1024 * 1024); // Correct conversion from bytes to MB
};

const fileType = ["image/png", "image/jpeg", "image/svg+xml", "image/gif","image/pdf"];


export const randomNameGenerator = ()=>{
  return uuidv4();
}
export default fileValidator;
