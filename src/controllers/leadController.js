const leadService = require("../services/leadService");

async function criarLead(req, res) {
    try {
        const {
            nome,
            email,
            telefone,
            mensagem,
            origem
        } = req.body;

        if (!nome || !email || !telefone || !mensagem) {
            return res.status(400).json({
                error: "nome, email, telefone e mensagem são obrigatórios"
            });
        }

        const lead = await leadService.criarLead({
            nome,
            email,
            telefone,
            mensagem,
            origem
        });

        return res.status(201).json(lead);

    } catch (error) {
        console.error("Erro ao criar lead:", error);

        return res.status(500).json({
            error: "Erro interno ao criar lead"
        });
    }
}

async function listarLeads(req, res) {
    try {
        const leads = await leadService.listarLeads();

        return res.status(200).json(leads);

    } catch (error) {
        console.error("Erro ao listar leads:", error);

        return res.status(500).json({
            error: "Erro interno ao listar leads"
        });
    }
}

module.exports = {
    criarLead,
    listarLeads
};