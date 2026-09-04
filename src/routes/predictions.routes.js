const express = require("express");
const { getBoard, placePrediction, collectPrediction, collectReward } = require("../controllers/predictions.controller");
const { authenticate } = require("../middleware/auth");

const router = express.Router();

router.get("/board", authenticate, getBoard);
router.post("/", authenticate, placePrediction);
router.post("/rewards/:id/collect", authenticate, collectReward);
router.post("/:id/collect", authenticate, collectPrediction);

module.exports = router;
