import { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';

export const useShopContext = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw Error('useShopContext must be used inside of ShopContextProvider');
  }
  return context;
};
