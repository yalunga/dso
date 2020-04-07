import React, { useState, useEffect } from 'react';
import Unsplash from 'unsplash-js';
import { ShoppingCart } from 'react-feather';

import LoginModal from './components/LoginModal';

function App() {
  const [photos, setPhotos] = useState([]);
  const [openLoginModal, setOpenLoginModal] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  useEffect(() => {
    const getPhotos = async () => {
      const unsplash = new Unsplash({ accessKey: 'FuF_oOlJVWDkyUtWpisR6ptTVh0Mj3fpYACCa68FMJI' });
      const photos = await unsplash.search.photos('handmade', 1, 50, { orientation: 'portrait' });
      const results = await photos.json();
      setPhotos(results.results);
    }
    getPhotos();
  }, []);

  const login = async () => {
    const response = await fetch('http://localhost:8000/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const user = await response.json();
    setUser(user);
    setOpenLoginModal(false);
  }

  return (
    <div className='bg-gray-200 w-full pt-4 overflow-scroll' style={{ height: '100vh', fontFamily: 'Raleway' }}>
      {!user ? (
        <div className='float-right flex flex-row'>
          <a onClick={() => setOpenLoginModal(true)} style={{ cursor: 'pointer' }}>Login</a>
          <a href='#' className='mx-2'>Sign Up</a>
          <ShoppingCart className='mr-4' style={{ cursor: 'pointer' }} />
        </div>
      ) : (
          <div className='float-right flex flex-row'>
            <span>{user.name}</span>
            <ShoppingCart className='mx-4' style={{ cursor: 'pointer' }} />
          </div>
        )}
      <div className='w-full flex justify-center'>
        <h1 className='text-5xl' style={{ letterSpacing: '2px' }}>ARTISCTIC</h1>
      </div>
      <div className='w-full flex justify-center'>
        <div className='p-4 grid grid-cols-1 gap-4'>
          {photos.map((o) => (
            <div className='h-auto border bg-white shadow rounded'>
              <div className='w-full h-auto border-b-2 p-4 flex flex-row'>
                <div className='mt mr-2 text-center'>
                  <img className='rounded-full' src={o.user.profile_image.small} />
                </div>
                <div className='flex flex-col'>
                  <span className='font-semibold text-sm'>{o.user.name}</span>
                  {o.user.instagram_username && <span className='text-xs'>@{o.user.instagram_username}</span>}
                </div>
              </div>
              <img className='rounded-b object-cover' style={{ width: 600, maxHeight: 750 }} src={o.urls.regular} />
            </div>
          ))}
        </div>
      </div>
      {
        openLoginModal && (
          <div className={`modal fixed w-full h-full top-0 left-0 flex items-center justify-center z-10`}>
            <div className='modal-overlay absolute w-full h-full bg-gray-900 opacity-50'></div>

            <div className='modal-container bg-white w-11/12 md:max-w-md mx-auto rounded shadow-lg z-50 overflow-y-auto'>

              <div className='modal-close absolute top-0 right-0 cursor-pointer flex flex-col items-center mt-4 mr-4 text-white text-sm z-50' onClick={() => setOpenLoginModal(false)}>
                <svg className='fill-current text-white' xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 18 18'>
                  <path d='M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z'></path>
                </svg>
                <span className='text-sm'>(Esc)</span>
              </div>
              <div className='modal-content py-4 text-left px-6'>
                <div className='flex justify-between items-center pb-3'>
                  <p className='text-2xl font-bold'>Login</p>
                  <div className='modal-close cursor-pointer z-50' onClick={() => setOpenLoginModal(false)}>
                    <svg className='fill-current text-black' xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 18 18'>
                      <path d='M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z'></path>
                    </svg>
                  </div>
                </div>

                <form class='bg-white rounded px-8 pt-6 pb-8 mb-4'>
                  <div class='mb-4'>
                    <label class='block text-gray-700 text-sm font-bold mb-2' for='username'>
                      Email
                  </label>
                    <input class='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline' id='username' type='email' placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                  <div class='mb-6'>
                    <label class='block text-gray-700 text-sm font-bold mb-2' for='password'>
                      Password
                  </label>
                    <input class='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline' id='password' type='password' placeholder='******************' value={password} onChange={(e) => setPassword(e.target.value)} />
                  </div>
                  <div class='flex items-center justify-between'>
                    <button class='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline' type='button' onClick={() => login()}>
                      Sign In
                  </button>
                    <a class='inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800' href='#'>
                      Forgot Password?
                  </a>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )
      }
    </div >
  );
}

export default App;
