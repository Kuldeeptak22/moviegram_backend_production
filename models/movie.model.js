import mongoose from "mongoose";
import CategoryModel from "./category.model";
import ZoneModel from "./zone.model";
import ReviewModel from "./reviews.model";
const Schema = mongoose.Schema;

const MovieShema = new Schema({
  title: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  poster: {
    type: String,
    default: null,
  },
  thumbnail: {
    type: String,
    default: null,
  },
  movieLogo: {
    type: String,
    default: null,
  },
  zone: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: ZoneModel,
  },
  language: {
    type: String,
    required: true,
  },
  trailorUrl: {
    type: String,
    required: true,
  },
  releaseDate: {
    type: String,
    required: true,
  },
  views: {
    type: Number,
    required: true,
  },
  likes: {
    type: Number,
    required: true,
  },
  category: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: CategoryModel,
  },
  review: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: ReviewModel,
  },
  rating: {
    type: Number,
    required: true,
  },
  cast: {
    type: Array,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  shortDescription: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: Number,
    default: 1,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

export default mongoose.model("movie", MovieShema);
