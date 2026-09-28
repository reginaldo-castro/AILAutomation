const leadService = require("../services/leadService");

function criarLead(req, res) {
    const { nome, email, telefone, mensagem } = req.body;

    if (!nome || !email || !telefone || !mensagem) {
        return res.status(400).json({
            error: "nome, email, telefone e mensagem são obrigatórios"
        });
    }

    const lead = leadService.criarLead({
        nome,
        email,
        telefone,
        mensagem
    });

    return res.status(201).json(lead);
}

function listarLeads(req, res) {
    const leads = leadService.listarLeads();

    return res.status(200).json(leads);
}

module.exports = {
    criarLead,
    listarLeads
};