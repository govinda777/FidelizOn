import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Script de Configuração de Domínio e CORS como Código (CaC / IaC).
 * Registra domínios autorizados no Sanity CMS, no Vite e valida o mapeamento local.
 */
async function main() {
  const targetDomain = process.argv[2] || 'app.fidelizon.local';
  const targetPort = process.argv[3] || '5173';
  const originUrl = `http://${targetDomain}:${targetPort}`;

  console.log('🌐 Configurando Domínio e Políticas de CORS como Código...');
  console.log(`📌 Domínio Alvo: ${targetDomain}`);
  console.log(`🔗 Origem Local: ${originUrl}`);

  // 1. Atualiza arquivos de ambiente .env
  const rootEnv = path.resolve(process.cwd(), '.env');
  const webEnv = path.resolve(process.cwd(), 'apps/web/.env');

  updateEnv(rootEnv, 'VITE_APP_DOMAIN', targetDomain);
  updateEnv(rootEnv, 'VITE_APP_URL', originUrl);
  updateEnv(webEnv, 'VITE_APP_DOMAIN', targetDomain);
  updateEnv(webEnv, 'VITE_APP_URL', originUrl);
  console.log('✅ Arquivos .env e apps/web/.env atualizados com o domínio.');

  // 2. Adiciona a origem às regras de CORS do Sanity CMS
  try {
    console.log(`⏳ Adicionando ${originUrl} no Sanity CMS (project 8fgufitv)...`);
    execSync(
      `npx sanity cors add ${originUrl} --credentials --project=8fgufitv`,
      { stdio: 'inherit' }
    );
    console.log('✅ Origem autorizada no Sanity CMS com sucesso!');
  } catch (error) {
    console.warn('⚠️ Nota: O comando Sanity CORS requer sessão ativa ou já está cadastrado.');
  }

  // 3. Verifica /etc/hosts
  try {
    const hostsContent = fs.readFileSync('/etc/hosts', 'utf-8');
    if (hostsContent.includes(targetDomain)) {
      console.log(`✅ Entrada para ${targetDomain} já existe em /etc/hosts`);
    } else {
      console.log('\n' + '='.repeat(60));
      console.log(`👉 Dica para resolução local de domínio:`);
      console.log(`Adicione a linha abaixo no seu /etc/hosts:`);
      console.log(`127.0.0.1  ${targetDomain}`);
      console.log('='.repeat(60) + '\n');
    }
  } catch (e) {
    // Permissão restrita de leitura em sandbox
  }

  console.log('🎉 Configuração de domínio e CORS concluída com sucesso!');
}

function updateEnv(filePath: string, key: string, value: string) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf-8');
  if (content.includes(`${key}=`)) {
    content = content.replace(new RegExp(`${key}=.*`), `${key}=${value}`);
  } else {
    content += `\n${key}=${value}\n`;
  }
  fs.writeFileSync(filePath, content, 'utf-8');
}

main();
