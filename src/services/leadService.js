const pool = require("../config/database");

async function criarLead(dados) {
    const query = `
        INSERT INTO leads (
            nome,
            email,
            telefone,
            mensagem,
            origem
        )
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
    `;

    const values = [
        dados.nome,
        dados.email,
        dados.telefone,
        dados.mensagem,
        dados.origem || "desconhecida"
    ];

    const result = await pool.query(query, values);

    return result.rows[0];
}

async function listarLeads() {
    const query = `
        SELECT *
        FROM leads
        ORDER BY criado_em DESC;
    `;

    const result = await pool.query(query);

    return result.rows;
}

module.exports = {
    criarLead,
    listarLeads
};