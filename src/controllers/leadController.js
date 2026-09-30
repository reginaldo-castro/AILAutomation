const leadService = require("../services/leadService");

async function criarLead(req, res) {
    try {
        const {
            nome,
            email,
            telefone,
            mensagem,
            origem,
            classificacao,
            intencao,
            urgencia,
            resumo,
            idempotency_key
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
            origem,
            classificacao,
            intencao,
            urgencia,
            resumo,
            idempotency_key
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

async function atualizarClassificacao(req, res) {
    try {
        const { id } = req.params;

        const {
            classificacao,
            intencao,
            urgencia,
            resumo
        } = req.body;

        const lead = await leadService.atualizarClassificacao(id, {
            classificacao,
            intencao,
            urgencia,
            resumo
        });

        if (!lead) {
            return res.status(404).json({
                erro: "Lead não encontrado"
            });
        }

        return res.json(lead);

    } catch (error) {
        console.error("Erro ao atualizar classificação:", error);

        return res.status(500).json({
            erro: "Erro interno ao atualizar lead"
        });
    }
}

module.exports = {
    criarLead,
    listarLeads,
    atualizarClassificacao
};