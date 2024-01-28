import fs from "fs";
import multer from "multer";
import AuthorModel from "../models/author.model";
import { storage } from "../utils/multerFile";

const upload = multer({
  storage: storage,
});

export const addAuthor = (req, res) => {
  try {
    const uploadAuthorData = upload.single("avatar");
    uploadAuthorData(req, res, function (error) {
      if (error) {
        return res.status(400).json({
          message: error.message,
        });
      }
      const { name, role } = req.body;

      let avatar = null;
      if (req.file != undefined) {
        avatar = req.file.filename;
      }
      const saveAuthor = new AuthorModel({
        name,
        role,
        avatar,
      });
      saveAuthor.save();
      if (saveAuthor) {
        return res.status(201).json({
          data: saveAuthor,
          message: "Author has been added Successfully",
        });
      }
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
export const getAuthors = async (req, res) => {
  try {
    const authors = await AuthorModel.find({ status: 1 });
    if (authors) {
      return res.status(200).json({
        data: authors,
        total: authors.length,
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
export const getAuthor = async (req, res) => {
  const authorID = req.params.author_id;
  try {
    const author = await AuthorModel.findOne({
      status: 1,
      _id: authorID,
    });
    if (author) {
      return res.status(200).json({
        data: author,
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
export const updateAuthor = async (req, res) => {
  try {
    const updateAuthorData = upload.single("avatar");
    updateAuthorData(req, res, async function (error) {
      if (error) {
        return res.status(400).json({
          message: error.message,
        });
      }
      const { name, role } = req.body;
      const authorID = req.params.author_id;
      const existAuthor = await AuthorModel.findOne({
        _id: authorID,
      });

      let avatar = existAuthor.avatar;
      if (req.file) {
        avatar = req.file.filename;
        if (fs.existsSync("./uploads/authors/" + existAuthor.avatar)) {
          fs.unlinkSync("./uploads/authors/" + existAuthor.avatar);
        }
      }
      const updatedAuthor = await AuthorModel.updateOne(
        { _id: authorID },
        {
          $set: {
            name,
            role,
            avatar,
          },
        }
      );
      if (updatedAuthor.matchedCount) {
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
export const deleteAuthor = async (req, res) => {
  try {
    const authorID = req.params.author_id;
    const deletedAuthor = await AuthorModel.updateOne(
      { _id: authorID },
      {
        $set: {
          status: 0,
        },
      }
    );
    if (deletedAuthor.acknowledged) {
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
export const removeAuthor = async (req, res) => {
  try {
    const authorID = req.params.author_id;
    const authorData = await AuthorModel.findOne({
      _id: authorID,
    });

    if (fs.existsSync("uploads/authors/" + authorData.avatar)) {
      fs.unlinkSync("uploads/authors/" + authorData.avatar);
    }

    const deletedAuthor = await AuthorModel.deleteOne({
      _id: authorID,
    });

    if (deletedAuthor.acknowledged) {
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
