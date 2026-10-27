# MercadoFácil — Lista e Comparador de Compras

App de lista de compras mensal com comparador de preços entre mercados, Tira-Teima de embalagens,
histórico de gastos e orçamento. **100% offline**: os dados ficam no aparelho (localStorage + IndexedDB).

Stack: React 19, TypeScript (strict), Vite, Tailwind CSS v4, Recharts. Versão Android via Capacitor.

## Desenvolvimento

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # tsc + vite build (saída em dist/)
```

## App Android / Google Play

Veja [PLAY_STORE.md](PLAY_STORE.md): como gerar o AAB, chave de assinatura e checklist da loja.

## Deploy web (PWA)

O site também funciona como PWA (Service Worker em `public/sw.js`) e pode ser publicado na Vercel
(`vercel.json` com headers de segurança). A política de privacidade fica em
`/politica-de-privacidade.html`.
