import React, { useEffect, useState } from 'react';
import axios from 'axios';
import images from '../../assets';
import { Category } from '../../components';

const baseURL = process.env.NEXT_PUBLIC_BACKEND_API;

const headers = {
  withCredentials: true,
  'Content-Type': 'application/json',
  'Access-Control-Allow-Credentials': true,
};

const CategoryHome = () => {
  const [category, setCategory] = useState(null);

  useEffect(() => {
    axios.get(`${baseURL}/categories`, { headers }).then((response) => {
      setCategory(response.data);
    }).catch((e) => {
      setCategory([{ tag_name: 'Error' }]);
      console.log(e);
    });
  }, []);

  const [numberOfProducts, setnumberOfProducts] = useState(null);

  const getNumberOfProducts = (title) => {
    axios.get(`${baseURL}/categories/${title}`, { headers }).then((response) => {
      setnumberOfProducts(response.data.items.length);
    }).catch((e) => {
      console.log(e);
    });
  };

  /* const category = [{
    tag_name: 'Food',
  },
  {
    tag_name: 'Phone',
  },
  {
    tag_name: 'Food',
  },
  {
    tag_name: 'Phone',
  }, {
    tag_name: 'Food',
  },
  {
    tag_name: 'Phone',
  }, {
    tag_name: 'Food',
  },
  {
    tag_name: 'Phone',
  }, {
    tag_name: 'Food',
  },
  {
    tag_name: 'Phone',
  }, {
    tag_name: 'Food',
  },
  {
    tag_name: 'Phone',
  }, {
    tag_name: 'Food',
  },
  {
    tag_name: 'Phone',
  },
  {
    tag_name: 'Phone',
  },
  ]; */

  return (
    <>
      {numberOfProducts !== null
            && (
            <div className="absolute pt-20 flex w-full justify-center ">
              <h1 className="bg-green-400 border rounded-md"> We have {numberOfProducts} varities of products for you </h1>
            </div>
            )}
      <div className="p-10 pt-28 flex  flex-wrap w-full justify-center">

        {category?.map((item, i) => (
          <div onMouseEnter={() => getNumberOfProducts(item.tag_name)} onMouseLeave={() => setnumberOfProducts(null)}>

            <Category key={i} logo={images.logoDark} title={item.tag_name} />
          </div>
        ))}
      </div>
    </>
  );
};

export default CategoryHome;
