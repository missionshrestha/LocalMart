import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { useShopContext } from '../hooks/useShopContext';
import images from '../assets';
import Button from './Button';

const Cart = ({ childrenStyles }) => {
  const { cartItems, setShowCart, onAdd, onRemove, totalPrice } = useShopContext();
  const [firstImage, setFirstImage] = useState([]);
  const { theme } = useTheme();

  useEffect(() => {
    if (cartItems.length > 0) {
      cartItems.forEach((item) => {
        setFirstImage([...firstImage, item.image_url[0].url.startsWith('https://') ? item.image_url[0].url : `https://${item.image_url[0].url}`]);
      });
    }
  }, []);

  return (
    <div className="fixed font-montserrat right-0 left-0 top-0 h-screen w-full bg-mart-black-1 bg-opacity-75 flex justify-end" onClick={() => setShowCart(false)}>
      <div className={`w-5/12 bg-white dark:bg-mart-black-4  px-10 py-10 opacity overflow-y-scroll relative ${childrenStyles}`} onClick={(e) => e.stopPropagation()}>
        {cartItems.length < 1 && (
        <div className="h-full flex justify-center items-center">
          <h1 className="text-2xl">You have more shopping to do.</h1>
        </div>
        )}
        {cartItems.length > 0 && (
        <div className="font-bold text-3xl text-mart-black-1 dark:text-white">
          Items:
        </div>
        )}
        {cartItems.length >= 1 && (
          cartItems.map((item, idx) => (
            <div className="bg-mart-gray-1 dark:bg-mart-black-2 flex items-center justify-start rounded-2xl mt-5 p-2">
              <div className="w-32 h-32 relative">
                {item.image_url && item.image_url.length > 0
                  && (
                  <Image
                    src={firstImage[idx]}
                    onError={() => {
                      const arr = [...firstImage];
                      arr[idx] = images.defaultProduct;
                      setFirstImage(arr);
                    }}
                    layout="fill"
                    objectFit="contain"
                  />
                  )}
              </div>
              <div className="ml-4 w-full">
                <h1 className="font-bold dark:text-white text-mart-black-4">{item.title}</h1>
                <div className="flex items-center justify-between sm:flex-col sm:items-start">
                  <div>
                    {item.discount_percentage > 0
                && <span className="text-mart-gray-2 line-through mr-2">${item.price}</span>}
                    <span>${item.final_discounted_price}</span>
                  </div>
                  <div className="text-sm mr-4">
                    Stock: {item.stock}
                  </div>
                </div>
                <div className="mt-2">
                  <div className="flex gap-2 items-center text-lg">
                    <Image onClick={() => onRemove(item)} src={images.leftArrow} width={26} objectFit="contain" alt="left-arrow" className={`cursor-pointer hover:scale-105 ${theme === 'dark' ? 'filter invert' : ''}`} />
                    <span className="mx-2">{item.quantity}</span>
                    <Image onClick={() => item.stock > item.quantity && onAdd(item, 1, item.final_discounted_price)} src={images.rightArrow} width={26} objectFit="contain" alt="left-arrow" className={`cursor-pointer hover:scale-105 ${theme === 'dark' ? 'filter invert' : ''}`} />
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
        {cartItems.length >= 1 && (
          <div>
            <h3 className="mt-8 font-bold text-mart-black-1">Sutotal: ${totalPrice}</h3>
            <Button btnName="Purchase" classStyles="rounded-md mt-5 w-full py-3 border text-black bg-gray-100 xs:py-2" />
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
