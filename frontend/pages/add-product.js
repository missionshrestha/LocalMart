import React, { useState, useMemo, useCallback, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Input, Notification } from '../components';
import Button from '../components/Button';
import images from '../assets';
// import { useAuthContext } from '../hooks/useAuthContext';

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

const AddProduct = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const [category, setCategory] = useState([]);
  const [fileUrl, setFileUrl] = useState([]);
  const [inputDetail, setInputDetail] = useState({ title: '', description: '', price: '', discount_percentage: '', stock: '' });
  const [feature, setFeature] = useState([{ tite: '', description: '' }]);
  const [toggle, setToggle] = useState(false);
  const [activeSelect, setActiveSelect] = useState('None');
  const [validationMessage, setValidationMessage] = useState({ title: '', description: '', price: '', discount_percentage: '', stock: '' });
  const [error, setError] = useState(null);
  // const { dispatch } = useAuthContext();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      const notify = () => toast('Login first to add product');
      notify();
      setTimeout(() => {
        router.push('/login', undefined, { shallow: true });
      }, 3000);
    }
  }, []);

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

  const validToken = () => JSON.parse(localStorage.getItem('user')).access_token;

  const handleSubmit = () => {
    setError(null);
    if (inputDetail.title !== '' && inputDetail.description !== '' && inputDetail.discount_percentage !== '' && inputDetail.stock !== '' && inputDetail.price !== '' && validationMessage.title === '' && validationMessage.description === '' && validationMessage.stock === '' && validationMessage.price === '' && validationMessage.discount_percentage === '') {
      const data = { ...inputDetail, product_feature: feature, image_url: fileUrl, tags: activeSelect, is_used: false };
      axios({
        method: 'POST',
        url: `${process.env.NEXT_PUBLIC_BACKEND_API}/product/`,
        data: JSON.stringify(data),
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${validToken()}`,
          'Content-Type': 'application/json',
        },
      })
        .then((response) => {
          const notify = () => toast('Product Created successfully.');
          notify();
          setTimeout(() => {
            router.push(`/product/${inputDetail.title.toLowerCase().trim().split(' ').join('-')}`, undefined, { shallow: true });
          }, 1000);
          setFileUrl(null);
        })
        .catch((err) => {
          if (err.response?.status === 401) { setError(err.response.data.detail); } else { setError(err.message); }
        });

      // console.log({ ...inputDetail, profile_img: fileUrl === null ? 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3y9BKnIJ5AuNPL5RgemA_U_4s5IEzB_cFzQ&usqp=CAU' : fileUrl, phone_number: '' });
    } else if (inputDetail.title === '' || inputDetail.description === '' || inputDetail.discount_percentage === '' || inputDetail.stock === '' || inputDetail.price === '') {
      setError('Plese fill all the required fields.');
    } else if (validationMessage.title !== '' || validationMessage.description !== '' || validationMessage.stock !== '' || validationMessage.price !== '' || validationMessage.discount_percentage !== '') {
      setError('Resolve all validation error first.');
    } else {
      setError('Last One');
    }
  };

  const fileStyle = useMemo(() => (
    `rounded-full dark:bg-mart-black-1 bg-white border dark:border-white border-mart-gray-2 p-5 flex flex-col items-center border-dashed
    ${isDragActive && 'border-file-active'}
    ${isDragAccept && 'border-file-accept'}
    ${isDragReject && 'border-file-reject'}
    `
  ), [isDragActive, isDragAccept, isDragReject]);

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

  return (
    <div>
      <Head>
        <title>Add Product</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col justify-end sm:px-4 p-12 pt-16">
          <div className="mt-8 flexBetween sm:flex-col sm:items-start">
            <div className="w-full">
              <p className="text-subtitle-blue italic font-semibold text-base md:mb-4 sm:mb-1 ml-4 xs:ml-0">- Product</p>
              <h1 className="font-montserrat dark:text-white text-mart-black-1 text-3xl minlg:text-4xl xs:text-xl font-bold ml-4 xs:ml-0">Add product</h1>
              <div className="m-auto w-2/5 md:w-3/5 sm:w-4/5 xs:w-full">
                <Input inputType="input" title="Name" placeholder="Enter product name" handleClick={(e) => { setInputDetail({ ...inputDetail, title: e.target.value }); handleValidation('title', e.target.value); }} />
                {validationMessage.title !== '' && <p className="absolute text-red-500">{validationMessage.title}</p>}
                <Input inputType="textarea" title="Description" placeholder="Enter product description" handleClick={(e) => { setInputDetail({ ...inputDetail, description: e.target.value }); handleValidation('description', e.target.value); }} />
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
                    <Input inputType="number" title="Stock" placeholder="Enter stock" handleClick={(e) => { setInputDetail({ ...inputDetail, stock: e.target.value }); handleValidation('stock', e.target.value); }} />
                    {validationMessage.stock !== '' && <p className="absolute text-red-500">{validationMessage.stock}</p>}
                  </div>
                </div>
                <div className="flex gap-3 relative sm:flex-col sm:items-start">
                  <div className="w-full">
                    <Input inputType="number" title="Price" placeholder="Enter product price" handleClick={(e) => { setInputDetail({ ...inputDetail, price: e.target.value }); handleValidation('price', e.target.value); }} />
                    {validationMessage.price !== '' && <p className="absolute text-red-500">{validationMessage.price}</p>}
                  </div>
                  <div className="w-full">
                    <Input inputType="number" title="Discount Percent" placeholder="Enter Discount percentage" handleClick={(e) => { setInputDetail({ ...inputDetail, discount_percentage: e.target.value }); handleValidation('discount', e.target.value); }} />
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
                <div className="mt-12 w-full flex justify-between">
                  <Button handleClick={handleSubmit} btnName="Create product" classStyles="rounded-md w-full py-3 xs:py-2" />

                  {/* <Button btnName="Login" classStyles="rounded-md w-2/5 py-3 border text-black bg-gray-400 xs:py-2" handleClick={() => router.push('/login', undefined, { shallow: true })} /> */}
                </div>
                <div className="flex justify-center items-center mt-8">

                  { error !== null && <p className="absolute text-red-500">{error}</p>}
                </div>
              </div>
            </div>
          </div>
        </div>
        <Notification />
      </form>
    </div>
  );
};
export default AddProduct;
