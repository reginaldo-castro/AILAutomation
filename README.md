## Documentação — AI Lead Automation

## 1. Objetivo

## Desenvolver uma automação para recebimento e processamento de leads, integrando API

REST, PostgreSQL, n8n, Ollama e Slack.

## O workflow recebe o lead, valida os dados, utiliza IA para classificar o interesse comercial e

persiste o resultado. Também possui mecanismos de retry, idempotência, logs e alertas de erro.

## Arquitetura

## Cliente / Origem do Lead
│
▼
n8n
│
├── Validação
│
├── PostgreSQL
│
├── Ollama / Llama 3.2
│
├── Validação da resposta da IA
│
├── Logs
│
└── Slack

## 2. Fluxo principal

## Webhook
│
▼
## Edit Fields
│
▼
## IF — Lead válido?
│
├── NÃO ──► Logs ──► Alerta ──► Slack
│
└── SIM
│
├──► POST /leads
│
└──► Ollama / Llama 3.2
│
▼
## Validação da IA
│
┌─────┴─────┐
│           │

## VÁLIDA       INVÁLIDA
│             │
▼             ▼

## Atualiza Lead    Logs
│             │
▼             ▼

## Logs         Alerta
│
▼
## Slack

## 3. API REST

A aplicação Node.js/Express disponibiliza endpoints para integração com o workflow.

## Criar lead
## POST /leads

Recebe:

{
"nome": "Marcos Oliveira",
"email": "marcos@email.com",
"telefone": "92991112233",
"mensagem": "Gostaria de saber o preço e como posso contratar o serviço",
"origem": "meta_ads",
"idempotency_key": "258"
}

## Atualizar classificação

## PATCH /leads/:id

Atualiza:
{
"classificacao": "morno",
"intencao": "informacao",
"urgencia": "baixa",
"resumo": "..."
}

## Registrar log
## POST /logs

## 4. Processamento com IA
Foi utilizado Ollama com Llama 3.2 para processamento local.
A IA recebe a mensagem do lead e retorna uma estrutura padronizada:
{
"classificacao": "morno",
"intencao": "informacao",
"urgencia": "baixa",
"resumo": "Resumo objetivo do interesse demonstrado pelo lead"
}

As categorias são controladas pelo workflow:

## Campo                    Valores permitidos

## Classificação    quente, morno, frio

## Intenção        orcamento, informacao, compra, outro

## Urgência        alta, media, baixa

## 5. Validação da resposta da IA

## A resposta do LLM não é considerada confiável automaticamente. Antes da persistência, o n8n

verifica se os valores retornados pertencem às categorias permitidas.

Exemplo:

["quente", "morno", "frio"].includes($json.classificacao)
&& ["orcamento", "informacao", "compra", "outro"].includes($json.intencao)
&& ["alta", "media", "baixa"].includes($json.urgencia)

Se a resposta for inválida:

## IA inválida
↓
## Log
↓
## Alerta
↓
## Slack

Isso evita persistir uma resposta inesperada do modelo.

## 6. Idempotência

## Foi implementada uma idempotency_key para evitar duplicação de leads quando uma mesma

requisição é processada novamente.

No PostgreSQL:

## CREATE UNIQUE INDEX idx_leads_idempotency_key
## ON leads(idempotency_key)
WHERE idempotency_key IS NOT NULL;

A criação utiliza:

## ON CONFLICT (idempotency_key)
## WHERE idempotency_key IS NOT NULL
## DO UPDATE SET
atualizado_em = CURRENT_TIMESTAMP;

## Resultado

O mesmo lead enviado novamente com:

idempotency_key = 258
continua associado ao mesmo registro.
Isso é especialmente importante porque o workflow possui retry.

## 7. Retry
Para falhas temporárias HTTP, o n8n foi configurado com:
## Retry On Fail: ON

## Tentativas: 3
## Intervalo: 2000 ms
Exemplo:

## Requisição
↓
## HTTP 500
↓
## Retry
↓
## HTTP 500
↓
## Retry
↓
## HTTP 500
↓
## Tratamento de erro

A idempotência protege contra duplicação caso uma tentativa anterior tenha sido processada, mas a resposta tenha falhado.

## 8. Logs
Foi criada a tabela automation_logs com os campos:
workflow
status
mensagem
criado_em
Exemplo de erro registrado:
{
"workflow": "lead_automation",
"status": "500",
"mensagem": "Falha ao processar lead 256: HTTP 500"
}

Isso permite rastrear falhas do workflow posteriormente.

## 9. Alertas no Slack

Quando ocorre uma falha, o workflow gera um alerta contendo:

🚨 ERRO NA AUTOMAÇÃO
## Workflow: lead_automation
## Tipo: HTTP
## Status HTTP: 500
## Mensagem: Falha HTTP no processamento do lead
## Idempotency Key: 256
Timestamp: ...
## Origem: n8n

O alerta é enviado para o canal:
#auto-crm

Assim, o erro não fica somente registrado no banco: a equipe também é notificada.

## 10. Testes realizados

Foram realizados testes para validar os principais cenários:

## Cenário                    Resultado
## Lead válido                                  ✅
## Lead inválido                                ✅
## Classificação com IA                         ✅
## Resposta inválida da IA                      ✅
## Persistência PostgreSQL                      ✅
## Atualização do lead                          ✅
## Retry HTTP                                   ✅
## Idempotência                                 ✅
## Log de erro                                  ✅
## Alerta Slack                                 ✅
## Fluxo completo n8n → API → IA → PostgreSQL   ✅


## 11. Resultado
## O projeto demonstra uma arquitetura de automação com características próximas de um ambiente de produção:

## Integração
+
## IA
+
## Persistência
+
## Validação
+
## Retry
+
## Idempotência
+
## Logs
+
## Alertas