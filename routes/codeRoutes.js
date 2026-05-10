const express = require("express");
const router = express.Router();
const {
  saveCode,
  getHistory,
} = require("../controllers/codeController");

const { runCode } = require("../controllers/executionController");

router.post("/save", saveCode);
router.get("/history/:roomId", getHistory);
router.post("/execute", runCode);

module.exports = router;