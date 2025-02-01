// global.d.ts
declare module '*.png' {
    const value: import('react-native').ImageSourcePropType;
    export default value;
  }
  
  declare module '*.svg' {
    import React from 'react';
    import { SvgProps } from 'react-native-svg';
    const content: React.FC<SvgProps>;
    export default content;
  }
  
  // Pour les variables d'environnement
  declare module '@env' {
    export const API_URL: string;
  }