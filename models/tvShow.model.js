import mongoose from "mongoose";
import CategoryModel from "./category.model";
import ZoneModel from "./zone.model";
import SeasonModel from "./season.model";
const Schema = mongoose.Schema;

const tvShowSchema = new Schema({
  title: {
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
  showLogo: {
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
  releaseYear: {
    type: String,
    required: true,
  },
  category: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: CategoryModel,
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

export default mongoose.model("tvShow", tvShowSchema);
