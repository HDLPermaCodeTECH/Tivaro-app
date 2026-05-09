import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.tivaroapp.pos',
  appName: 'Tivaro',
  webDir: 'public',
  server: {
    url: 'https://tivaroapp.com/login',
    cleartext: true
  }
};

export default config;
