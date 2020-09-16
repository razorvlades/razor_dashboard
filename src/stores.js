import React from 'react';
import GlobalStore from './stores/global-store';

const storesContext = React.createContext({
  globalStore: new GlobalStore(),
});

export const useStores = () => React.useContext(storesContext)