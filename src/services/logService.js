const pool = require("../config/database");

async function criarLog({ workflow, status, mensagem }) {
    const query = `
        INSERT INTO automation_logs (
            workflow,
            status,
            mensagem
        )
        VALUES ($1, $2, $3)
        RETURNING *;
    `;

    const values = [
        workflow,
        status,
        mensagem
    ];

    const result = await pool.query(query, values);

    return result.rows[0];
}

module.exports = {
    criarLog
};