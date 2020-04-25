import React, { useState, useEffect } from 'react';
import { ShoppingCart, User } from 'react-feather';
import Avatar from 'react-avatar';

export default ({ children }) => {
  const [openLoginModal, setOpenLoginModal] = useState(false);
  const [openRegisterModal, setOpenRegisterModal] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [user, setUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const userJson = sessionStorage.getItem('user');
    if (userJson) {
      setUser(JSON.parse(userJson));
    }
  }, []);

  const closeModal = () => {
    setEmail('');
    setPassword('');
    setOpenLoginModal(false);
    setOpenRegisterModal(false);
    setErrorMessage(false);
  }

  const login = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/login`, {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        const errorMessage = await response.text();
        return setErrorMessage(errorMessage);
      }
      const user = await response.json();
      sessionStorage.setItem('user', JSON.stringify(user));
      setUser(user);
    } catch (error) {
      console.log('ERROR', error)
    }

    closeModal();
  }

  const register = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/register`, {
        method: 'POST',
        body: JSON.stringify({ email, password, name, description }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const user = await response.json();
      sessionStorage.setItem('user', JSON.stringify(user));
      setUser(user);
    } catch (error) {
      console.log('error', error.message);
    }
    closeModal();
  }
  return (
    <div className='bg-gray-200 w-full pt-4 overflow-scroll' style={{ height: '100vh', fontFamily: 'Raleway' }}>
      {!user ? (
        <div className='float-right flex flex-row'>
          <a onClick={() => setOpenLoginModal(true)} style={{ cursor: 'pointer' }}>Login</a>
          <a className='mx-2' onClick={() => setOpenRegisterModal(true)} style={{ cursor: 'pointer' }}>Sign Up</a>
          <ShoppingCart className='mr-4' style={{ cursor: 'pointer' }} />
        </div>
      ) : (
          <div className='float-right flex flex-row'>
            <a className='mr-2' href='/user'><Avatar name={user.name} round size={24} src={`https://firebasestorage.googleapis.com/v0/b/dso462-6cea8.appspot.com/o/users%2F${user.id}.jpg?alt=media`} /></a>
            <span className='mr-2'>{user.name}</span>
            <a onClick={() => {
              sessionStorage.removeItem('user');
              setUser(null);
              window.location.href = '/';
            }} style={{ cursor: 'pointer' }}>Logout</a>
            <ShoppingCart className='mx-4' style={{ cursor: 'pointer' }} />
          </div>
        )}
      <div className='w-full flex justify-center'>
        <a className='text-5xl' style={{ letterSpacing: '2px' }} href='/'>ARTISCTIC</a>
      </div>
      {children}
      {
        openLoginModal && (
          <div className={`modal fixed w-full h-full top-0 left-0 flex items-center justify-center z-10`}>
            <div className='modal-overlay absolute w-full h-full bg-gray-900 opacity-50'></div>

            <div className='modal-container bg-white w-11/12 md:max-w-md mx-auto rounded shadow-lg z-50 overflow-y-auto'>

              <div className='modal-close absolute top-0 right-0 cursor-pointer flex flex-col items-center mt-4 mr-4 text-white text-sm z-50' onClick={() => closeModal()}>
                <svg className='fill-current text-white' xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 18 18'>
                  <path d='M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z'></path>
                </svg>
                <span className='text-sm'>(Esc)</span>
              </div>
              <div className='modal-content py-4 text-left px-6'>
                <div className='flex justify-between items-center pb-3'>
                  <p className='text-2xl font-bold'>Login</p>
                  <div className='modal-close cursor-pointer z-50' onClick={() => closeModal()}>
                    <svg className='fill-current text-black' xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 18 18'>
                      <path d='M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z'></path>
                    </svg>
                  </div>
                </div>

                <form className='bg-white rounded px-8 pt-6 pb-8 mb-4'>
                  <div className='mb-4'>
                    <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='username'>
                      Email
                  </label>
                    <input className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline' id='username' type='email' placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                  <div className='mb-2'>
                    <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='password'>
                      Password
                  </label>
                    <input className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline' id='password' type='password' placeholder='******************' value={password} onChange={(e) => setPassword(e.target.value)} />
                  </div>
                  <div className='mb-2 text-red-700'>
                    {errorMessage}
                  </div>
                  <div className='flex items-center justify-between'>
                    <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline' type='button' onClick={() => login()}>
                      Sign In
                  </button>
                    <a className='inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800' href='#'>
                      Forgot Password?
                  </a>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )
      }
      {
        openRegisterModal && (
          <div className={`modal fixed w-full h-full top-0 left-0 flex items-center justify-center z-10`}>
            <div className='modal-overlay absolute w-full h-full bg-gray-900 opacity-50'></div>

            <div className='modal-container bg-white w-11/12 md:max-w-md mx-auto rounded shadow-lg z-50 overflow-y-auto'>

              <div className='modal-close absolute top-0 right-0 cursor-pointer flex flex-col items-center mt-4 mr-4 text-white text-sm z-50' onClick={() => closeModal()}>
                <svg className='fill-current text-white' xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 18 18'>
                  <path d='M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z'></path>
                </svg>
                <span className='text-sm'>(Esc)</span>
              </div>
              <div className='modal-content py-4 text-left px-6'>
                <div className='flex justify-between items-center pb-3'>
                  <p className='text-2xl font-bold'>Register</p>
                  <div className='modal-close cursor-pointer z-50' onClick={() => closeModal()}>
                    <svg className='fill-current text-black' xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 18 18'>
                      <path d='M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z'></path>
                    </svg>
                  </div>
                </div>

                <form className='bg-white rounded px-8 pt-6 pb-8 mb-4'>
                  <div className='mb-4'>
                    <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='username'>
                      Name
                    </label>
                    <input className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline' id='name' type='text' placeholder='Name' value={name} onChange={(e) => setName(e.target.value)} />
                  </div>
                  <div className='mb-4'>
                    <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='username'>
                      Email
                    </label>
                    <input className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline' id='username' type='email' placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                  <div className='mb-4'>
                    <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='username'>
                      Description
                    </label>
                    <textarea
                      className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                      placeholder='Description'
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                  <div className='mb-6'>
                    <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='password'>
                      Password
                  </label>
                    <input className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline' id='password' type='password' placeholder='******************' value={password} onChange={(e) => setPassword(e.target.value)} />
                  </div>
                  <div className='flex items-center justify-between'>
                    <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline' type='button' onClick={() => register()}>
                      Sign In
                  </button>
                    <a className='inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800' href='#'>
                      Forgot Password?
                  </a>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )
      }
    </div>
  )
}