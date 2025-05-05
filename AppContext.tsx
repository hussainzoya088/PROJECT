// src/context/AppContext.tsx
import React, { createContext, useContext, useState } from 'react';

interface AppContextType {
  state: any;
  setState: React.Dispatch<React.SetStateAction<any>>;
  preferences?: any;
  addToast?: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState({});

  const addToast = (msg: string, type: 'success' | 'error' | 'info' = 'info') => {
    console.log(`[${type.toUpperCase()}] ${msg}`);
  };

  const preferences = {
    theme: 'light',
    currency: 'INR'
  };

  return (
    <AppContext.Provider value={{ state, setState, addToast, preferences }}>
      {children}
    </AppContext.Provider>
  );
};
