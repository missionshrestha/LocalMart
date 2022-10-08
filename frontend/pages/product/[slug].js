import React, { useState } from 'react';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import Button from '../../components/Button';
import images from '../../assets';

const ProductDetail = () => {
  const { theme } = useTheme();
  const [selected, setSelected] = useState(0);
  //   const { query } = useRouter();
  // fetch graphql data

  return (
    <div className="flex flex-col justify-end sm:px-4 p-12 pt-16">
      <div className="mt-6 w-full md:hidden flex gap-10 h-96">
        <div className="basis-1/5 flex flex-col flex-wrap gap-2 overflow overflow-x-scroll no-scrollbar">
          {[1, 2, 3, 4].map((item, idx) => (
            <div onClick={() => { setSelected(idx); }} className={`${selected === idx && 'border-2 border-logo-green rounded-2xl'} relative w-full h-1/3 hover:border-2 cursor-pointer`}>
              <Image className="rounded-2xl" src="https://i.ibb.co/82qS39N/RE4LiWr.jpg" layout="fill" objectFit="cover" />
            </div>
          ))}
        </div>
        <div className="border-2 border-logo-green rounded-2xl basis-1/2 relative w-full h-full">
          <div className="z-10 absolute bg-red-600 px-2 py-1 rounded-2xl top-4 -right-8 text-white font-montserrat text-sm font-semibold">50% OFF</div>
          <Image className="rounded-2xl" src="https://i.ibb.co/82qS39N/RE4LiWr.jpg" layout="fill" objectFit="cover" />
        </div>
        <div className="basis-1/2 flex flex-col justify-center items-center">
          <div className="flex flex-col">
            <p className="text-subtitle-blue italic font-semibold text-base md:mb-4 sm:mb-1 xs:ml-0">- The Electronics</p>
            <h1 className="text-4xl font-bold">Dell XP13 Laptop</h1>
            <div className="mt-5 flex">
              <span className="bg-gray-600 px-4 py-2 rounded-2xl text-white font-montserrat text-sm font-semibold">GADGET</span>
              <div className="flex gap-3 ml-8 text-2xl">
                <div className="text text-mart-gray-2 line-through">$1500</div>
                <div className="font-semibold">$725</div>
              </div>
            </div>
            <div className="flex gap-10 items-center mt-8">
              <div className="flex gap-2 items-center text-2xl">
                <Image onClick={() => { }} src={images.leftArrow} width={42} objectFit="contain" alt="left-arrow" className={`cursor-pointer hover:scale-105 ${theme === 'dark' && 'filter invert'}`} />
                <span className="mx-2">1</span>
                <Image onClick={() => { }} src={images.rightArrow} width={42} objectFit="contain" alt="left-arrow" className={`cursor-pointer hover:scale-105 ${theme === 'dark' && 'filter invert'}`} />
              </div>
              <Button
                btnName="Add to cart"
                classStyles="text-xl rounded-xl py-3"
                handleClick={() => {
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
            {[1, 2, 3, 4].map((item, idx) => (
              <div onClick={() => { setSelected(idx); }} className={`${selected === idx && 'border-2 border-logo-green rounded-2xl'} bg-white relative w-full h-1/3 hover:border-2 cursor-pointer`}>
                <Image className="rounded-2xl" src="https://i.ibb.co/82qS39N/RE4LiWr.jpg" layout="fill" objectFit="contain" />
              </div>
            ))}
          </div>
          <div className="border-2 border-logo-green rounded-2xl basis-1/2 relative w-full h-full">
            <div className="z-10 absolute bg-red-600 px-2 py-1 rounded-2xl top-4 -right-8 text-white font-montserrat text-sm font-semibold">50% OFF</div>
            <Image className="rounded-2xl" src="https://i.ibb.co/82qS39N/RE4LiWr.jpg" layout="fill" objectFit="contain" />
          </div>
        </div>
        <div className="basis-1/2 flex flex-col justify-center items-center">
          <div className="flex flex-col">
            <p className="text-subtitle-blue italic font-semibold text-base md:mb-4 sm:mb-1 xs:ml-0">- The Electronics</p>
            <h1 className="text-4xl font-bold">Dell XP13 Laptop</h1>
            <div className="mt-5 flex">
              <span className="bg-gray-600 px-4 py-2 rounded-2xl text-white font-montserrat text-sm font-semibold">GADGET</span>
              <div className="flex gap-3 ml-8 text-2xl">
                <div className="text text-mart-gray-2 line-through">$1500</div>
                <div className="font-semibold">$725</div>
              </div>
            </div>
            <div className="flex gap-10 items-center mt-8">
              <div className="flex gap-2 items-center text-2xl">
                <Image onClick={() => { }} src={images.leftArrow} width={42} objectFit="contain" alt="left-arrow" className={`cursor-pointer hover:scale-105 ${theme === 'dark' && 'filter invert'}`} />
                <span className="mx-2">1</span>
                <Image onClick={() => { }} src={images.rightArrow} width={42} objectFit="contain" alt="left-arrow" className={`cursor-pointer hover:scale-105 ${theme === 'dark' && 'filter invert'}`} />
              </div>
              <Button
                btnName="Add to cart"
                classStyles="text-xl rounded-xl py-3"
                handleClick={() => {
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
