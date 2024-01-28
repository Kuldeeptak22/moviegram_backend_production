import fs from "fs";
import multer from "multer";
import BlogModel from "../models/blog.model";
import { storage } from "../utils/multerFile";

const upload = multer({
  storage: storage,
});

export const addBlog = (req, res) => {
  try {
    const uploadBlogData = upload.single("image");
    uploadBlogData(req, res, function (error) {
      if (error) {
        return res.status(400).json({
          message: error.message,
        });
      }
      const { title, date, category, author, description } = req.body;

      let image = null;
      if (req.file != undefined) {
        image = req.file.filename;
      }
      const saveBlog = new BlogModel({
        title,
        date,
        category,
        author,
        description,
        image,
      });
      saveBlog.save();
      if (saveBlog) {
        return res.status(201).json({
          data: saveBlog,
          message: "Blog has been added Successfully",
        });
      }
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
export const getBlogs = async (req, res) => {
  try {
    const blogs = await BlogModel.find({ status: 1 })
      .populate("category")
      .populate("author");
    if (blogs) {
      return res.status(200).json({
        data: blogs,
        total: blogs.length,
        message: "SuccessFully Fetched",
        filepath: `${process.env.BASE_URL}/uploads`,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
export const getBlog = async (req, res) => {
  const blogID = req.params.blog_id;
  try {
    const blog = await BlogModel.findOne({
      status: 1,
      _id: blogID,
    })
      .populate("category")
      .populate("author");
    if (blog) {
      return res.status(200).json({
        data: blog,
        message: "Data has been Successfully Fetched",
        filepath: `${process.env.BASE_URL}/uploads`,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
export const updateBlog = async (req, res) => {
  try {
    const updateBlogData = upload.single("image");

    updateBlogData(req, res, async function (error) {
      if (error) {
        return res.status(400).json({
          message: error.message,
        });
      }
      const { title, date, category, author, description } = req.body;
      const blogID = req.params.blog_id;
      const existBlog = await BlogModel.findOne({
        _id: blogID,
      });

      let image = existBlog.image;
      if (req.file) {
        image = req.file.filename;
        if (fs.existsSync("./uploads/blogs/" + existBlog.image)) {
          fs.unlinkSync("./uploads/blogs/" + existBlog.image);
        }
      }
      const updatedBlog = await BlogModel.updateOne(
        { _id: blogID },
        {
          $set: {
            title,
            date,
            category,
            author,
            description,
            image,
          },
        }
      );
      if (updatedBlog.matchedCount) {
        return res.status(200).json({
          message: "Item has been Successfully Updated..!.",
        });
      }
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
export const deleteBlog = async (req, res) => {
  try {
    const blogID = req.params.blog_id;
    const deletedBlog = await BlogModel.updateOne(
      { _id: blogID },
      {
        $set: {
          status: 0,
        },
      }
    );
    if (deletedBlog.acknowledged) {
      return res.status(200).json({
        message: "Item has been Successfully Deleted..!",
      });
    }
  } catch (error) {
    return res.status(500).jason({
      message: error.message,
    });
  }
};
export const removeBlog = async (req, res) => {
  try {
    const blogID = req.params.blog_id;
    const blogData = await BlogModel.findOne({
      _id: blogID,
    });

    if (fs.existsSync("uploads/blogs/" + blogData.image)) {
      fs.unlinkSync("uploads/blogs/" + blogData.image);
    }

    const deletedBlog = await BlogModel.deleteOne({
      _id: blogID,
    });

    if (deletedBlog.acknowledged) {
      return res.status(200).json({
        message: "Item has been Successfully Deleted..!",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
