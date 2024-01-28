import fs from "fs";
import multer from "multer";
import MovieModel from "../models/movie.model";
import { storage } from "../utils/multerFile";

const upload = multer({
  storage: storage,
});

export const addMovie = (req, res) => {
  try {
    const uploadMovieData = upload.fields([
      { name: "thumbnail", maxCount: 1 },
      { name: "poster", maxCount: 1 },
      { name: "movieLogo", maxCount: 1 },
    ]);
    uploadMovieData(req, res, async function (error) {
      if (error) {
        return res.status(400).json({
          message: error.message,
        });
      }

      let thumbnailImage = null;
      let poster = null;
      let movieLogo = null;
      if (req.files["thumbnail"]) {
        thumbnailImage = req.files["thumbnail"][0].filename;
      }

      if (req.files["poster"]) {
        poster = req.files["poster"][0].filename;
      }

      if (req.files["movieLogo"]) {
        movieLogo = req.files["movieLogo"][0].filename;
      }

      const saveMovie = await MovieModel.create({
        ...req.body,
        poster: poster,
        thumbnail: thumbnailImage,
        movieLogo: movieLogo,
      });

      if (saveMovie) {
        return res.status(201).json({
          data: saveMovie,
          message: "Movie has been added Successfully",
        });
      }
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
export const getMovies = async (req, res) => {
  try {
    const { page, size, search, sortFilter, zone, category } = req.query;
    const skipNo = (page - 1) * size;
    const rgx = (pattern) => new RegExp(`.*${pattern}.*`);
    const searchRgx = rgx(search);

    let filter = { status: 1 };

    if (category !== undefined) {
      filter = {
        ...filter,
        category: category,
      };
    }

    if (search !== undefined) {
      filter = {
        ...filter,
        $or: [
          { title: { $regex: searchRgx, $options: "i" } },
          { language: { $regex: searchRgx, $options: "i" } },
        ],
      };
    }

    let movieArray = [];
    if (page && size !== undefined) {
      movieArray.push(
        {
          $skip: skipNo,
        },
        {
          $limit: parseInt(size),
        }
      );
    }

    if (sortFilter === "asc" || sortFilter === "dsc") {
      movieArray.push({
        $sort: {
          rating: sortFilter === "asc" ? 1 : -1,
        },
      });
    }

    movieArray.push(
      {
        $match: filter,
      },
      {
        $lookup: {
          from: "categories", // from cetegory collection
          localField: "category", // category field of movie collection
          foreignField: "_id", // // category_id field of movie collection
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
      {
        $lookup: {
          from: "reviews",
          localField: "review",
          foreignField: "_id",
          as: "review",
        },
      },
      { $unwind: "$category" },
      { $unwind: "$zone" },
      { $unwind: "$review" }
    );

    const movies = await MovieModel.aggregate(movieArray);

    if (movies !== undefined) {
      return res.status(200).json({
        data: movies,
        total: movies.length,
        message: "Data has been Successfully fatched..!!",
        filepath: `${process.env.BASE_URL}/uploads`,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
export const getMovie = async (req, res) => {
  const movieID = req.params.movie_id;
  try {
    const movie = await MovieModel.findOne({
      status: 1,
      _id: movieID,
    })
      .populate("category")
      .populate("zone");

    if (movie) {
      return res.status(200).json({
        data: movie,
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
export const updateMovie = async (req, res) => {
  try {
    const updateMovieData = upload.fields([
      { name: "thumbnail", maxCount: 1 },
      { name: "poster", maxCount: 1 },
      { name: "movieLogo", maxCount: 1 },
    ]);
    updateMovieData(req, res, async function (error) {
      if (error) {
        return res.status(400).json({
          message: error.message,
        });
      }
      const {
        title,
        duration,
        zone,
        language,
        trailorUrl,
        releaseDate,
        views,
        likes,
        category,
        rating,
        cast,
        director,
        shortDescription,
        description,
      } = req.body;
      const movieID = req.params.movie_id;
      const existMovie = await MovieModel.findOne({
        _id: movieID,
      });

      let poster = existMovie.poster;
      let thumb = existMovie.thumbnail;
      let movieLogo = existMovie.movieLogo;

      let thumbnailImage = thumb;
      if (req.files["thumbnail"]) {
        thumbnailImage = req.files["thumbnail"][0].filename;
        if (fs.existsSync("./uploads/movies/" + existMovie.thumbnail)) {
          fs.unlinkSync("./uploads/movies/" + existMovie.thumbnail);
        }
      }
      if (req.files["poster"]) {
        poster = req.files["poster"][0].filename;
        if (fs.existsSync("./uploads/movies/" + existMovie.poster)) {
          fs.unlinkSync("./uploads/movies/" + existMovie.poster);
        }
      }
      if (req.files["movieLogo"]) {
        movieLogo = req.files["movieLogo"][0].filename;
        if (fs.existsSync("./uploads/movies/" + existMovie.movieLogo)) {
          fs.unlinkSync("./uploads/movies/" + existMovie.movieLogo);
        }
      }
      const updatedMovie = await MovieModel.updateOne(
        { _id: movieID },
        {
          $set: {
            title,
            duration,
            zone,
            language,
            trailorUrl,
            releaseDate,
            views,
            likes,
            category,
            rating,
            cast,
            director,
            shortDescription,
            description,
            poster,
            thumbnail: thumbnailImage,
            movieLogo,
          },
        }
      );
      if (updatedMovie.matchedCount) {
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
export const deleteMovie = async (req, res) => {
  try {
    const movieID = req.params.movie_id;
    const deletedMovie = await MovieModel.updateOne(
      { _id: movieID },
      {
        $set: {
          status: 0,
        },
      }
    );
    if (deletedMovie.acknowledged) {
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
export const removeMovie = async (req, res) => {
  try {
    const movieID = req.params.movie_id;
    const existMovie = await MovieModel.findOne({
      _id: movieID,
    });

    if (fs.existsSync("uploads/movies/" + existMovie.poster)) {
      fs.unlinkSync("uploads/movies/" + existMovie.poster);
    }
    if (fs.existsSync("uploads/movies/" + existMovie.thumbnail)) {
      fs.unlinkSync("uploads/movies/" + existMovie.thumbnail);
    }
    if (fs.existsSync("uploads/movies/" + existMovie.movieLogo)) {
      fs.unlinkSync("uploads/movies/" + existMovie.movieLogo);
    }

    const deletedMovie = await MovieModel.deleteOne({
      _id: movieID,
    });

    if (deletedMovie.acknowledged) {
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
