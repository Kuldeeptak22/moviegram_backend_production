import express from "express";
import {
  addBlog,
  deleteBlog,
  getBlog,
  getBlogs,
  removeBlog,
  updateBlog,
} from "../controllers/blog.controller";

const router = express.Router();

router.post("/add_blog", addBlog);
router.get("/get_blogs", getBlogs);
router.get("/get_blog/:blog_id", getBlog);
router.put("/update_blog/:blog_id", updateBlog);
router.delete("/delete_blog/:blog_id", deleteBlog);
router.delete("/remove_blog/:blog_id", removeBlog);
export default router;
