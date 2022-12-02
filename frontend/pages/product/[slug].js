import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/router';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-toastify';
import Button from '../../components/Button';
import images from '../../assets';
import { calculateDiscount } from '../../utils/calculateDiscount';
import { useShopContext } from '../../hooks/useShopContext';
import { useAuthContext } from '../../hooks/useAuthContext';
import { Input, Modal } from '../../components';

const headers = {
  withCredentials: true,
  'Content-Type': 'application/json',
  'Access-Control-Allow-Credentials': true,
};

const baseURL = process.env.NEXT_PUBLIC_BACKEND_API;

const uploadToCloudinary = async (image) => {
  const data = new FormData();
  data.append('file', image);
  data.append('upload_preset', 'localmart');
  data.append('cloud_name', 'dcmsjwslq');
  const res = await fetch('https://api.cloudinary.com/v1_1/dcmsjwslq/image/upload', {
    method: 'post',
    body: data,
  });

  const result = await res.json();
  // console.log(result.url);
  return result.url;
};

const ProductDetail = () => {
  const { user } = useAuthContext();
  const [product, setProduct] = useState(null);
  const [productCopy, setProductCopy] = useState(null);
  const [validationMessage, setValidationMessage] = useState({ title: '', description: '', price: '', discount_percentage: '', stock: '' });
  const [activeSelect, setActiveSelect] = useState('None');
  const [toggle, setToggle] = useState(false);
  const [category, setCategory] = useState([]);
  const [fileUrl, setFileUrl] = useState([]);
  const [feature, setFeature] = useState([{ tite: '', description: '' }]);
  const [creator, setCreator] = useState(null);
  const [error, setError] = useState(null);
  const { qty, setQty, increaseQty, decreaseQty, onAdd } = useShopContext();
  console.log(qty);
  const [imageUrls, setImageUrls] = useState([]);
  const [mainImage, setMainImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { theme } = useTheme();
  const [selected, setSelected] = useState(0);
  const router = useRouter();
  const [updateModal, setUpdateModal] = useState(false);

  useEffect(() => {
    axios.get(`${baseURL}/categories`, { headers }).then((response) => {
      const result = response.data?.map((a) => a.tag_name);
      setCategory(result);
      console.log(category);
    }).catch((e) => {
      setCategory(['Error']);
      console.log(e);
    });
  }, []);

  useEffect(() => {
    if (!router.isReady) return;
    const { slug } = router.query;
    axios.get(`${baseURL}/product/${slug}`, { headers }).then((response) => {
      // console.log(response.data);
      setProduct(response.data);
      setProductCopy(response.data);
      setActiveSelect(response.data.tag);
      setImageUrls(response.data.image_url);
      setFileUrl(response.data.image_url.map(({ url }) => url));
      setFeature(response.data.product_feature);
      setMainImage(response.data.image_url[0].url.startsWith('https://') || response.data.image_url[0].url.startsWith('http://') ? response.data.image_url[0].url : `https://${response.data.image_url[0].url}`);
      setIsLoading(false);
    }).catch((err) => {
      console.log(err);
      setIsLoading(false);
    });
  }, [router.isReady]);

  useEffect(() => {
    if (product) {
      axios.get(`${baseURL}/user/${product.created_by}`, { headers }).then((response) => {
        setCreator(response.data);
      }).catch((err) => {
        console.log(err);
      });
    }
  }, [product]);

  const updater = (idx) => {
    const newImageUrls = imageUrls.map((im, index) => {
      if (index === idx) {
        return { url: 'https://i.ibb.co/71RgwLQ/default-Product.png' };
      }
      return im;
    });
    setImageUrls(newImageUrls);
    setMainImage(newImageUrls[0].url);
  };

  const handleValidation = (attribute, value) => {
    if (attribute === 'title') {
      if (value.length <= 2) {
        setValidationMessage({ ...validationMessage, title: 'At least 3 character required' });
      } else {
        setValidationMessage({ ...validationMessage, title: '' });
      }
    }

    if (attribute === 'discount') {
      if (value > 0) {
        if (value > 100) {
          setValidationMessage({ ...validationMessage, discount_percentage: 'Should be less than 100' });
        } else {
          setValidationMessage({ ...validationMessage, discount_percentage: '' });
        }
      } else {
        setValidationMessage({ ...validationMessage, discount_percentage: 'Discount percentage should be positive' });
      }
    }

    if (attribute === 'price') {
      if (value > 0) {
        setValidationMessage({ ...validationMessage, price: '' });
      } else {
        setValidationMessage({ ...validationMessage, price: 'Price should be positive' });
      }
    }

    if (attribute === 'stock') {
      if (value > 0) {
        setValidationMessage({ ...validationMessage, stock: '' });
      } else {
        setValidationMessage({ ...validationMessage, stock: 'Stock should be positive' });
      }
    }
  };

  const onDrop = useCallback(async (acceptedFile) => {
    // upload image to the cloudinary
    const url = await uploadToCloudinary(acceptedFile[0]);
    console.log(url);

    if (acceptedFile[0].type.match('image.*')) {
      const newUrls = fileUrl;
      newUrls.push(url);
      setFileUrl(newUrls);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
    },
  });

  const fileStyle = useMemo(() => (
    `rounded-full dark:bg-mart-black-1 bg-white border dark:border-white border-mart-gray-2 p-5 flex flex-col items-center border-dashed
    ${isDragActive && 'border-file-active'}
    ${isDragAccept && 'border-file-accept'}
    ${isDragReject && 'border-file-reject'}
    `
  ), [isDragActive, isDragAccept, isDragReject]);

  const validToken = () => JSON.parse(localStorage.getItem('user')).access_token;

  const handleSubmit = () => {
    setError(null);
    if (productCopy.title !== '' && productCopy.description !== '' && productCopy.discount_percentage !== '' && productCopy.stock !== '' && productCopy.price !== '' && validationMessage.title === '' && validationMessage.description === '' && validationMessage.stock === '' && validationMessage.price === '' && validationMessage.discount_percentage === '') {
      const data = { ...productCopy, product_feature: feature, image_url: fileUrl, tag: activeSelect, is_used: false };
      axios({
        method: 'PUT',
        url: `${process.env.NEXT_PUBLIC_BACKEND_API}/product/${productCopy.id}`,
        data: JSON.stringify(data),
        headers: {
          'Access-Control-Allow-Origin': '*',
          accept: 'application/json',
          Authorization: `Bearer ${validToken()}`,
          'Content-Type': 'application/json',
        },
      })
        .then(() => {
          setTimeout(() => {
            router.push(`/product/${productCopy.title.toLowerCase().trim().split(' ').join('-')}`, undefined, { shallow: true });
          }, 100);
          setFileUrl(null);
        })
        .catch((err) => {
          if (err.response?.status === 401) { setError(err.response.data.detail); } else { setError(err.message); }
        });
      setUpdateModal(false);
      // console.log({ ...productCopy, profile_img: fileUrl === null ? 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3y9BKnIJ5AuNPL5RgemA_U_4s5IEzB_cFzQ&usqp=CAU' : fileUrl, phone_number: '' });
    } else if (productCopy.title === '' || productCopy.description === '' || productCopy.discount_percentage === '' || productCopy.stock === '' || productCopy.price === '') {
      setError('Plese fill all the required fields.');
    } else if (validationMessage.title !== '' || validationMessage.description !== '' || validationMessage.stock !== '' || validationMessage.price !== '' || validationMessage.discount_percentage !== '') {
      setError('Resolve all validation error first.');
    } else {
      setError('Last One');
    }
  };

  const handleFeatureChange = (index, event) => {
    const data = [...feature];
    data[index][event.target.name] = event.target.value;
    setFeature(data);
  };

  const addFields = () => {
    const newfield = { tite: '', description: '' };
    setFeature([...feature, newfield]);
  };

  const removeFields = (index) => {
    const data = [...feature];
    data.splice(index, 1);
    setFeature(data);
  };

  if (isLoading || !product) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading . . .
      </div>
    );
  }

  const deleteProduct = () => {
    axios({
      method: 'DELETE',
      url: `${process.env.NEXT_PUBLIC_BACKEND_API}/product/${productCopy.id}`,
      headers: {
        'Access-Control-Allow-Origin': '*',
        accept: 'application/json',
        Authorization: `Bearer ${validToken()}`,
        'Content-Type': 'application/json',
      },
    }).then(() => {
      const notify = () => toast('Product Deleted successfully.');
      notify();
      setTimeout(() => {
        router.push('/', undefined, { shallow: true });
      }, 100);
      setFileUrl(null);
    });
  };

  return (
    <div className="flex flex-col justify-end sm:px-4 p-12 pt-16">
      <div className="mt-6 w-full md:hidden flex gap-10 h-96">
        <div className="basis-1/5 flex flex-col flex-wrap gap-2 overflow overflow-x-scroll no-scrollbar">
          {product.image_url.map((item, idx) => (
            <div key={idx} onClick={() => { setSelected(idx); setMainImage(imageUrls[idx].url); }} className={`${selected === idx ? 'border-2 border-logo-green rounded-2xl' : ''} relative w-full h-1/3 hover:border-2 cursor-pointer`}>
              <Image className="rounded-2xl" src={imageUrls[idx].url.startsWith('https://') || imageUrls[idx].url.startsWith('http://') ? imageUrls[idx].url : `https://${imageUrls[idx].url}`} onError={() => { updater(idx); }} layout="fill" objectFit="cover" />
            </div>
          ))}
        </div>
        <div className="border-2 border-logo-green rounded-2xl basis-1/2 relative w-full h-full">
          {product.discount_percentage > 0 && <div className="z-10 absolute bg-red-600 px-2 py-1 rounded-2xl top-4 -right-8 text-white font-montserrat text-sm font-semibold">{product.discount_percentage}% OFF</div>}
          <Image className="rounded-2xl" src={mainImage} layout="fill" objectFit="cover" />
        </div>
        <div className="basis-1/2 flex flex-col justify-center items-center">
          <div className="flex flex-col">
            <p className="text-subtitle-blue italic font-semibold text-base md:mb-4 sm:mb-1 xs:ml-0">- The {product.tag}</p>
            <h1 className="text-4xl font-bold">{product.title}</h1>
            <div className="mt-5 flex">
              <span onClick={() => router.push(`/category/${product.tag.toLowerCase()}`, undefined, { shallow: true })} className="cursor-pointer bg-gray-600 px-4 py-2 rounded-2xl text-white font-montserrat text-sm font-semibold">{product.tag.toUpperCase()}</span>
              <div className="flex gap-3 ml-8 text-2xl">
                {product.discount_percentage > 0 && <div className="text text-mart-gray-2 line-through">${product.price}</div>}
                <div className="font-semibold">${calculateDiscount(product.price, product.discount_percentage)}</div>
              </div>
            </div>
            {creator
            && (
            <div className="font-montserrat mt-4">
              <div className="flex gap-3 items-center">
                <span>Added By:</span>
                <div className="h-8 w-8 rounded-full relative">
                  <img src={creator.profile_img} className="object-cover h-full rounded-full" />
                </div>
                <span>{creator.name}</span>
              </div>
              <div>
                Contact no: {creator.phone_number}
              </div>
              <div className="mt-3 font-bold">
                Stock: {product.stock}
              </div>
            </div>
            )}
            <div className="flex gap-10 items-center mt-8">
              <div className="flex gap-2 items-center text-2xl">
                <Image onClick={decreaseQty} src={images.leftArrow} width={42} objectFit="contain" alt="left-arrow" className={`cursor-pointer hover:scale-105 ${theme === 'dark' ? 'filter invert' : ''}`} />
                <span className="mx-2">{qty}</span>
                <Image onClick={() => qty < product.stock && increaseQty()} src={images.rightArrow} width={42} objectFit="contain" alt="left-arrow" className={`cursor-pointer hover:scale-105 ${theme === 'dark' ? 'filter invert' : ''}`} />
              </div>
              {user?.id === product.created_by
                ? (
                  <div className="flex gap-3 justify-center items-center">
                    <Button
                      btnName="Update Product"
                      classStyles="text-xl rounded-xl py-3"
                      handleClick={() => {
                        setUpdateModal(true);
                      }}
                    />
                    <Image onClick={() => deleteProduct()} className={`hover:cursor-pointer hover:scale-105 ${theme === 'dark' ? 'filter invert' : ''}`} src={images.remove} height={30} width={30} />
                  </div>
                )
                : (
                  <Button
                    btnName="Add to cart"
                    classStyles="text-xl rounded-xl py-3"
                    handleClick={() => {
                      onAdd(product, qty, calculateDiscount(product.price, product.discount_percentage));
                      setQty(1);
                      // router.push(`${buttonLink}`);
                    }}
                  />
                )}
            </div>
          </div>
        </div>
        {updateModal && (
        <Modal
          header="Update"
          body={(
            <div className="h-[300px] overflow-scroll">
              <Input defaultValue={productCopy.title} inputType="input" title="Name" placeholder="Enter product name" handleClick={(e) => { setProductCopy({ ...productCopy, title: e.target.value }); handleValidation('title', e.target.value); }} />
              {validationMessage.title !== '' && <p className="absolute text-red-500">{validationMessage.title}</p>}
              <Input defaultValue={productCopy.description} inputType="textarea" title="Description" placeholder="Enter product description" handleClick={(e) => { setProductCopy({ ...productCopy, description: e.target.value }); handleValidation('description', e.target.value); }} />
              {validationMessage.description !== '' && <p className="absolute text-red-500">{validationMessage.description}</p>}

              <div className="flex gap-3 justify-between items-center sm:flex-col sm:items-start">
                <div className="mt-10">
                  <p className="font-montserrat dark:text-white text-mart-black-1 font-semibold text-xl">
                    Category
                  </p>
                  <div onClick={() => { setToggle((prevValue) => !prevValue); }} className="relative flexBetween mt-4 h-11 sm:ml-0 sm:mt-2 min-w-190 cursor-pointer dark:bg-mart-black-2 bg-white border dark:border-mart-black-2 border-mart-gray-2 px-4 py-3 rounded-md">
                    <p className="font-montserrat dark:text-white text-mart-black-1 font-normal text-xs">{activeSelect}</p>
                    <Image src={images.rightArrow} objectFit="contain" width={15} height={15} alt="arrow" className={theme === 'light' ? 'filter invert' : ''} />
                    {toggle && (
                      <div className="absolute top-full left-0 right-0 w-full mt-3 z-10 dark:bg-mart-black-2 bg-white border dark:border-mart-black-2 border-mart-gray-2 py-3 px-4 rounded-md">
                        {
                category?.map((item) => (<p className="font-montserrat dark:text-white text-mart-black-1 font-normal text-xs my-3 cursor-pointer" onClick={() => setActiveSelect(item)} key={item}>{item}</p>))
            }
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <Input defaultValue={productCopy.stock} inputType="number" title="Stock" placeholder="Enter stock" handleClick={(e) => { setProductCopy({ ...productCopy, stock: e.target.value }); handleValidation('stock', e.target.value); }} />
                  {validationMessage.stock !== '' && <p className="absolute text-red-500">{validationMessage.stock}</p>}
                </div>
              </div>

              <div className="flex gap-3 relative sm:flex-col sm:items-start">
                <div className="w-full">
                  <Input defaultValue={productCopy.price} inputType="number" title="Price" placeholder="Enter product price" handleClick={(e) => { setProductCopy({ ...productCopy, price: e.target.value }); handleValidation('price', e.target.value); }} />
                  {validationMessage.price !== '' && <p className="absolute text-red-500">{validationMessage.price}</p>}
                </div>
                <div className="w-full">
                  <Input defaultValue={productCopy.discount_percentage} inputType="number" title="Discount Percent" placeholder="Enter Discount percentage" handleClick={(e) => { setProductCopy({ ...productCopy, discount_percentage: e.target.value }); handleValidation('discount', e.target.value); }} />
                  {validationMessage.discount !== '' && <p className="absolute text-red-500">{validationMessage.discount_percentage}</p>}
                </div>
              </div>

              <div className="mt-16">
                <p className="font-montserrat dark:text-white text-book-black-1 font-semibold text-xl">Upload Product Image</p>
                <div className="mt-4 w-full flex justify-center">
                  <div {...getRootProps()} className={fileStyle}>
                    <input {...getInputProps()} />
                    <div className="flexCenter flex-col text-center">
                      {/* <p className="font-poppins dark:text-white text-book-black-1 font-semibold text-xl">JPG, PNG, GIF, SVG, WEBM.</p> */}
                      <div className="flex justify-center h-32 w-32 cursor-pointer">
                        <Image src={images.upload} width={50} height={50} objectFit="contain" alt="file upload" className={`${theme === 'light' ? 'filter invert' : ''}`} />
                      </div>
                      {/* <p className="font-poppins dark:text-white text-book-black-1 font-semibold text-sm">Drag and Drop File</p>
                      <p className="font-poppins dark:text-white text-book-black-1 font-semibold text-sm">or Browse media on your device </p> */}
                    </div>
                  </div>
                  {/* {fileUrl && (
                  <aside>
                    <div>
                      <img src={fileUrl} alt="asset_file" />
                    </div>
                  </aside>
                  )} */}
                </div>
                <div className="mt-2 flex gap-2 justify-center items-center flex-wrap">
                  {fileUrl?.map((imageSrc, idx) => <img key={idx} src={imageSrc} alt="file upload" height={100} width={100} className="object-cover" />)}
                </div>
              </div>
              <div>
                <p className="font-montserrat dark:text-white text-mart-black-1 font-semibold text-xl">
                  Features
                </p>
                {feature.map((input, index) => (
                  <div key={index} className="flex justify-center items-center gap-3">
                    <div className="flex justify-center items-center gap-3 sm:flex-col">
                      <input
                        className="dark:bg-mart-black-1 bg-white border dark:border-mart-black-1 border-mart-gray-2 rounded-lg w-full outline-none font-poppins dark:text-white text-mart-gray-2 text-base mt-4 px-4 py-3"
                        name="title"
                        placeholder="Title"
                        value={input.title}
                        onChange={(event) => handleFeatureChange(index, event)}
                      />
                      <input
                        className="dark:bg-mart-black-1 bg-white border dark:border-mart-black-1 border-mart-gray-2 rounded-lg w-full outline-none font-poppins dark:text-white text-mart-gray-2 text-base mt-4 px-4 py-3"
                        name="description"
                        placeholder="Description"
                        value={input.description}
                        onChange={(event) => handleFeatureChange(index, event)}
                      />
                    </div>
                    {feature.length > 1
                        && <Image onClick={() => removeFields(index)} src={images.cross} className="hover:cursor-pointer hover:scale-110" />}
                  </div>
                ))}
                <Button handleClick={addFields} btnName="Add more..." classStyles="mt-2 rounded-md py-3 xs:py-2" />
              </div>

            </div>
          )}
          footer={(
            <div>
              <div className="flex flex-row sm:flex-col ">
                <Button
                  btnName="Save"
                  classStyles="mr-5 sm:mr-0 rounded-xl"
                  handleClick={() => { handleSubmit(); }}
                />
                <Button
                  btnName="Cancel"
                  classStyles="rounded-xl"
                  handleClick={() => { setUpdateModal(false); }}
                />
              </div>
              <div className="flex justify-center items-center mt-8">

                { error !== null && <p className="absolute text-red-500">{error}</p>}
              </div>
            </div>
        )}
          handleClose={() => { setUpdateModal(false); }}
        />
        )}
      </div>

      <div className="hidden mt-6 w-full md:flex flex-col gap-10">
        <div className="flex justify-around h-64">
          <div className="basis-1/4 flex flex-col flex-wrap gap-2 overflow overflow-x-scroll no-scrollbar">
            {product.image_url.map((item, idx) => (
              <div key={idx} onClick={() => { setSelected(idx); setMainImage(imageUrls[idx].url); }} className={`${selected === idx ? 'border-2 border-logo-green rounded-2xl' : ''} bg-white relative w-full h-1/3 hover:border-2 cursor-pointer`}>
                <Image className="rounded-2xl" src={imageUrls[idx].url.startsWith('https://') || imageUrls[idx].url.startsWith('http://') ? imageUrls[idx].url : `https://${imageUrls[idx].url}`} onError={() => { updater(idx); }} layout="fill" objectFit="contain" />
              </div>
            ))}
          </div>
          <div className="border-2 border-logo-green rounded-2xl basis-1/2 relative w-full h-full">
            {product.discount_percentage > 0 && <div className="z-10 absolute bg-red-600 px-2 py-1 rounded-2xl top-4 -right-8 text-white font-montserrat text-sm font-semibold">{product.discount_percentage}% OFF</div>}
            <Image className="rounded-2xl" src={mainImage} layout="fill" objectFit="contain" />
          </div>
        </div>
        <div className="basis-1/2 flex flex-col justify-center items-center">
          <div className="flex flex-col">
            <p className="text-subtitle-blue italic font-semibold text-base md:mb-4 sm:mb-1 xs:ml-0">- The {product.tag}</p>
            <h1 className="text-4xl font-bold">{product.title}</h1>
            <div className="mt-5 flex">
              <span className="bg-gray-600 px-4 py-2 rounded-2xl text-white font-montserrat text-sm font-semibold">{product.tag.toUpperCase()}</span>
              <div className="flex gap-3 ml-8 text-2xl">
                {product.discount_percentage > 0 && <div className="text text-mart-gray-2 line-through">${product.price}</div>}
                <div className="font-semibold">${calculateDiscount(product.price, product.discount_percentage)}</div>
              </div>
            </div>
            {creator
            && (
            <div className="font-montserrat mt-4">
              <div className="flex gap-3 items-center">
                <span>Added By:</span>
                <div className="h-8 w-8 rounded-full relative">
                  <img src={creator.profile_img} className="object-cover h-full rounded-full" />
                </div>
                <span>{creator.name}</span>
              </div>
              <div>
                Contact no: {creator.phone_number}
              </div>
              <div className="mt-3 font-bold">
                Stock: {product.stock}
              </div>
            </div>
            )}
            <div className="flex gap-10 items-center mt-8">
              <div className="flex gap-2 items-center text-2xl">
                <Image onClick={decreaseQty} src={images.leftArrow} width={42} objectFit="contain" alt="left-arrow" className={`cursor-pointer hover:scale-105 ${theme === 'dark' ? 'filter invert' : ''}`} />
                <span className="mx-2">{qty}</span>
                <Image onClick={() => qty < product.stock && increaseQty()} src={images.rightArrow} width={42} objectFit="contain" alt="left-arrow" className={`cursor-pointer hover:scale-105 ${theme === 'dark' ? 'filter invert' : ''}`} />
              </div>
              {user?.id === product.created_by
                ? (
                  <Button
                    btnName="Update Product"
                    classStyles="text-xl rounded-xl py-3"
                    handleClick={() => {
                      // open update model
                      setUpdateModal(true);
                    }}
                  />
                )
                : (
                  <Button
                    btnName="Add to cart"
                    classStyles="text-xl rounded-xl py-3"
                    handleClick={() => {
                      onAdd(product, qty, calculateDiscount(product.price, product.discount_percentage));
                      setQty(1);
                      // router.push(`${buttonLink}`);
                    }}
                  />
                )}
            </div>
          </div>
        </div>
        {updateModal && (
        <Modal
          header="Update"
          body={<div>Update body here</div>}
          footer={(
            <div className="flex flex-row sm:flex-col ">
              <Button
                btnName="Save"
                classStyles="mr-5 sm:mr-0 rounded-xl"
                handleClick={() => {}}
              />
              <Button
                btnName="Cancel"
                classStyles="rounded-xl"
                handleClick={() => { setUpdateModal(false); }}
              />
            </div>
        )}
          handleClose={() => { setUpdateModal(false); }}
        />
        )}
      </div>
      <div className="mt-16 p-8 flex sm:flex-col justify-around">
        <div>
          <p className="text-subtitle-blue italic font-semibold text-base md:mb-4 sm:mb-1 xs:ml-0">- The Features</p>
          <h1 className="text-4xl font-bold">Explore the Features</h1>
        </div>
        <div className="flex flex-col gap-10 sm:mt-10">
          {product.product_feature.map((item) => (
            <div>
              <h1 className="font-semibold text-xl">{item.title}</h1>
              <h2 className="mt-2">{item.description}</h2>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
