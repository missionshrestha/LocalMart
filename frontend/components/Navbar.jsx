import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import Link from 'next/link';
import { motion as m, AnimatePresence } from 'framer-motion';
import images from '../assets';
import Button from './Button';
import { useAuthContext } from '../hooks/useAuthContext';
import Cart from './Cart';
import { useShopContext } from '../hooks/useShopContext';
import { useLogout } from '../hooks/useLogout';

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
  const { showCart, setShowCart, totalQuantities } = useShopContext();
  const { theme, setTheme } = useTheme();
  const [active, setActive] = useState('Home');
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [toggle, setToggle] = useState(false);
  const { logout } = useLogout();
  useEffect(() => {
    setIsOpen(false);
  }, [router]);

  const handleClick = (item) => {
    switch (item) {
      case 'My Profile':
        break;
      case 'Logout':
        logout();
        router.push('/', undefined, { shallow: true });
        break;
      default:
        break;
    }
  };

  return (
    <nav className="flex justify-between w-full fixed z-20 py-4 px-10 flex-row border-b dark:bg-mart-dark bg-white dark:border-mart-dark-1 border-mart-gray-1">

      <div className="hidden md:flex ml-2">
        {isOpen ? (<Image src={images.cross} objectFit="contain" width={35} height={35} alt="menu" onClick={() => { setIsOpen(false); }} className={theme === 'dark' ? 'filter invert cursor-pointer' : 'cursor-pointer'} />) : (
          <Image src={images.menu} objectFit="contain" width={35} height={35} alt="menu" onClick={() => { setIsOpen(true); }} className={theme === 'dark' ? 'filter invert cursor-pointer' : 'cursor-pointer'} />
        )}
        <AnimatePresence>
          {isOpen && (
          <m.div animate={{ opacity: 1, top: 65 }} initial={{ opacity: 0, top: 0 }} exit={{ opacity: 0 }} transition={{ type: 'spring', stiffness: 100, duration: 2, opacity: { ease: 'linear' } }} className="fixed inset-0 top-65 dark:bg-mart-dark bg-white z-10 nav-h flex justify-between flex-col">
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
          </m.div>
          )}
        </AnimatePresence>
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

        <AnimatePresence>
          {isOpen && (
          <m.div animate={{ opacity: 1, top: 65 }} initial={{ opacity: 0, top: 0 }} exit={{ opacity: 0 }} transition={{ type: 'spring', stiffness: 100, duration: 2, opacity: { ease: 'linear' } }} className="fixed inset-0 top-65 dark:bg-mart-dark bg-white z-10 nav-h flex justify-between flex-col">
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
          </m.div>
          )}
        </AnimatePresence>
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
          <div className="relative">
            {totalQuantities > 0 && <span className="absolute -top-2 -right-1 flex justify-center items-center rounded-full bg-red-500 w-4 h-4 text-sm text-white">{totalQuantities}</span>}
            <Image height={28} width={28} onClick={() => { setShowCart(true); }} src={images.cart} className={theme === 'dark' ? 'filter invert cursor-pointer' : 'cursor-pointer'} href="/" alt="cart" />
          </div>
          <div className="h-8 w-8 rounded-full bg-slate-50 dark:bg-black flex justify-center cursor-pointer items-center" onMouseEnter={() => setToggle(true)} onMouseLeave={() => setTimeout(() => setToggle(false), 1000)}>
            { !user ? (
              <Image
                src={images.profile}
                className={theme === 'dark' ? 'filter invert cursor-pointer' : 'cursor-pointer'}
                href="/"
                alt="profile"
                onClick={() => {
                  setActive('');
                  router.push('/login');
                }}
              />
            ) : (
              <div className="h-8 w-8 rounded-full relative">
                <img src={user.profile_img} className="object-cover h-full rounded-full" />
                {toggle && (
                <m.div animate={{ opacity: 1, left: -128 }} initial={{ opacity: 0, left: -100 }} className="absolute top-full -left-32 right-9 w-40 mt-3 z-10 dark:bg-mart-black-2 bg-white border dark:border-mart-black-2 border-mart-gray-2 py-3 px-4 rounded-md">
                  {
                ['My Profile', 'Logout'].map((item) => (<p className="font-montserrat p-1 px-2 rounded-lg dark:text-white text-mart-black-1 font-semibold text-sm my-3 cursor-pointer hover:bg-logo-green" onClick={() => handleClick(item)} key={item}>{item}</p>))
                  }
                </m.div>
                )}
              </div>
            )}
          </div>
        </div>
        <AnimatePresence>
          { showCart && <Cart />}
        </AnimatePresence>
        {/* <Cart /> */}
      </div>

      <div className="hidden md:flex flex-initial flex-row justify-end">
        <div className="flex items-center mr-2">
          <div className="ml-3 flex flex-row items-center gap-3">
            <div className="relative">
              {totalQuantities > 0 && <span className="absolute -top-2 -right-1 flex justify-center items-center rounded-full bg-red-500 w-4 h-4 text-sm text-white">{totalQuantities}</span>}
              <Image height={28} width={28} onClick={() => { setShowCart(true); }} src={images.cart} className={theme === 'dark' ? 'filter invert cursor-pointer' : 'cursor-pointer'} href="/" alt="cart" />
            </div>
            <div onMouseEnter={() => setToggle(true)} onMouseLeave={() => setTimeout(() => setToggle(false), 1000)}>
              {/* <Image src={images.profile} className={theme === 'dark' ? 'filter invert' : ''} href="/" alt="profile" /> */}
              { !user ? (
                <Image
                  src={images.profile}
                  className={theme === 'dark' ? 'filter invert cursor-pointer' : 'cursor-pointer'}
                  href="/"
                  alt="profile"
                  onClick={() => {
                    setActive('');
                    router.push('/login');
                  }}
                />
              ) : (
                <div className="h-8 w-8 rounded-full relative">
                  <img src={user.profile_img} className="object-cover h-full rounded-full" />
                  {toggle && (
                  <m.div animate={{ opacity: 1, left: -128 }} initial={{ opacity: 0, left: -100 }} className="absolute top-full -left-32 right-9 w-40 mt-3 z-10 dark:bg-mart-black-2 bg-white border dark:border-mart-black-2 border-mart-gray-2 py-3 px-4 rounded-md">
                    {
                ['My Profile', 'Logout'].map((item) => (<p className="font-montserrat p-1 px-2 rounded-lg dark:text-white text-mart-black-1 font-semibold text-sm my-3 cursor-pointer hover:bg-logo-green" onClick={() => handleClick(item)} key={item}>{item}</p>))
                  }
                  </m.div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        <AnimatePresence>
          { showCart && <Cart childrenStyles="w-3/4" />}
        </AnimatePresence>
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
