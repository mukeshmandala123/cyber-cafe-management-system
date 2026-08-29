const express = require("express");

const {
  getTerminals,
  getTerminal,
  createTerminal,
  updateTerminal,
  deleteTerminal,
} = require("../controllers/terminalController");

const router = express.Router();

router.get("/", getTerminals);
router.get("/:id", getTerminal);
router.post("/", createTerminal);
router.put("/:id", updateTerminal);
router.delete("/:id", deleteTerminal);

module.exports = router;