import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion as m } from 'framer-motion';
import images from '../assets';

const ProductCard = ({ product }) => {
  const [mainImage, setMainImage] = useState(product.image);

  return (
    <Link href={{ pathname: `/product/${product.slug}` }}>
      <m.div
        layout
        animate={{ opacity: 1 }}
        initial={{ opacity: 0 }}
        exit={{ opacity: 0 }}
        transition={{
          opacity: { ease: 'linear' },
          layout: { duration: 0.4 },
        }}
        className="flex-1 min-w-215 max-w-max xs:max-w-none sm:w-full sm:min-w-155 minmd:min-w-256 minlg:min-w-327 bg-banner-light dark:bg-banner-dark rounded-2xl p-4 m-4 minlg:m-8 sm:my-2 sm:mx-2 cursor-pointer shadow-md relative hover:scale-105 transition ease-in-out"
      >
        {product.discount > 0
      && <div className="z-10 absolute bg-red-600 px-2 py-1 rounded-2xl top-5 -right-5 text-white font-montserrat text-sm font-semibold">{product.discount}% OFF</div>}
        {product.isUsed
        && <div className="absolute bg-pink-600 px-2 py-1 rounded-2xl top-14 -right-5 text-white font-montserrat text-sm font-semibold">Used</div>}
        <div className="relative w-full h-52 sm:h-36 xs:h-56 minmd:h-60 minlg:h-300 rounded-2xl overflow-hidden">
          <Image key={`product-${product.id}`} src={mainImage} onError={() => { setMainImage(images.defaultProduct); }} layout="fill" objectFit="cover" alt="product" />
        </div>
        <p className="mt-2 text-lg font-semibold">{product.name}</p>
        <div className="mt-2 flex justify-between">
          <span className="bg-gray-600 px-2 py-1 rounded-2xl text-white font-montserrat text-sm font-semibold">{product.category}</span>
          {product.discount > 0
            ? (
              <div className="flex gap-3">
                <div className="text text-mart-gray-2 line-through">${product.price}</div>
                <div className="font-semibold">${product.discountedPrice}</div>
              </div>
            )
            : (
              <div className="flex gap-3">
                <div className="font-semibold">${product.discountedPrice}</div>
              </div>
            )}

        </div>
      </m.div>
    </Link>
  );
};
export default ProductCard;
