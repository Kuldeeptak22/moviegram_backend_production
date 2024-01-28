import fs from "fs";
import multer from "multer";
import SeasonModel from "../models/season.model";
import { storage } from "../utils/multerFile";

const upload = multer({
  storage: storage,
});

export const addSeason = (req, res) => {
  try {
    const uploadSeasonData = upload.single("poster");
    uploadSeasonData(req, res, async function (error) {
      if (error) {
        return res.status(400).json({
          message: error.message,
        });
      }

      let poster = null;
      if (req.file != undefined) {
        poster = req.file.filename;
      }

      const saveSeason = await SeasonModel.create({
        ...req.body,
        poster: poster,
      });

      if (saveSeason) {
        return res.status(201).json({
          data: saveSeason,
          message: "Season has been added Successfully",
        });
      }
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
export const getSeasons = async (req, res) => {
  try {
    const seasons = await SeasonModel.find({ status: 1 }).populate("tvShow");
    if (seasons) {
      return res.status(200).json({
        data: seasons,
        total: seasons.length,
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
export const getSeasonsByTvShow = async (req, res) => {
  const tvShowID = req.params.tvShow_id;
  try {
    const seasons = await SeasonModel.find({
      status: 1,
      tvShow: tvShowID,
    });

    if (seasons) {
      return res.status(200).json({
        data: seasons,
        total: seasons.length,
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
export const getSeason = async (req, res) => {
  const seasonID = req.params.season_id;
  try {
    const season = await SeasonModel.findOne({
      status: 1,
      _id: seasonID,
    });
    if (season) {
      return res.status(200).json({
        data: season,
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
export const updateSeason = async (req, res) => {
  try {
    const updateSeasonData = upload.single("poster");
    updateSeasonData(req, res, async function (error) {
      if (error) {
        return res.status(400).json({
          message: error.message,
        });
      }
      const {
        tvShow,
        epTitle,
        url,
        releaseDate,
        duration,
        episode,
        description,
      } = req.body;
      const seasonID = req.params.season_id;
      const existSeason = await SeasonModel.findOne({
        _id: seasonID,
      });

      let poster = existSeason.poster;
      if (req.file) {
        poster = req.file.filename;
        if (fs.existsSync("./uploads/seasons/" + existSeason.poster)) {
          fs.unlinkSync("./uploads/seasons/" + existSeason.poster);
        }
      }
      const updatedSeasonData = await SeasonModel.updateOne(
        { _id: seasonID },
        {
          $set: {
            tvShow,
            epTitle,
            url,
            releaseDate,
            duration,
            episode,
            description,
            poster,
          },
        }
      );
      if (updatedSeasonData.matchedCount) {
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
export const deleteSeason = async (req, res) => {
  try {
    const seasonID = req.params.season_id;
    const deletedSeason = await SeasonModel.updateOne(
      { _id: seasonID },
      {
        $set: {
          status: 0,
        },
      }
    );
    if (deletedSeason.acknowledged) {
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
export const removeSeason = async (req, res) => {
  try {
    const seasonID = req.params.season_id;
    const seasonData = await SeasonModel.findOne({
      _id: seasonID,
    });

    if (fs.existsSync("uploads/seasons/" + seasonData.poster)) {
      fs.unlinkSync("uploads/seasons/" + seasonData.poster);
    }

    const deletedSeason = await SeasonModel.deleteOne({
      _id: seasonID,
    });

    if (deletedSeason.acknowledged) {
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
