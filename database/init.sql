
CREATE TABLE leads (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    email VARCHAR(255),
    telefone VARCHAR(30),
    mensagem TEXT,
    status VARCHAR(30) DEFAULT 'novo',
    origem VARCHAR(50),
    criado_em TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS automation_logs (
    id BIGSERIAL PRIMARY KEY,
    workflow VARCHAR(100) NOT NULL,
    status VARCHAR(30) NOT NULL,
    mensagem TEXT,
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

--  docker exec -it ai-lead-postgres psql   -U lead_user   -d lead_automation_db