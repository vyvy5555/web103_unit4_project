import express from "express"
import RoofController from "../controllers/roofs.js"

const router = express.Router()

router.get("/", RoofController.getRoofs)
router.get("/:roofId", RoofController.getRoofById)

export default router