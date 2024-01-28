import fs from "fs";
import multer from "multer";
import CategoryModel from "../models/category.model";
import { storage } from "../utils/multerFile";

const upload = multer({
  storage: storage,
});

export const addCategory = (req, res) => {
  try {
    const uploadCategoryData = upload.single("image");
    uploadCategoryData(req, res, function (error) {
      if (error) {
        return res.status(400).json({
          message: error.message,
        });
      }
      const { name, description } = req.body;

      let image = null;
      if (req.file != undefined) {
        image = req.file.filename;
      }
      const saveCategory = new CategoryModel({
        name,
        description,
        image,
      });
      saveCategory.save();
      if (saveCategory) {
        return res.status(201).json({
          data: saveCategory,
          message: "Category has been added Successfully",
        });
      }
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
export const getCategories = async (req, res) => {
  try {
    const categories = await CategoryModel.find({ status: 1 });
    if (categories) {
      return res.status(200).json({
        data: categories,
        total: categories.length,
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
export const getCategory = async (req, res) => {
  const categoryID = req.params.category_id;
  try {
    const category = await CategoryModel.findOne({
      status: 1,
      _id: categoryID,
    });
    if (category) {
      return res.status(200).json({
        data: category,
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
export const updateCategory = async (req, res) => {
  try {
    const updateCategoryData = upload.single("image");
    updateCategoryData(req, res, async function (error) {
      if (error) {
        return res.status(400).json({
          message: error.message,
        });
      }
      const { name, description } = req.body;
      const categoryID = req.params.category_id;
      const existCategory = await CategoryModel.findOne({
        _id: categoryID,
      });

      let image = existCategory.image;
      if (req.file) {
        image = req.file.filename;
        if (fs.existsSync("./uploads/categories/" + existCategory.image)) {
          fs.unlinkSync("./uploads/categories/" + existCategory.image);
        }
      }
      const updatedCategory = await CategoryModel.updateOne(
        { _id: categoryID },
        {
          $set: {
            name,
            description,
            image,
          },
        }
      );
      if (updatedCategory.matchedCount) {
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
export const deleteCategory = async (req, res) => {
    try {
      const categoryID = req.params.category_id;
      const deletedCategory = await CategoryModel.updateOne(
        { _id: categoryID },
        {
          $set: {
            status: 0,
          },
        }
      );
      if (deletedCategory.acknowledged) {
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
export const removeCategory = async (req, res) => {
    try {
      const categoryID = req.params.category_id;
      const categoryData = await CategoryModel.findOne({
        _id: categoryID,
      });
  
      if (fs.existsSync("uploads/categories/" + categoryData.image)) {
        fs.unlinkSync("uploads/categories/" + categoryData.image);
      }
  
      const deletedCategory = await CategoryModel.deleteOne({
        _id: categoryID,
      });
  
      if (deletedCategory.acknowledged) {
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
  