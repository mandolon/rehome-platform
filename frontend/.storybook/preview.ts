import '../src/styles/globals.css';

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: { matchers: { color: /(background|color)$/i, date: /Date$/ } },
  backgrounds: { 
    default: 'light', 
    values: [
      { name: 'light', value: '#ffffff' }, 
      { name: 'dark', value: '#0b0b0b' }
    ] 
  }
};

export const globalTypes = {
  theme: {
    description: 'Theme',
    defaultValue: 'light',
    toolbar: { 
      title: 'Theme', 
      items: [
        { value: 'light', title: 'Light' }, 
        { value: 'dark', title: 'Dark' }
      ] 
    }
  }
};