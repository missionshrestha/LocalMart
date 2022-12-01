import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { motion as m } from 'framer-motion';
import { useShopContext } from '../hooks/useShopContext';
import images from '../assets';
import Button from './Button';

// Animation Variants
const card = {
  hidden: { opacity: 0, scale: 0.8 },
  show: { opacity: 1, scale: 1, transition: { delay: 0.3 } },
};

const cards = {
  hidden: { opacity: 1 },
  show: {
    opacity: 1,
    transition: {
      delayChildren: 0.4, // NOTE
      staggerChildren: 0.2,
    },
  },
};

const submitOrder = (cartItems) => {
  console.log(cartItems);
};

const Cart = ({ childrenStyles }) => {
  const { cartItems, setShowCart, onAdd, onRemove, totalPrice } = useShopContext();
  const [firstImage, setFirstImage] = useState([]);
  const { theme } = useTheme();

  useEffect(() => {
    if (cartItems.length > 0) {
      cartItems.forEach((item) => {
        setFirstImage([...firstImage, item.image_url[0].url.startsWith('https://') || item.image_url[0].url.startsWith('http://') ? item.image_url[0].url : `https://${item.image_url[0].url}`]);
      });
      console.log(cartItems);
    }
  }, []);

  return (
    <m.div
      animate={{ opacity: 1 }}
      initial={{ opacity: 0 }}
      exit={{ opacity: 0 }}
      className="fixed font-montserrat right-0 left-0 top-0 h-screen w-full bg-mart-black-1 bg-opacity-75 flex justify-end"
      onClick={() => setShowCart(false)}
    >
      <m.div initial={{ x: '50%' }} animate={{ x: '0%' }} transition={{ type: 'tween' }} exit={{ x: '50%' }} className={`w-5/12 bg-white dark:bg-mart-black-4  px-10 py-10 opacity overflow-y-scroll relative ${childrenStyles}`} onClick={(e) => e.stopPropagation()}>
        {cartItems.length < 1 && (
        <m.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="h-full flex justify-center items-center">
          <h1 className="text-2xl">You have more shopping to do.</h1>
        </m.div>
        )}
        {cartItems.length > 0 && (
        <div className="font-bold text-3xl text-mart-black-1 dark:text-white">
          Items:
        </div>
        )}
        <m.div layout variants={cards} initial="hidden" animate="show">
          {cartItems.length >= 1 && (
            cartItems.map((item, idx) => (
              <m.div layout variants={card} key={item.id} className="bg-mart-gray-1 dark:bg-mart-black-2 flex items-center justify-start rounded-2xl mt-5 p-2">
                <div className="w-32 h-32 relative">
                  {item.image_url && item.image_url.length > 0
                  && (
                  <Image
                    key={item.id}
                    // src={firstImage[idx]}
                    src={item.image_url[0].url.startsWith('https://') || item.image_url[0].url.startsWith('http://') ? item.image_url[0].url : images.defaultProduct}
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
              </m.div>
            ))
          )}
        </m.div>
        {cartItems.length >= 1 && (
          <m.div layout>
            <h3 className="mt-8 font-bold text-mart-black-1 dark:text-white">Sutotal: ${totalPrice}</h3>
            <Button btnName="Purchase" handleClick={() => submitOrder(cartItems)} classStyles="rounded-md mt-5 w-full py-3 border text-black bg-logo-green xs:py-2" />
          </m.div>
        )}
      </m.div>
    </m.div>
  );
};

export default Cart;
