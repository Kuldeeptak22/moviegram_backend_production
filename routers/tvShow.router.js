import express from "express";
import {
  addTvShow,
  deleteTvShow,
  getTvShow,
  getTvShows,
  removeTvShow,
  updateTvShow,
} from "../controllers/tvShow.controller";

const router = express.Router();

router.post("/add_tvShow", addTvShow);
router.get("/get_tvShows", getTvShows);
router.get("/get_tvShow/:tvShow_id", getTvShow);
router.put("/update_tvShow/:tvShow_id", updateTvShow);
router.delete("/delete_tvShow/:tvShow_id", deleteTvShow);
router.delete("/remove_tvShow/:tvShow_id", removeTvShow);
export default router;
