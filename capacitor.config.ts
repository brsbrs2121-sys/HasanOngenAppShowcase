import type { CapacitorConfig } from '@capacitor/cli';

const isDevServer = process.env.CAP_DEV_SERVER === 'true';

const config: CapacitorConfig = {
  appId: 'com.hasanongen.barber',
  appName: 'Hasan Öngen',
  webDir: 'out',
  bundledWebRuntime: false,

  server: isDevServer
    ? {
        // DEBUG: local Next dev server
        url: 'http://localhost:3000',
        cleartext: true, // HTTP için gerekli
      }
    : {
        // PROD: canlı site
        url: 'https://hasanongen.com',
      },

  ios: {
    contentInset: 'never',
    allowsLinkPreview: false,
    backgroundColor: '#000000', 
  },

  android: {
    
    allowMixedContent: isDevServer ? true : false,
    backgroundColor: '#000000',
  },

  plugins: {
    SplashScreen: {
      launchShowDuration: 0,
      backgroundColor: '#000000', 
      showSpinner: false,
    },
    Camera: {
      allowEditing: false,
      saveToGallery: false,
      presentationStyle: 'fullscreen',
    },
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert'],
    },
  },
};

export default config;
