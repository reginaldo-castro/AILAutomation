const express = require("express");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "AI Lead Automation API"
    });
});

app.get("/leads", (req, res) => {
    res.json([]);
});

app.post("/leads", (req, res) => {
    const { nome, email, telefone, mensagem } = req.body;

    if (!nome || !email || !telefone || !mensagem) {
        return res.status(400).json({
            error: "nome, email, telefone e mensagem são obrigatórios"
        });
    }

    const lead = {
        id: 1,
        nome,
        email,
        telefone,
        mensagem,
        status: "novo"
    };

    return res.status(201).json(lead);
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`API executando na porta ${PORT}`);
});