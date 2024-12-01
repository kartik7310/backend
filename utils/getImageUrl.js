import fs from "fs"
const getImageUrl = (imageName)=>{
  return `${process.env.APP_URL}/images/${imageName}`
}

const removeImage = (imageName)=>{
const path = process.cwd()+"/public/images"+imageName;
if(fs.existsSync(path)){
  fs.unlink(path)
}
}
export  {getImageUrl,removeImage};