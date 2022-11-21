import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { ProductCard } from '../../components';
import { calculateDiscount } from '../../utils/calculateDiscount';

const headers = {
  withCredentials: true,
  'Content-Type': 'application/json',
  'Access-Control-Allow-Credentials': true,
};

const baseURL = process.env.NEXT_PUBLIC_BACKEND_API;

const CategoryDetails = () => {
  const router = useRouter();
  const [products, setProducts] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!router.isReady) return;
    const { title } = router.query;
    axios.get(`${baseURL}/categories/${title}`, { headers }).then((response) => {
      // console.log(response.data);
      setProducts(response.data.items);
      setIsLoading(false);
    }).catch((error) => {
      console.log(error);
      setIsLoading(false);
    });
  }, [router.isReady]);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading . . .
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-end sm:px-4 p-12 pt-16">
      <div className="mt-8 flexBetween md:flex-col md:items-start sm:flex-col sm:items-start">
        <div>
          <p className="text-subtitle-blue italic font-semibold text-base md:mb-4 sm:mb-1 ml-4 xs:ml-0">- The Category</p>
          <h1 className="font-montserrat dark:text-white text-mart-black-1 text-3xl minlg:text-4xl xs:text-xl font-bold ml-4 xs:ml-0">{router.query.title.toUpperCase()}</h1>
        </div>
      </div>
      {
          products === null
            ? (
              <div className="flexCenter sm:p-4 p-16">
                <h1 className="font-montserrat dark:text-white text-mart-black-1 text-3xl font-extrabold">No Product Exists on this category</h1>
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
  );
};
export default CategoryDetails;
