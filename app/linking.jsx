import * as Linking from 'expo-linking';

export const linking = {
  prefixes: [
    Linking.createURL('/'),      // your app scheme
    'https://machinestreets.com' // web URL fallback
  ],
  config: {
    screens: {
      '(tabs)': {                // your Tabs layout
        screens: {
          index: '',             // home
          HomePage: 'home',      // mechanics tab
          Profile: 'profile',    // profile tab
        },
      },
      Login: 'login',
      SignUp: 'signup',
      E2: 'e2',
    },
  },
};
