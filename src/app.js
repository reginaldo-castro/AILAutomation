const express = require("express");

const leadRoutes = require("./routes/leadRoutes");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "AI Lead Automation API"
    });
});

app.use("/leads", leadRoutes);

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`API executando na porta ${PORT}`);
});