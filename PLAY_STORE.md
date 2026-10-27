# Publicação na Google Play — MercadoFácil

O app é um projeto web (React + Vite) empacotado como app Android com **Capacitor**. Os arquivos
do site ficam dentro do APK/AAB, então ele funciona 100% offline e não depende de nenhum servidor.

- Pacote (applicationId): `com.wagnerjr.mercadofacil` — **definitivo depois da primeira publicação**
- Versão atual: `versionName 1.0.0` / `versionCode 1` (em `android/app/build.gradle`)
- targetSdk 36, minSdk 24 (Android 7.0+)

## Gerar um novo pacote para enviar

Requisitos: Node 22+, Android SDK e **JDK 21** (o JDK 25 do Android Studio não funciona com o Gradle atual).

```bash
npm install
npm run build              # compila o site (tsc + vite)
npx cap sync android       # copia o site para dentro do projeto Android
cd android
# Windows (Git Bash), ajuste o caminho do JDK 21:
export JAVA_HOME="/c/Users/Wagner/.jdks/jdk-21.0.12.1+1"
./gradlew.bat bundleRelease      # gera o AAB para a Play Store
./gradlew.bat assembleRelease    # (opcional) APK assinado para instalar direto no celular
```

Saídas:
- AAB (enviar para a Play Console): `android/app/build/outputs/bundle/release/app-release.aab`
- APK assinado: `android/app/build/outputs/apk/release/app-release.apk`
- APK de teste: `./gradlew.bat assembleDebug` → `android/app/build/outputs/apk/debug/app-debug.apk`

**A cada nova versão enviada**, aumente `versionCode` (+1) e ajuste `versionName` em `android/app/build.gradle`.

## Chave de assinatura (IMPORTANTE)

A chave de upload foi criada em `android/keystore/mercadofacil-upload.jks`, com a senha em
`android/keystore.properties`. **Os dois estão fora do git** (de propósito).

- Faça **backup dos dois arquivos** em lugar seguro (pen drive, nuvem privada, gerenciador de senhas).
- Na Play Console, ative o **Play App Signing** (padrão para apps novos). Com ele, essa chave é só a
  "chave de upload": se você perdê-la, é possível pedir um reset ao Google. Sem backup e sem App Signing,
  não dá mais para atualizar o app.

## Checklist da Play Console

1. **Criar o app** (nome: MercadoFácil, idioma padrão: Português (Brasil), tipo: App, gratuito).
2. **Política de privacidade**: o arquivo `public/politica-de-privacidade.html` vai junto com o site.
   - E-mail de contato já preenchido na página: wagner1junior1@gmail.com.
   - URL a informar na Play Console: `https://iistacomprasfacil.vercel.app/politica-de-privacidade.html` (só funciona depois que este código for publicado na Vercel).
3. **Segurança dos dados (Data safety)**:
   - Coleta ou compartilha dados do usuário? **Não**.
   - (O app não tem permissão de internet, anúncios nem analytics; a câmera é só para foto opcional, guardada no aparelho.)
4. **Classificação de conteúdo**: responda o questionário (app utilitário, sem violência, sem compras, sem conteúdo gerado por usuários compartilhado) → deve resultar em "Livre".
5. **Público-alvo**: 18+ / público geral (não é voltado a crianças).
6. **Anúncios**: não contém anúncios.
7. **Categoria**: Compras ou Finanças/Produtividade. Contato (e-mail) obrigatório.
8. **Ficha da loja** — materiais prontos em `play-store/`:
   - Ícone 512×512: `play-store/icon-512.png`
   - Imagem de destaque 1024×500: `play-store/feature-graphic-1024x500.png`
   - Capturas de tela de celular (mínimo 2): `play-store/screenshots/` (1080×1920, 9:16)
9. **Testes obrigatórios para conta pessoal nova**: contas de desenvolvedor pessoais criadas depois de
   nov/2023 precisam rodar um **teste fechado com pelo menos 12 testadores por 14 dias seguidos**
   antes de pedir acesso à produção. Confira as regras atuais na Play Console, pois mudam.
10. Envie o `.aab` na trilha de teste (ou produção, se liberada) e preencha as notas da versão.

## Textos sugeridos para a ficha

**Título (máx. 30):** MercadoFácil: Lista de Compras

**Descrição curta (máx. 80):**
Lista de compras e comparador de preços entre mercados. 100% offline.

**Descrição completa:**
```
O MercadoFácil organiza suas compras do mês e ajuda você a gastar menos — sem internet e sem cadastro.

• Várias listas: mercado, feira, churrasco… cada uma separada.
• Catálogo com mais de 450 produtos para adicionar em poucos toques.
• Marque no carrinho e acompanhe o total em tempo real.
• Comparador de preços: veja em qual mercado sua cesta sai mais barata.
• Tira-Teima de Preço: compare embalagens (g/kg, ml/L) e descubra qual compensa mais.
• Histórico de compras e orçamento mensal com gráficos de gastos.
• Exporte para planilha (Excel/Google Planilhas) e faça backup dos seus dados.
• Modo escuro.

Privacidade em primeiro lugar: tudo fica salvo só no seu celular. O app não tem anúncios, não pede login e não envia nenhum dado.
```

## Antes de publicar de verdade

- Teste o APK em um celular real (`app-release.apk`): lista, finalizar compra com 2 listas, Tira-Teima,
  exportar CSV, backup/restauração, foto de produto, modo escuro.
- O reconhecimento de voz (botão de microfone ao criar item) depende do navegador e **não funciona dentro
  do app Android**; o app avisa para digitar. Se quiser, esse botão pode ser escondido na versão Android.
