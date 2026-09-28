function criarLead(dados) {
    const lead = {
        id: 1,
        nome: dados.nome,
        email: dados.email,
        telefone: dados.telefone,
        mensagem: dados.mensagem,
        status: "novo"
    };

    return lead;
}

function listarLeads() {
    return [];
}

module.exports = {
    criarLead,
    listarLeads
};