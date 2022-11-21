import React from 'react';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/router';
import Button from './Button';

const Banner = ({ parentStyles, childStyles, name, subtitle, buttonLink }) => {
  const { theme } = useTheme();
  const router = useRouter();

  return (
    <div className={`relative w-full flex flex-col items-start z-0 overflow-hidden ${theme === 'light' ? 'bg-banner-light' : 'bg-banner-dark'} ${parentStyles}`}>
      <p className="text-subtitle-blue italic font-semibold text-base md:mb-4 sm:mb-2">{subtitle}</p>
      <p className={`font-bold text-5xl font-montserrat leading-70 ${childStyles}`}>
        {name}
      </p>
      {name.length > 0
      && (
      <Button
        btnName="Shop Now"
        classStyles="text-xl rounded-xl mt-5 sm:mt-4"
        handleClick={() => {
          router.push(`${buttonLink}`);
        }}
      />
      )}
    </div>
  );
};

export default Banner;
