import express from "express";
import { addZone, deleteZone, getZone, getZones, removeZone, updateZone } from "../controllers/zone.controller";
const router = express.Router();

router.post("/add_zone", addZone);
router.get("/get_zones", getZones);
router.get("/get_zone/:zone_id", getZone);
router.put("/update_zone/:zone_id", updateZone);
router.delete("/delete_zone/:zone_id", deleteZone);
router.delete("/remove_zone/:zone_id", removeZone);
export default router;