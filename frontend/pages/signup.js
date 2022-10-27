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
import validateEmail from '../utils/validateEmail';
import images from '../assets';
import { useAuthContext } from '../hooks/useAuthContext';

const validatePassword = (password) => (password.length >= 8);

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

const SignUp = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const [fileUrl, setFileUrl] = useState(null);
  const [inputDetail, setInputDetail] = useState({ name: '', email: '', password: '' });
  const [validationMessage, setValidationMessage] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState(null);
  const { dispatch } = useAuthContext();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      const notify = () => toast('Logout first to signup');
      notify();
      setTimeout(() => {
        router.push('/', undefined, { shallow: true });
      }, 3000);
    }
  }, []);

  const handleValidation = (attribute, value) => {
    if (attribute === 'name') {
      if (value.length <= 2) {
        setValidationMessage({ ...validationMessage, name: 'At least 3 character required' });
      } else {
        setValidationMessage({ ...validationMessage, name: '' });
      }
    }

    if (attribute === 'email') {
      if (validateEmail(value)) {
        setValidationMessage({ ...validationMessage, email: '' });
      } else {
        setValidationMessage({ ...validationMessage, email: 'Enter a valid email' });
      }
    }

    if (attribute === 'password') {
      if (validatePassword(value)) {
        setValidationMessage({ ...validationMessage, password: '' });
      } else {
        setValidationMessage({ ...validationMessage, password: 'Password should have at least 8 characters.' });
      }
    }
  };

  const onDrop = useCallback(async (acceptedFile) => {
    // upload image to the cloudinary
    const url = await uploadToCloudinary(acceptedFile[0]);
    console.log(url);

    if (acceptedFile[0].type.match('image.*')) {
      setFileUrl(url);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
    },
  });

  const handleSignUp = () => {
    setError(null);
    if (inputDetail.name !== '' && inputDetail.email !== '' && inputDetail.password !== '' && validationMessage.name === '' && validationMessage.email === '' && validationMessage.password === '') {
      const data = { ...inputDetail, phone_number: '', profile_img: fileUrl === null ? 'string' : fileUrl };
      axios({
        method: 'POST',
        url: `${process.env.NEXT_PUBLIC_BACKEND_API}/user/`,
        data: JSON.stringify(data),
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })
        .then((response) => {
          if (response.status === 201) {
            // setData(response.data);
            // console.log(response.data);
            localStorage.setItem('user', JSON.stringify(response.data));
            dispatch({ type: 'LOGIN', payload: response.data });
            setInputDetail({ name: '', email: '', password: '' });
            setFileUrl(null);
            router.push('/', undefined, { shallow: true });
          }
        })
        .catch((err) => { console.log(err); console.log(err.response); setError(err.message); });

      // console.log({ ...inputDetail, profile_img: fileUrl === null ? 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3y9BKnIJ5AuNPL5RgemA_U_4s5IEzB_cFzQ&usqp=CAU' : fileUrl, phone_number: '' });
    } else if (inputDetail.name === '' && inputDetail.email === '' && inputDetail.password === '') {
      setError('Plese fill all the required fields.');
    } else if (validationMessage.name !== '' || validationMessage.email !== '' || validationMessage.password !== '') {
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

  return (
    <div>
      <Head>
        <title>SignUp</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <form onSubmit={handleSignUp}>
        <div className="flex flex-col justify-end sm:px-4 p-12 pt-16">
          <div className="mt-8 flexBetween sm:flex-col sm:items-start">
            <div className="w-full">
              <p className="text-subtitle-blue italic font-semibold text-base md:mb-4 sm:mb-1 ml-4 xs:ml-0">- Sign Up</p>
              <h1 className="font-montserrat dark:text-white text-mart-black-1 text-3xl minlg:text-4xl xs:text-xl font-bold ml-4 xs:ml-0">Create an account</h1>
              <div className="m-auto w-2/5 md:w-3/5 sm:w-4/5 xs:w-full">
                <Input inputType="input" title="Name" placeholder="Enter your name" handleClick={(e) => { setInputDetail({ ...inputDetail, name: e.target.value }); handleValidation('name', e.target.value); }} />
                {validationMessage.name !== '' && <p className="absolute text-red-500">{validationMessage.name}</p>}
                <Input inputType="input" title="Email Address" placeholder="Enter your email" handleClick={(e) => { setInputDetail({ ...inputDetail, email: e.target.value }); handleValidation('email', e.target.value); }} />
                {validationMessage.email !== '' && <p className="absolute text-red-500">{validationMessage.email}</p>}
                <Input inputType="password" hidePassword title="Password" placeholder="Enter your password" handleClick={(e) => { setInputDetail({ ...inputDetail, password: e.target.value }); handleValidation('password', e.target.value); }} />
                {validationMessage.password !== '' && <p className="absolute text-red-500">{validationMessage.password}</p>}
                <div className="mt-16">
                  <p className="font-poppins dark:text-white text-book-black-1 font-semibold text-xl">Profile Picture</p>
                  <div className="mt-4 w-full flex justify-center">
                    <div {...getRootProps()} className={fileStyle}>
                      <input {...getInputProps()} />
                      <div className="flexCenter flex-col text-center">
                        {/* <p className="font-poppins dark:text-white text-book-black-1 font-semibold text-xl">JPG, PNG, GIF, SVG, WEBM.</p> */}
                        <div className="flex justify-center h-32 w-32 cursor-pointer">
                          {!fileUrl
                            ? <Image src={images.upload} width={50} height={50} objectFit="contain" alt="file upload" className={`${theme === 'dark' ? 'filter invert' : ''}`} />
                            : <img src={fileUrl} alt="file upload" className="rounded-full object-cover" />}
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
                </div>
                <div className="mt-12 w-full flex justify-between">
                  <Button handleClick={handleSignUp} btnName="Create account" classStyles="rounded-md w-2/5 py-3 xs:py-2" />

                  <Button btnName="Login" classStyles="rounded-md w-2/5 py-3 border text-black bg-gray-100 xs:py-2" handleClick={() => router.push('/login', undefined, { shallow: true })} />
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
export default SignUp;
