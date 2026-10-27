import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.wagnerjr.mercadofacil',
  appName: 'MercadoFácil',
  webDir: 'dist',
  android: {
    // O app é 100% local; nada de conteúdo misto ou navegação externa
    allowMixedContent: false,
  },
};

export default config;
