import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import Link from 'next/link';
import images from '../assets';
import Button from './Button';
import { useAuthContext } from '../hooks/useAuthContext';

const MenuItems = ({ isMobile, active, setActive }) => {
  const generateLink = (i) => {
    switch (i) {
      case 0:
        return '/';
      case 1:
        return '/product';
      case 2:
        return '/categories';
      case 3:
        return '/about';
      case 4:
        return '/contact';
      default:
        break;
    }
  };

  return (
    <ul className={`list-none flexCenter flex-row ${isMobile ? 'flex-col h-full gap-6' : ''}`}>
      {['Home', 'Products', 'Categories', 'About', 'Contact'].map((item, i) => (
        <li key={i} onClick={() => { setActive(item); }} className={`flex flex-row items-center font-montserrat font-normal text-2xl leading-10 dark:hover:text-white hover:text-mart-dark mx-3 ${active === item ? 'dark:text-white text-mart-dark-1' : 'dark:text-mart-gray-3 text-mart-gray-2'}`}>
          <Link href={generateLink(i)}>{item}</Link>
        </li>
      ))}
    </ul>
  );
};

const Navbar = () => {
  const { user } = useAuthContext();
  const { theme, setTheme } = useTheme();
  const [active, setActive] = useState('Home');
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(false);
  }, [router]);

  return (
    <nav className="flex justify-between w-full fixed z-20 py-4 px-10 flex-row border-b dark:bg-mart-dark bg-white dark:border-mart-dark-1 border-mart-gray-1">

      <div className="hidden md:flex ml-2">
        {isOpen ? (<Image src={images.cross} objectFit="contain" width={35} height={35} alt="menu" onClick={() => { setIsOpen(false); }} className={theme === 'dark' ? 'filter invert' : ''} />) : (
          <Image src={images.menu} objectFit="contain" width={35} height={35} alt="menu" onClick={() => { setIsOpen(true); }} className={theme === 'dark' ? 'filter invert' : ''} />
        )}

        {isOpen && (
          <div className="fixed inset-0 top-65 dark:bg-mart-dark bg-white z-10 nav-h flex justify-between flex-col">
            <div className="flex-1 p-4">
              <MenuItems active={active} setActive={setActive} isMobile />
            </div>
            <div className="p-4 border-t dark:border-mart-black-1 border-mart-gray-1">
              <Button
                btnName="Login"
                classStyles="mx-2 rounded-xl sm:w-full"
                handleClick={() => {
                  setActive('');
                  router.push('/login');
                }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-row justify-start md:justify-center">
        <Link href="/">
          <div className="flex justify-center flex-row sm:hidden cursor-pointer" onClick={() => {}}>
            <Image src={theme === 'light' ? images.logo : images.logoDark} objectFit="contain" width={32} height={32} alt="logo" />
            <p className="dark:text-white text-mart-black-1 mt-1 font-bold text-xl ml-1">Local Mart</p>
          </div>
        </Link>
        <Link href="/">
          <div className="hidden sm:flex" onClick={() => {}}>
            <Image src={theme === 'light' ? images.logo : images.logoDark} objectFit="contain" width={32} height={32} alt="logo" />
          </div>
        </Link>
      </div>

      <div className="flex ml-2 justify-center md:hidden">
        {isOpen ? (<Image src={images.cross} objectFit="contain" width={35} height={35} alt="menu" onClick={() => { setIsOpen(false); }} className={theme === 'dark' ? 'filter invert' : ''} />) : (
          <Image src={images.menu} objectFit="contain" width={35} height={35} alt="menu" onClick={() => { setIsOpen(true); }} className={theme === 'dark' ? 'filter invert' : ''} />
        )}

        {isOpen && (
          <div className="fixed inset-0 top-65 dark:bg-mart-dark bg-white z-10 nav-h flex justify-between flex-col">
            <div className="flex-1 p-4">
              <MenuItems active={active} setActive={setActive} isMobile />
            </div>
            <div className="p-4 border-t dark:border-mart-black-1 border-mart-gray-1">
              <Button
                btnName="Login"
                classStyles="mx-2 rounded-xl"
                handleClick={() => {
                  setActive('');
                  router.push('/login');
                }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="md:hidden flex flex-initial flex-row justify-end">
        <div className="flex items-center mr-2">
          <input type="checkbox" className="checkbox" id="checkbox" onChange={() => { setTheme(theme === 'light' ? 'dark' : 'light'); }} />
          <label htmlFor="checkbox" className="flexBetween w-8 h-4 bg-black rounded-2xl p-1 relative label">
            <i className="fas fa-sun" />
            <i className="fas fa-moon" />
            <div className="w-3 h-3 absolute bg-white rounded-full ball" />
          </label>
        </div>
        <div className="ml-3 flex flex-row items-center gap-3">
          <div>
            <Image src={images.cart} className={theme === 'dark' ? 'filter invert' : ''} href="/" alt="cart" />
          </div>
          <div className="h-8 w-8 rounded-full bg-slate-50 flex justify-center items-center">
            { !user ? <Image src={images.profile} className={theme === 'dark' ? 'filter invert' : ''} href="/" alt="profile" /> : (
              <div className="h-8 w-8 rounded-full relative">
                <img src={user.profile_img} className="object-cover h-full rounded-full" />
                <div className="hidden bg-black absolute top-10 w-full">
                  <div>Profile</div>
                  <div onClick={() => {}}>Logout</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="hidden md:flex flex-initial flex-row justify-end">
        <div className="flex items-center mr-2">
          <div className="ml-3 flex flex-row items-center gap-3">
            <div>
              <Image src={images.cart} className={theme === 'dark' ? 'filter invert' : ''} href="/" alt="cart" />
            </div>
            <div>
              {/* <Image src={images.profile} className={theme === 'dark' ? 'filter invert' : ''} href="/" alt="profile" /> */}
              { !user ? <Image src={images.profile} className={theme === 'dark' ? 'filter invert' : ''} href="/" alt="profile" /> : (
                <div className="h-8 w-8 rounded-full relative">
                  <img src={user.profile_img} className="object-cover h-full rounded-full" />
                  <div className="hidden bg-black absolute top-10 w-full">
                    <div>Profile</div>
                    <div onClick={() => {}}>Logout</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* <div className="md:hidden flex">
        <MenuItems active={active} setActive={setActive} />
        <div>
          <Button
            btnName="Login"
            classStyles="mx-2 rounded-xl"
            handleClick={() => {
              setActive('');
              router.push('/login');
            }}
          />
        </div>
      </div> */}

    </nav>
  );
};

export default Navbar;
