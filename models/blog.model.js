import mongoose from "mongoose";
import CategoryModel from "./category.model";
import AuthorModel from './author.model'
const Schema = mongoose.Schema;

const BlogSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: null,
  },
  date: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: CategoryModel,
  },
  author: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: AuthorModel,
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

export default mongoose.model("blog", BlogSchema);
