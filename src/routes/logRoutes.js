const express = require("express");
const logController = require("../controllers/logController");
const router = express.Router();

router.post("/", logController.criarLog);

module.exports = router;