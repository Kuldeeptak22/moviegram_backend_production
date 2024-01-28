import fs from "fs";
import multer from "multer";
import TvShowModel from "../models/tvShow.model";
import { storage } from "../utils/multerFile";

const upload = multer({
  storage: storage,
});

export const addTvShow = (req, res) => {
  try {
    const uploadTvShowData = upload.fields([
      { name: "thumbnail", maxCount: 1 },
      { name: "poster", maxCount: 1 },
      { name: "showLogo", maxCount: 1 },
    ]);
    uploadTvShowData(req, res, async function (error) {
      if (error) {
        return res.status(400).json({
          message: error.message,
        });
      }

      let thumbnail = null;
      let poster = null;
      let showLogo = null;
      if (req.files["thumbnail"]) {
        thumbnail = req.files["thumbnail"][0].filename;
      }

      if (req.files["poster"]) {
        poster = req.files["poster"][0].filename;
      }

      if (req.files["showLogo"]) {
        showLogo = req.files["showLogo"][0].filename;
      }

      const saveTvShow = await TvShowModel.create({
        ...req.body,
        poster,
        thumbnail,
        showLogo,
      });

      if (saveTvShow) {
        return res.status(201).json({
          data: saveTvShow,
          message: "TvShow has been added Successfully",
        });
      }
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
export const getTvShows = async (req, res) => {
  try {
    const { search, sortFilter } = req.query;
    const rgx = (pattern) => new RegExp(`.*${pattern}.*`);
    const searchRgx = rgx(search);

    let filter = { status: 1 };
    if (search !== undefined) {
      filter = {
        ...filter,
        $or: [
          { title: { $regex: searchRgx, $options: "i" } },
          { language: { $regex: searchRgx, $options: "i" } },
        ],
      };
    }

    let tvShowArray = [];

    if (sortFilter === "asc" || sortFilter === "dsc") {
      tvShowArray.push({
        $sort: {
          rating: sortFilter === "asc" ? 1 : -1,
        },
      });
    }

    tvShowArray.push(
      {
        $match: filter,
      },
      {
        $lookup: {
          from: "categories", // from cetegory collection
          localField: "category", // category field of tvShow collection
          foreignField: "_id", // // category_id field of tvShow collection
          as: "category",
        },
      },
      {
        $lookup: {
          from: "zones",
          localField: "zone",
          foreignField: "_id",
          as: "zone",
        },
      },
      { $unwind: "$category" },
      { $unwind: "$zone" }
    );

    const tvShows = await TvShowModel.aggregate(tvShowArray);

    if (tvShows) {
      return res.status(200).json({
        data: tvShows,
        total: tvShows.length,
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
export const getTvShow = async (req, res) => {
  const tvShowID = req.params.tvShow_id;
  try {
    const tvShow = await TvShowModel.findOne({
      status: 1,
      _id: tvShowID,
    })
      .populate("zone")
      .populate("category")
    if (tvShow) {
      return res.status(200).json({
        data: tvShow,
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
export const updateTvShow = async (req, res) => {
  try {
    const updateTvShowData = upload.fields([
      { name: "thumbnail", maxCount: 1 },
      { name: "poster", maxCount: 1 },
      { name: "movieLogo", maxCount: 1 },
    ]);
    updateTvShowData(req, res, async function (error) {
      if (error) {
        return res.status(400).json({
          message: error.message,
        });
      }
      const {
        title,
        zone,
        language,
        trailorUrl,
        releaseYear,
        category,
        description,
      } = req.body;
      const tvShowID = req.params.tvShow_id;
      const existTvShow = await TvShowModel.findOne({
        _id: tvShowID,
      });

      let poster = existTvShow.poster;
      let thumbnail = existTvShow.thumbnail;
      let showLogo = existTvShow.movieLogo;

      if (req.files["thumbnail"]) {
        thumbnail = req.files["thumbnail"][0].filename;
        if (fs.existsSync("./uploads/tvShows/" + existTvShow.thumbnail)) {
          fs.unlinkSync("./uploads/tvShows/" + existTvShow.thumbnail);
        }
      }
      if (req.files["poster"]) {
        poster = req.files["poster"][0].filename;
        if (fs.existsSync("./uploads/tvShows/" + existTvShow.poster)) {
          fs.unlinkSync("./uploads/tvShows/" + existTvShow.poster);
        }
      }
      if (req.files["showLogo"]) {
        showLogo = req.files["showLogo"][0].filename;
        if (fs.existsSync("./uploads/tvShows/" + existTvShow.showLogo)) {
          fs.unlinkSync("./uploads/tvShows/" + existTvShow.showLogo);
        }
      }

      const updatedTvShowData = await TvShowModel.updateOne(
        { _id: tvShowID },
        {
          $set: {
            title,
            zone,
            language,
            trailorUrl,
            releaseYear,
            category,
            description,
            poster,
            thumbnail,
            showLogo,
          },
        }
      );
      if (updatedTvShowData.matchedCount) {
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
export const deleteTvShow = async (req, res) => {
  try {
    const tvShowID = req.params.tvShow_id;
    const deletedTvShow = await TvShowModel.updateOne(
      { _id: tvShowID },
      {
        $set: {
          status: 0,
        },
      }
    );
    if (deletedTvShow.acknowledged) {
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
export const removeTvShow = async (req, res) => {
  try {
    const tvShowID = req.params.tvShow_id;
    const tvShowData = await TvShowModel.findOne({
      _id: tvShowID,
    });

    if (fs.existsSync("uploads/tvShows/" + tvShowData.poster)) {
      fs.unlinkSync("uploads/tvShows/" + tvShowData.poster);
    }
    if (fs.existsSync("uploads/tvShows/" + tvShowData.thumbnail)) {
      fs.unlinkSync("uploads/tvShows/" + tvShowData.thumbnail);
    }
    if (fs.existsSync("uploads/tvShows/" + tvShowData.showLogo)) {
      fs.unlinkSync("uploads/tvShows/" + tvShowData.showLogo);
    }

    const deletedTvShow = await TvShowModel.deleteOne({
      _id: tvShowID,
    });

    if (deletedTvShow.acknowledged) {
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
