import React from 'react';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import images from '../../assets';
import { ProductCard } from '../../components';

const Product = () => {
  const { theme } = useTheme();
  return (
    <div className="flex flex-col justify-end sm:px-4 p-12 pt-16">
      <div className="mt-8 flexBetween sm:flex-col sm:items-start">
        <div>
          <p className="text-subtitle-blue italic font-semibold text-base md:mb-4 sm:mb-1 ml-4 xs:ml-0">- Our Products</p>
          <h1 className="font-montserrat dark:text-white text-mart-black-1 text-3xl minlg:text-4xl xs:text-xl font-bold ml-4 xs:ml-0">Explore our Products</h1>
        </div>
        <div className="flex gap-2">
          <Image onClick={() => { }} src={images.leftArrow} width={32} objectFit="contain" alt="left-arrow" className={`cursor-pointer hover:scale-105 ${theme === 'dark' ? 'filter invert' : ''}`} />
          <Image onClick={() => { }} src={images.rightArrow} width={32} objectFit="contain" alt="left-arrow" className={`cursor-pointer hover:scale-105 ${theme === 'dark' ? 'filter invert' : ''}`} />
        </div>
      </div>
      <div className="mt-3 w-full flex flex-wrap justify-start md:justify-center">
        {[1, 2, 3, 4, 5].map((i) => (
          <ProductCard
            key={`product-${i}`}
            product={{
              i,
              name: 'Demo Product 1',
              price: 100,
              image: 'https://i.ibb.co/2gsWw7b/Product.png',
              discount: 50,
              discountedPrice: 50,
              category: 'Cloth',
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Product;
