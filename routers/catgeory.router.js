import express from "express";
import { addCategory, deleteCategory, getCategories, getCategory, removeCategory, updateCategory } from "../controllers/category.controller";
const router = express.Router();

router.post("/add_category", addCategory);
router.get("/get_categories", getCategories);
router.get("/get_category/:category_id", getCategory);
router.put("/update_category/:category_id", updateCategory);
router.delete("/delete_category/:category_id", deleteCategory);
router.delete("/remove_category/:category_id", removeCategory);
export default router;
