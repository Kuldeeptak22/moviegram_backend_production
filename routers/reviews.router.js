import express from "express";
import { addReview, deleteReview, getReview, getReviews, removeReview, updateReview } from "../controllers/reviews.controllers";
const router = express.Router();

router.post("/add_review", addReview);
router.get("/get_reviews", getReviews);
router.get("/get_review/:review_id", getReview);
router.put("/update_review/:review_id", updateReview);
router.delete("/delete_review/:review_id", deleteReview);
router.delete("/remove_review/:review_id", removeReview);

export default router;