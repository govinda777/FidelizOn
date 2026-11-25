# 🏛️ ADR-001: Adoção de Infraestrutura e Configuração como Código (IaC & CaC)

- **Status:** Aceito (Accepted)
- **Data:** 24/11/2026
- **Decisores:** Time de Engenharia FidelizOn
- **Contexto Técnico:** Plataforma SaaS B2B2C Web3 (Thirdweb, Sanity CMS, Base L2, GitHub Pages)

---

## 1. Contexto e Problema

No início do desenvolvimento da plataforma FidelizOn, o provisionamento de credenciais, origens autorizadas (CORS), parametrização de contratos inteligentes e chaves de API vinha sendo conduzido primordialmente via painéis e interfaces gráficas web (*dashboards* como Thirdweb Dashboard, Sanity Manage e GitHub Settings).

Embora interfaces gráficas sejam intuitivas para descobertas iniciais, elas apresentam limitações críticas para a escala e confiabilidade do software:
1. **Falta de rastreabilidade e versionamento:** Alterações manuais em dashboards não deixam histórico de versão vinculado aos commits da aplicação.
2. **Propensão a falhas humanas (*clickops*):** Erros de digitação em domínios autorizados, esquecimento de tokens ou inconsistência entre ambientes (*staging*, *preview* e *production*).
3. **Onboarding lento:** Novos desenvolvedores precisam navegar manualmente por múltiplos sites para replicar o ambiente.
4. **Impedimento para automação CI/CD:** A ausência de scripts reproduzíveis dificulta esteiras automatizadas de teste e entrega contínua.

---

## 2. Decisão Arquitetural

Decidimos adotar estritamente o princípio de **Infraestrutura como Código (IaC)** e **Configuração como Código (CaC)** em todo o ciclo de vida do projeto FidelizOn:

> **Regra Geral:** Qualquer configuração, provisionamento ou parametrização de infraestrutura que puder ser executada via terminal, CLI ou código **DEVE** ser implementada como código versionado no repositório.

### Diretrizes Específicas por Camada:

1. **Web3 & Blockchain (Thirdweb & Base L2):**
   - Utilização primária da CLI oficial da Thirdweb (`npx thirdweb`) e scripts TypeScript automatizados para deploy, deploy de clones minimal proxies (EIP-1167) e autenticação de máquina (`npx thirdweb login`).
   - Versionamento de endereços de contrato e parametrizações de rede em arquivos de configuração e variáveis de ambiente documentadas.

2. **CMS & Catálogo Multi-Tenant (Sanity):**
   - Utilização da CLI oficial (`npx sanity@latest`) para inicialização, gerenciamento de datasets e deploy de estúdios.
   - Schemas de dados mantidos exclusivamente em TypeScript no pacote versionado `packages/sanity-schemas`.
   - Seed de catálogo e lojas modelo executados via scripts e fixtures de código (`seedStore.ts`).

3. **Esteira de CI/CD & Segredos (GitHub CLI):**
   - Uso de `gh secret set` e scripts de automação para provisionamento de segredos na pipeline de GitHub Actions, evitando edição manual no console web do GitHub.

4. **Ganchos de Qualidade (Git Hooks):**
   - Automação via Husky versionada no repositório (`.husky/pre-commit` para testes de unidade e `.husky/pre-push` para testes integrados/e2e), garantindo que a conformidade do código seja verificada automaticamente em máquina.

---

## 3. Consequências

### Positivas:
- **Reprodutibilidade Total:** Qualquer membro do time ou esteira de CI/CD consegue provisionar e testar o ambiente executando comandos declarativos (`npm install`, `npm test`, `npm run dev`).
- **Auditoria e Governança:** Qualquer alteração de infraestrutura é revisada via Pull Request com diff de código claro.
- **Redução de Incidentes:** Eliminação do risco de drift de configuração entre ambientes de desenvolvimento e produção.
- **Velocidade Operacional:** Comandos automatizados reduzem tarefas de minutos/horas em dashboards para segundos no terminal.

### Desafios / Mitigações:
- **Gestão de Chaves de Autenticação:** A automação via CLI exige autenticação inicial de máquina ou tokens de serviço. *Mitigação:* Utilização de arquivos `.env` locais ignorados pelo Git (`.gitignore`) e injeção segura via GitHub Secrets.
- **Manutenção de Scripts:** Scripts e dependências de CLI devem ser mantidos compatíveis com as versões dos serviços. *Mitigação:* Fixação de versões via `package-lock.json` e execução periódica de testes na esteira de CI.

---

## 4. Referências

- [Guia 100% via Código: Setup Rápido (SETUP_VIA_CODE.md)](./SETUP_VIA_CODE.md)
- [RFC-001: Arquitetura SaaS B2B2C da Plataforma FidelizOn](./rfc_001_arquitetura_saas_b2b2c_da_plataforma_fidelizon.md)
- [Documentação Técnica (TECHNICAL_DOCUMENTATION.md)](../TECHNICAL_DOCUMENTATION.md)
