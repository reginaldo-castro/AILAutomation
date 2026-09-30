const express = require("express");
const leadController = require("../controllers/leadController");
const router = express.Router();

router.get("/", leadController.listarLeads);
router.post("/", leadController.criarLead);
router.patch("/:id", leadController.atualizarClassificacao);
router.get("/teste-erro", (req, res) => {
    return res.status(500).json({
        erro: "Erro temporário simulado"
    });
});

module.exports = router;