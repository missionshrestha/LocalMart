import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const Category = ({ title, logo }) => (
  <div className="flex flex-col justify-center bg-banner-light w-32 p-7 cursor-pointer mr-8 my-4 rounded-2xl dark:bg-banner-dark">
    <Link href={`/category/${title.toLowerCase()}`}>
      <div className="flex flex-col justify-center items-center">
        <Image src={logo} height={32} width={32} href="#" alt="logo" />
        <h1 className="text-xl mt-4 font-semibold">{title}</h1>
      </div>
    </Link>
  </div>
);

export default Category;
