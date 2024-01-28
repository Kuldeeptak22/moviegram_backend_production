import mongoose from "mongoose";
import TvShowModel from "./tvShow.model";
const Schema = mongoose.Schema;

const seasonSchema = new Schema({
  tvShow: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: TvShowModel,
  },
  epTitle: {
    type: String,
    required: true,
  },
  poster: {
    type: String,
    default: null,
  },
  url: {
    type: String,
    required: true,
  },
  releaseDate: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  episode: {
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

export default mongoose.model("season", seasonSchema);
