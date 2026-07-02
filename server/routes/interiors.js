import express from "express"
import InteriorController from "../controllers/interiors.js"

const router = express.Router()

router.get("/", InteriorController.getInteriors)
router.get("/:interiorId", InteriorController.getInteriorById)

export default router