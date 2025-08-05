import express from "express";
import {
  addWhy,
  getAllWhys,
  getWhyById,
  updateWhy,
  deleteWhy
} from "../controllers/whyController.js";

const router = express.Router();

router.post("/", addWhy);
router.get("/", getAllWhys);
router.get("/:id", getWhyById);
router.put("/:id", updateWhy);
router.delete("/:id", deleteWhy);

export default router;
