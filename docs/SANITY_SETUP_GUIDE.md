# 🥑 Guia de Configuração: Sanity CMS & Catálogo Multi-Tenant

O **Sanity CMS** é a espinha dorsal de conteúdo, catálogo de produtos e isolamento multi-tenant da plataforma FidelizOn, operando via **Content Lake** com entrega em borda via **Sanity CDN**.

---

## 1. Criar o Projeto no Sanity

1. Se ainda não possui uma conta, crie em [sanity.io](https://www.sanity.io/).
2. No terminal ou via navegador, inicialize o projeto:
   ```bash
   npx sanity@latest init
   ```
3. Escolha o nome do projeto: `fidelizon-cms`.
4. Defina o dataset: `production` (visibilidade pública para leitura).
5. Copie o **Project ID** gerado e adicione ao seu `.env`:
   ```bash
   VITE_SANITY_PROJECT_ID=seu_project_id_aqui
   VITE_SANITY_DATASET=production
   ```

---

## 2. Configurar CORS (Origens Autorizadas)

Para que o aplicativo hospedado no GitHub Pages e o ambiente local consigam consultar a API CDN:

1. Acesse [sanity.io/manage](https://www.sanity.io/manage) e selecione seu projeto.
2. Navegue até **API → CORS Origins → Add CORS origin**.
3. Adicione as seguintes origens:
   - `http://localhost:5173` (Permitir credenciais: Sim)
   - `https://govinda777.github.io` (Permitir credenciais: Não)
   - `https://*.github.io` (Opcional, para ambientes de preview).

---

## 3. Gerar Tokens de Acesso

1. No menu **API → Tokens**, clique em **Add API token**.
2. **Token de Leitura Pública:** Não é necessário criar token para leitura — o dataset `production` público permite que o frontend consuma os dados via Sanity CDN sem expor segredos.
3. **Token de Escrita / Backend (`SANITY_API_WRITE_TOKEN`):**
   - Nome: `FidelizOn Serverless Writer`
   - Permissão: `Editor`
   - **Guarde este token com segurança:** Ele será utilizado pela API Serverless para salvar produtos cadastrados pelos lojistas e provisionar novas lojas.

---

## 4. Schemas do Sanity CMS

Os schemas já estão tipados e padronizados no workspace `packages/sanity-schemas/src/`:
- `tenant.ts`: Configuração da loja, cores, banner, meta de selos e endereços de contrato Web3.
- `product.ts`: Catálogo de produtos com preço em R$ (centavos), custo em selos e flags promocionais.
- `saasPlan.ts`: Planos de assinatura B2B da FidelizOn (limites de selos/paymaster e operadores).
- `campaign.ts`: Cupons sazonais e de Black Friday com estoque e validade.
- `platformConfig.ts`: Conteúdo global do hotsite comercial B2B.

---

## 5. Modo Fallback (Loja Modelo Seed)

Se você estiver executando o FidelizOn localmente ou no GitHub Pages sem configurar as variáveis do Sanity, o sistema detecta a ausência e ativa automaticamente a **Loja Modelo Embutida (`cafeteria-aroma`)**, permitindo testar todas as jornadas de autoatendimento, cartão fidelidade e scanner de caixa sem dependências externas!
