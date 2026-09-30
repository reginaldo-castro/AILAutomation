const logService = require("../services/logService");

async function criarLog(req, res) {
    try {
        const {
            workflow,
            status,
            mensagem
        } = req.body;

        if (!workflow || !status) {
            return res.status(400).json({
                error: "workflow e status são obrigatórios"
            });
        }

        const log = await logService.criarLog({
            workflow,
            status,
            mensagem
        });

        return res.status(201).json(log);

    } catch (error) {
        console.error("Erro ao criar log:", error);

        return res.status(500).json({
            error: "Erro interno ao criar log"
        });
    }
}

module.exports = {
    criarLog
};