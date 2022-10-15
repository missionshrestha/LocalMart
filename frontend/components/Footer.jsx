import React from 'react';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import images from '../assets';
import Button from './Button';

const FooterLinks = ({ heading, items }) => (
  <div className="flex-1 justify-start items-start">
    <h3 className="font-montserrat dark:text-white text-mart-black-1 font-semibold text-xl mb-10">{heading}</h3>
    {items.map((item, index) => (
      <p key={index} className="font-montserrat dark:text-white text-mart-black-1 font-normal text-base cursor-pointer dark:hover:text-mart-gray-1 hover:text-mart-black-1 my-3">{item}</p>
    ))}
  </div>
);

const Footer = () => {
  const { theme } = useTheme();

  return (

    <footer className="flex justify-center items-center flex-col border-t dark:border-mart-black-1 border-mart-gray-1 sm:py-8 py-16">
      <div className="w-full minmd:w-4/5 flex flex-row md:flex-col sm:px-4 px-16">
        <div className="flex justify-start items-start flex-col">
          <div className="flex items-center justify-center cursor-pointer">
            <Image src={theme === 'light' ? images.logo : images.logoDark} objectFit="contain" width={32} height={32} alt="logo" />
            <p className="dark:text-white text-mart-black-1 mt-1 font-bold text-xl ml-1">Local Mart</p>
          </div>
          <p className="font-montserrat dark:text-white text-mart-black-1 font-semibold text-base mt-6">Get the latest Updates</p>
          <div className="flex items-center justify-start md:w-full minlg:w-557 w-357 mt-6 dark:bg-mart-black-2 bg-white border dark:border-mart-black-2 border-mart-gray-2 rounded-md">
            <input type="email" placeholder="Your Email" className="font-montserrat h-full flex-1 w-full dark:bg-mart-black-2 bg-white  px-4 rounded-md dark:text-white text-mart-black-1 font-normal text-xs minlg:text-lg outline-none" />
            <div className="flex-initial">
              <Button btnName="Email Me" classStyles="rounded-md" />
            </div>
          </div>
        </div>
        <div className="flex-1 flexBetweenStart flex-wrap ml-10 md:ml-0 md:mt-8">
          <FooterLinks heading="Local Mart" items={['Home', 'Categories', 'About', 'Contact']} />
          <FooterLinks heading="Support" items={['Help Center', 'Terms of Service', 'Legal', 'Privacy Policy']} />
        </div>
      </div>
      <div className="flex justify-center items-center  w-full mt-5 dark:border-mart-black-1 border-mart-gray-1 sm:px-4 px-16">
        <div className="flex justify-between items-center w-full minmd:w-4/5 sm:flex-col mt-7 ">
          <p className="font-montserrat dark:text-white text-mart-black-1 font-semibold text-base">Local Mart. All Rights Reserved.</p>
          <div className="flex flex-row sm:mt-4">
            {[images.instagram, images.telegram, images.twitter].map((image, index) => (
              <div className="mx-2 cursor-pointer" key={index}>
                <Image src={image} objectFit="contain" width={24} height={24} className={theme === 'light' ? 'filter invert' : ''} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
