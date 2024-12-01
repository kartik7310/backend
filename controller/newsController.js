import prisma from "../db/db.js";
import { removeImage } from "../utils/getImageUrl.js";
// import fs from "fs";
// import path from "path";

import uploadFile from "../utils/uploadFile.js";
import fileValidator from "../utils/file.js";
import newsApiTransform from "../utils/newsApiTransfrom.js";
import { json } from "express";

const createNews = async (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json("all fields are required");
  }
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json("unAuthroised");
    }
    const image = req.files?.image;
    if (!image || Object.keys(image).length == 0) {
      return res.status(400).json("image not provide");
    }
    const imageValidate = fileValidator(image.size, image.mimetype);
    if (imageValidate) {
      return res.status(400).json(imageValidate);
    }
    const imageName = await uploadFile(image);
    const news = await prisma.news.create({
      data: {
        image: imageName,
        title: title,
        content: content,
        userId: parseInt(user.id),
      },
    });
    console.log(news);

    console.log(imageName);
    console.log(title);
    console.log(content);

    return res.status(200).json({
      news,
    });
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

const fetchAllNews = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 1;
    if (page <= 0) {
      page = 1;
    }
    if (limit >= 100) {
      limit = 1;
    }
    const skip = (page - 1) * limit;
    const news = await prisma.news.findMany({
      take: limit,
      skip: skip,
      include: {
        users: {
          select: {
            id: true,
            name: true,
            email: true,
            profile: true,
            createdAt: true,
          },
        },
      },
    });

    if (!news || news.length === 0) {
      return res.status(404).json({ message: "No news found" }); // Handle no records
    }
    const transformedNews = news.map((item) => newsApiTransform(item));

    const totalNews = await prisma.news.count();
    // console.log(totalNews);

    const totalPages = Math.ceil(totalNews / page);
    console.log(totalPages);

    return res.status(200).json({
      message: "news fetch successfully",
      news: transformedNews,
      metadata: {
        totalPages,
        currentPage: page,
        currentLimit: limit,
      },
    });
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

const fetchOneNews = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json("id not provide");
    }
    const news = await prisma.news.findFirst({
      where: {
        id: parseInt(id),
      },
      include: {
        users: {
          select: {
            name: true,
            profile: true,
            createdAt: true,
          },
        },
      },
    });

    const transformNews = news ? newsApiTransform(news) : null;
    return res.status(200).json({
      message: "news fetch successfully",
      news: transformNews,
    });
  } catch (error) {
    return res.status(500).json("something went wrong please try again");
  }
};

const updateNews = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    const user = req.user;
    if (!title || !content) {
      return res.status(400).json("fields are required");
    }
    const news = await prisma.news.findUnique({
      where: { id: parseInt(id) },
    });
    if (!news) {
      return res.status(400).json("news not found");
    }

    if (user.id !== news.userId) {
      return res.status(401).json("you are not authorization  for update news");
    }
    let imageName = news.image;
    if (req.files?.image) {
      const image = req.files.image;
      const message = fileValidator(image?.size, image?.mimetype);
      if (message !== null) {
        return res.status(400).json(message.error);
      }
     removeImage(news.image);
      imageName = await uploadFile(image);
     
    }

    const newsData = await prisma.news.update({
      where: {
        id: parseInt(id),
      },
      data: {
        title,
        image: imageName,
        content,
      },
    });

    return res.status(200).json({
      message: "success",
      data: newsData,
    });
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

const deleteNews = async(req,res)=>{
 try {
  const{id} = req.params;
  if(!id){
    return res.status(400).json("id not provide")
  }
  const user = req.user;
const news = await prisma.news.findUnique({
  where:{
    id:parseInt(id)
  }
});
 if(!news){
  return res.status(404).json("news not found")
 }
 if(user.id !==news.userId){
  console.log(user.id,news.userId);
  
  return res.status(401).json("you have't permissions to delete news")
 }
 removeImage(news.image)
 await prisma.news.delete({
    where:{
      id:parseInt(id)
    }
 })
 return res.status(200).json("news delete successfully ")
 } catch (error) {
  return res.status(500).json(error.message)
 }
}
export { createNews, fetchAllNews, fetchOneNews, updateNews,deleteNews };
