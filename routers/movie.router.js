import express from "express";
import { addMovie, deleteMovie, getMovie, getMovies, removeMovie, updateMovie } from "../controllers/movie.controller";
const router = express.Router();

router.post("/add_movie", addMovie);
router.get("/get_movies", getMovies);
router.get("/get_movie/:movie_id", getMovie);
router.put("/update_movie/:movie_id", updateMovie);
router.delete("/delete_movie/:movie_id", deleteMovie);
router.delete("/remove_movie/:movie_id", removeMovie);
export default router;
