import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { useShopContext } from '../hooks/useShopContext';
import images from '../assets';

const Cart = ({ childrenStyles }) => {
  const { cartItems, setShowCart, onAdd, decreaseQty, increaseQty } = useShopContext();
  const [firstImage, setFirstImage] = useState([]);
  const { theme } = useTheme();

  useEffect(() => {
    if (cartItems.length > 0) {
      firstImage.forEach((item) => {
        setFirstImage([...firstImage, item.image_url[0].url.startsWith('https://') ? item.image_url[0].url : `https://${item.image_url[0].url}`]);
      });
    }
  }, []);

  return (
    <div className="fixed right-0 left-0 h-screen w-full bg-mart-black-1 bg-opacity-75 flex justify-end" onClick={() => setShowCart(false)}>
      <div className={`w-5/12 bg-white dark:bg-mart-black-4  px-10 py-10 opacity overflow-y-scroll relative ${childrenStyles}`} onClick={(e) => e.stopPropagation()}>
        {cartItems.length < 1 && (
        <div className="h-full flex justify-center items-center">
          <h1>You have more shopping to do.</h1>
        </div>
        )}
        {cartItems.length > 0 && (
        <div>
          Items
        </div>
        )}
        {cartItems.length >= 1 && (
          cartItems.map((item, idx) => (
            <div className="bg-mart-gray-1 flex items-center justify-start rounded-2xl mt-5">
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
              <div>
                <h1 className="font-bold">{item.title}</h1>
                <h3>{item.price}</h3>
                <div>
                  <div className="flex gap-2 items-center text-lg">
                    <Image onClick={decreaseQty} src={images.leftArrow} width={26} objectFit="contain" alt="left-arrow" className={`cursor-pointer hover:scale-105 ${theme === 'dark' ? 'filter invert' : ''}`} />
                    <span className="mx-2">{item.quantity}</span>
                    <Image onClick={increaseQty} src={images.rightArrow} width={26} objectFit="contain" alt="left-arrow" className={`cursor-pointer hover:scale-105 ${theme === 'dark' ? 'filter invert' : ''}`} />
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Cart;
