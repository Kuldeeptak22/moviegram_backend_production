import express from "express";
import {
  addAuthor,
  deleteAuthor,
  getAuthor,
  getAuthors,
  removeAuthor,
  updateAuthor,
} from "../controllers/author.controller";

const router = express.Router();

router.post("/add_author", addAuthor);
router.get("/get_authors", getAuthors);
router.get("/get_author/:author_id", getAuthor);
router.put("/update_author/:author_id", updateAuthor);
router.delete("/delete_author/:author_id", deleteAuthor);
router.delete("/remove_author/:author_id", removeAuthor);
export default router;
