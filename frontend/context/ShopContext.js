import React, { createContext, useState } from 'react';

export const ShopContext = createContext();

export const ShopContextProvider = ({ children }) => {
  const [qty, setQty] = useState(1);
  return (
    <ShopContext.Provider value={{ qty }}>
      {children}
    </ShopContext.Provider>
  );
};
