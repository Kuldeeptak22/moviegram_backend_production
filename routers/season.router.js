import express from "express";
import {
  addSeason,
  deleteSeason,
  getSeason,
  getSeasons,
  getSeasonsByTvShow,
  removeSeason,
  updateSeason,
} from "../controllers/season.controller";

const router = express.Router();

router.post("/add_season", addSeason);
router.get("/get_seasons", getSeasons);
router.get("/get_season/:season_id", getSeason);
router.get("/get_seasonByTvShow/:tvShow_id", getSeasonsByTvShow);
router.put("/update_season/:season_id", updateSeason);
router.delete("/delete_season/:season_id", deleteSeason);
router.delete("/remove_season/:season_id", removeSeason);
export default router;
