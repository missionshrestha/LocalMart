import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import axios from 'axios';
import { useRouter } from 'next/router';
import { ProductCard, Banner } from '../../components';
import { useAuthContext } from '../../hooks/useAuthContext';
import { calculateDiscount } from '../../utils/calculateDiscount';

const headers = {
  withCredentials: true,
  'Content-Type': 'application/json',
  'Access-Control-Allow-Credentials': true,
};

const baseURL = process.env.NEXT_PUBLIC_BACKEND_API;

const Profile = () => {
  const router = useRouter();
  const { user } = useAuthContext();
  const [products, setProducts] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    axios.get(`${baseURL}/user/${user?.id}/product`, { headers }).then((response) => {
      if (Array.isArray(response.data)) {
        setProducts(response.data);
        console.log(response.data);
      }
      //   setProductCopy(response.data.items);
      setIsLoading(false);
    }).catch((error) => {
      console.log(error);
      setErrorMessage(error);
      setIsLoading(false);
    });
  }, [user]);

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem('user'));
    if (!u) {
      router.push('/', undefined, { shallow: true });
    }
  }, []);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading . . .
      </div>
    );
  }

  return (
    <div className="w-full flex justify-start items-center flex-col min-h-screen">
      <div className="w-full flexCenter flex-col">
        <Banner
          name=""
          childStyles="text-center mb-4"
          parentStyles="h-80 justify-center"
        />

        <div className="flexCenter flex-col -mt-20 z-0">
          <div className="flexCenter w-40 h-40 sm:w-36 sm:h-36 p-1 bg-mart-black-2 rounded-full">
            {user && <Image src={user.profile_img} className="rounded-full object-cover" objectFit="cover" height={300} width={300} />}
          </div>
          <p className="font-montserrat dark:text-white text-mart-black-1 font-semibold text-2xl mt-6">{user?.name}&apos;s Product</p>
        </div>
        {
          products === null
            ? (
              <div className="flexCenter sm:p-4 p-16">
                <h1 className="font-montserrat dark:text-white text-mart-black-1 text-3xl font-extrabold">No Product owned</h1>
              </div>
            )
            : (
              <div className="flex flex-col justify-end sm:px-4 p-12 pt-16">
                <div className="mt-3 w-full flex flex-wrap justify-start md:justify-center">
                  {products?.map((item) => (
                    <ProductCard
                      key={`product-${item.id}`}
                      product={{
                        id: item.id,
                        name: item.title,
                        price: item.price,
                        image: item.image_url[0].url.startsWith('https://') || item.image_url[0].url.startsWith('http://') ? item.image_url[0].url : `https://${item.image_url[0].url}`,
                        discount: item.discount_percentage,
                        discountedPrice: calculateDiscount(item.price, item.discount_percentage),
                        slug: item.slug,
                        category: item.tag,
                      }}
                    />
                  )) }

                </div>
              </div>
            )
        }
      </div>
    </div>
  );
};
export default Profile;
