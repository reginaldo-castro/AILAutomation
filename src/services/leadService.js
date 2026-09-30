const pool = require("../config/database");

async function criarLead(dados) {
  const query = `
    INSERT INTO leads (
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
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    ON CONFLICT (idempotency_key)
    WHERE idempotency_key IS NOT NULL
    DO UPDATE SET
        atualizado_em = CURRENT_TIMESTAMP
    RETURNING *;
  `;

    const values = [
        dados.nome,
        dados.email,
        dados.telefone,
        dados.mensagem,
        dados.origem || "desconhecida",
        dados.classificacao,
        dados.intencao,
        dados.urgencia,
        dados.resumo,
        dados.idempotency_key
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

async function atualizarClassificacao(id, dados) {
    const query = `
        UPDATE leads
        SET
            classificacao = $1,
            intencao = $2,
            urgencia = $3,
            resumo = $4,
            atualizado_em = CURRENT_TIMESTAMP
        WHERE id = $5
        RETURNING *;
    `;

    const values = [
        dados.classificacao,
        dados.intencao,
        dados.urgencia,
        dados.resumo,
        id
    ];

    const result = await pool.query(query, values);

    return result.rows[0];
}

module.exports = {
    criarLead,
    listarLeads,
    atualizarClassificacao
};