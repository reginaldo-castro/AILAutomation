const express = require("express");

const leadController = require("../controllers/leadController");

const router = express.Router();

router.get("/", leadController.listarLeads);
router.post("/", leadController.criarLead);

module.exports = router;