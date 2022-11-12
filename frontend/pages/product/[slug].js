import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/router';
import axios from 'axios';
import Button from '../../components/Button';
import images from '../../assets';
import { calculateDiscount } from '../../utils/calculateDiscount';
import { useShopContext } from '../../hooks/useShopContext';

const headers = {
  withCredentials: true,
  'Content-Type': 'application/json',
  'Access-Control-Allow-Credentials': true,
};

const baseURL = process.env.NEXT_PUBLIC_BACKEND_API;

const ProductDetail = () => {
  const [product, setProduct] = useState(null);
  const { qty, setQty, increaseQty, decreaseQty, onAdd } = useShopContext();
  console.log(qty);
  const [imageUrls, setImageUrls] = useState([]);
  const [mainImage, setMainImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { theme } = useTheme();
  const [selected, setSelected] = useState(0);
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) return;
    const { slug } = router.query;
    axios.get(`${baseURL}/product/${slug}`, { headers }).then((response) => {
      // console.log(response.data);
      setProduct(response.data);
      setImageUrls(response.data.image_url);
      setMainImage(response.data.image_url[0].url.startsWith('https://') || response.data.image_url[0].url.startsWith('http://') ? response.data.image_url[0].url : `https://${response.data.image_url[0].url}`);
      setIsLoading(false);
    }).catch((error) => {
      console.log(error);
      setIsLoading(false);
    });
  }, [router.isReady]);

  const updater = (idx) => {
    const newImageUrls = imageUrls.map((im, index) => {
      if (index === idx) {
        return { url: 'https://i.ibb.co/71RgwLQ/default-Product.png' };
      }
      return im;
    });
    setImageUrls(newImageUrls);
    setMainImage(newImageUrls[0].url);
  };

  if (!product) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading . . .
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-end sm:px-4 p-12 pt-16">
      <div className="mt-6 w-full md:hidden flex gap-10 h-96">
        <div className="basis-1/5 flex flex-col flex-wrap gap-2 overflow overflow-x-scroll no-scrollbar">
          {product.image_url.map((item, idx) => (
            <div key={idx} onClick={() => { setSelected(idx); setMainImage(imageUrls[idx].url); }} className={`${selected === idx ? 'border-2 border-logo-green rounded-2xl' : ''} relative w-full h-1/3 hover:border-2 cursor-pointer`}>
              <Image className="rounded-2xl" src={imageUrls[idx].url.startsWith('https://') || imageUrls[idx].url.startsWith('http://') ? imageUrls[idx].url : `https://${imageUrls[idx].url}`} onError={() => { updater(idx); }} layout="fill" objectFit="cover" />
            </div>
          ))}
        </div>
        <div className="border-2 border-logo-green rounded-2xl basis-1/2 relative w-full h-full">
          {product.discount_percentage > 0 && <div className="z-10 absolute bg-red-600 px-2 py-1 rounded-2xl top-4 -right-8 text-white font-montserrat text-sm font-semibold">{product.discount_percentage}% OFF</div>}
          <Image className="rounded-2xl" src={mainImage} layout="fill" objectFit="cover" />
        </div>
        <div className="basis-1/2 flex flex-col justify-center items-center">
          <div className="flex flex-col">
            <p className="text-subtitle-blue italic font-semibold text-base md:mb-4 sm:mb-1 xs:ml-0">- The {product.tags}</p>
            <h1 className="text-4xl font-bold">{product.title}</h1>
            <div className="mt-5 flex">
              <span className="bg-gray-600 px-4 py-2 rounded-2xl text-white font-montserrat text-sm font-semibold">{product.tags.toUpperCase()}</span>
              <div className="flex gap-3 ml-8 text-2xl">
                {product.discount_percentage > 0 && <div className="text text-mart-gray-2 line-through">${product.price}</div>}
                <div className="font-semibold">${calculateDiscount(product.price, product.discount_percentage)}</div>
              </div>
            </div>
            <div className="flex gap-10 items-center mt-8">
              <div className="flex gap-2 items-center text-2xl">
                <Image onClick={decreaseQty} src={images.leftArrow} width={42} objectFit="contain" alt="left-arrow" className={`cursor-pointer hover:scale-105 ${theme === 'dark' ? 'filter invert' : ''}`} />
                <span className="mx-2">{qty}</span>
                <Image onClick={increaseQty} src={images.rightArrow} width={42} objectFit="contain" alt="left-arrow" className={`cursor-pointer hover:scale-105 ${theme === 'dark' ? 'filter invert' : ''}`} />
              </div>
              <Button
                btnName="Add to cart"
                classStyles="text-xl rounded-xl py-3"
                handleClick={() => {
                  onAdd(product, qty, calculateDiscount(product.price, product.discount_percentage));
                  setQty(1);
                // router.push(`${buttonLink}`);
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="hidden mt-6 w-full md:flex flex-col gap-10">
        <div className="flex justify-around h-64">
          <div className="basis-1/4 flex flex-col flex-wrap gap-2 overflow overflow-x-scroll no-scrollbar">
            {product.image_url.map((item, idx) => (
              <div key={idx} onClick={() => { setSelected(idx); setMainImage(imageUrls[idx].url); }} className={`${selected === idx ? 'border-2 border-logo-green rounded-2xl' : ''} bg-white relative w-full h-1/3 hover:border-2 cursor-pointer`}>
                <Image className="rounded-2xl" src={imageUrls[idx].url.startsWith('https://') ? imageUrls[idx].url : `https://${imageUrls[idx].url}`} onError={() => { updater(idx); }} layout="fill" objectFit="contain" />
              </div>
            ))}
          </div>
          <div className="border-2 border-logo-green rounded-2xl basis-1/2 relative w-full h-full">
            {product.discount_percentage > 0 && <div className="z-10 absolute bg-red-600 px-2 py-1 rounded-2xl top-4 -right-8 text-white font-montserrat text-sm font-semibold">{product.discount_percentage}% OFF</div>}
            <Image className="rounded-2xl" src={mainImage} layout="fill" objectFit="contain" />
          </div>
        </div>
        <div className="basis-1/2 flex flex-col justify-center items-center">
          <div className="flex flex-col">
            <p className="text-subtitle-blue italic font-semibold text-base md:mb-4 sm:mb-1 xs:ml-0">- The {product.tags}</p>
            <h1 className="text-4xl font-bold">{product.title}</h1>
            <div className="mt-5 flex">
              <span className="bg-gray-600 px-4 py-2 rounded-2xl text-white font-montserrat text-sm font-semibold">{product.tags.toUpperCase()}</span>
              <div className="flex gap-3 ml-8 text-2xl">
                {product.discount_percentage > 0 && <div className="text text-mart-gray-2 line-through">${product.price}</div>}
                <div className="font-semibold">${calculateDiscount(product.price, product.discount_percentage)}</div>
              </div>
            </div>
            <div className="flex gap-10 items-center mt-8">
              <div className="flex gap-2 items-center text-2xl">
                <Image onClick={decreaseQty} src={images.leftArrow} width={42} objectFit="contain" alt="left-arrow" className={`cursor-pointer hover:scale-105 ${theme === 'dark' ? 'filter invert' : ''}`} />
                <span className="mx-2">{qty}</span>
                <Image onClick={increaseQty} src={images.rightArrow} width={42} objectFit="contain" alt="left-arrow" className={`cursor-pointer hover:scale-105 ${theme === 'dark' ? 'filter invert' : ''}`} />
              </div>
              <Button
                btnName="Add to cart"
                classStyles="text-xl rounded-xl py-3"
                handleClick={() => {
                  onAdd(product, qty, calculateDiscount(product.price, product.discount_percentage));
                  setQty(1);
                  // router.push(`${buttonLink}`);
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-16 p-8 flex sm:flex-col justify-around">
        <div>
          <p className="text-subtitle-blue italic font-semibold text-base md:mb-4 sm:mb-1 xs:ml-0">- The Features</p>
          <h1 className="text-4xl font-bold">Explore the Features</h1>
        </div>
        <div className="flex flex-col gap-10 sm:mt-10">
          {[{ title: 'Natural', subtitle: 'We are using natural ingredients only when creating our products.' }, { title: 'Natural', subtitle: 'We are using natural ingredients only when creating our products.' }].map(() => (
            <div>
              <h1 className="font-semibold text-xl">Natural</h1>
              <h2 className="mt-2">We are using natural ingredients only<br /> when creating our products.</h2>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
