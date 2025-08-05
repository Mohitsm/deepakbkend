import express from "express";
import { addWhy, getAllWhys } from "../controllers/whyController.js";

const router = express.Router();

router.post("/add", addWhy);
router.get("/", getAllWhys);

export default router;
