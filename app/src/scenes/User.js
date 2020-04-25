import React, { useState, useEffect, useCallback } from 'react';
import Nav from '../components/Nav';
import { useDropzone } from 'react-dropzone';
import Avatar from 'react-avatar';
import Firebase from '../utils/Firebase';

const pages = {
  PROFILE: 'profile',
  POST: 'post',
  SETTINGS: 'settings'
}

export default () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [page, setPage] = useState(pages.PROFILE);
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState('');

  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader()

      reader.onabort = () => console.log('file reading was aborted')
      reader.onerror = () => console.log('file reading has failed')
      reader.onload = () => {
        // Do whatever you want with the file contents
        const binaryStr = reader.result;
        var blob = new Blob([binaryStr], { type: "image/jpeg" });
        setFile(blob);
      }
      reader.readAsArrayBuffer(file)
    })

  }, []);
  const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: 'image/*' });

  const onDropProfileImage = useCallback((acceptedFiles, user) => {
    console.log(user);
    acceptedFiles.forEach((file) => {
      const reader = new FileReader()

      reader.onabort = () => console.log('file reading was aborted')
      reader.onerror = () => console.log('file reading has failed')
      reader.onload = async () => {
        // Do whatever you want with the file contents
        const binaryStr = reader.result;
        var blob = new Blob([binaryStr], { type: "image/jpeg" });
        var urlCreator = window.URL || window.webkitURL;
        var imageUrl = urlCreator.createObjectURL(blob);
        console.log(imageUrl);
        const storageRef = new Firebase().storage.ref('users');
        await storageRef.child(`${user.id}.jpg`).put(blob, { contentType: 'image/jpeg' });
        window.location.reload();
      }
      reader.readAsArrayBuffer(file)
    })

  }, []);
  const { getRootProps: getRootPropsProfileImage, getInputProps: getInputPropsProfileImage } = useDropzone({ onDrop: (acceptedFiles) => onDropProfileImage(acceptedFiles, user), accept: 'image/*' });

  useEffect(() => {
    const userJson = sessionStorage.getItem('user');
    if (userJson) {
      const user = JSON.parse(userJson);
      setUser(user);
      setLoading(false);
    } else {
      window.location.href = '/';
    }
  }, []);

  const getImagePreview = () => {
    var urlCreator = window.URL || window.webkitURL;
    var imageUrl = urlCreator.createObjectURL(file);
    return imageUrl;
  }

  const postImage = async () => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/post`, {
      method: 'POST',
      body: JSON.stringify({ userId: user.id, description }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const post = await response.json();
    const storageRef = new Firebase().storage.ref('posts');
    await storageRef.child(`${post.id}.jpg`).put(file, { contentType: 'image/jpeg' });
    window.location.href = '/';
  }

  const selectedClasses = 'bg-white inline-block border-l border-t border-r rounded-t py-2 px-4 text-blue-700 font-semibold cursor-default';
  const unselectedClasses = 'bg-white inline-block py-2 px-4 text-blue-500 hover:text-blue-800 font-semibold cursor-pointer';

  if (loading) {
    return <div></div>;
  }

  return (
    <Nav>
      <div className='w-full flex justify-center'>
        <div className='shadow rounded bg-white p-4 mt-4'>
          <ul className='flex border-b'>
            <li className='-mb-px mr-1'>
              <a className={page === pages.PROFILE ? selectedClasses : unselectedClasses} onClick={() => setPage(pages.PROFILE)}>Profile</a>
            </li>
            <li className='mr-1'>
              <a className={page === pages.POST ? selectedClasses : unselectedClasses} onClick={() => setPage(pages.POST)}>New Post</a>
            </li>
            <li className='mr-1'>
              <a className={page === pages.SETTINGS ? selectedClasses : unselectedClasses} onClick={() => setPage(pages.SETTINGS)}>Settings</a>
            </li>
          </ul>
          {page === pages.PROFILE && (
            <div className='mt-4'>
              <div>
                <label className='block text-gray-700 text-sm font-bold mb-2'>
                  Profile Image
                </label>
                <div {...getRootPropsProfileImage()}>
                  <input {...getInputPropsProfileImage()} />
                  <Avatar src={`https://firebasestorage.googleapis.com/v0/b/dso462-6cea8.appspot.com/o/users%2F${user.id}.jpg?alt=media`} name={user ? user.name : ''} round />
                </div>
              </div>
              <div className='mt-4'>
                <label className='block text-gray-700 text-sm font-bold mb-2'>
                  Name
                </label>
                {user ? user.name : ''}
              </div>
              <div className='mt-4'>
                <label className='block text-gray-700 text-sm font-bold mb-2'>
                  Description
                </label>
                {user ? user.description : ''}
              </div>
              <div className='mt-4'>
                <label className='block text-gray-700 text-sm font-bold mb-2'>
                  Email
                </label>
                {user ? user.email : ''}
              </div>
            </div>
          )}
          {page === pages.POST && (
            <div className='mt-4'>
              {file === null
                ?
                <div className='p-8 border-dashed border-2' {...getRootProps()}>
                  <input {...getInputProps()} />
                  <span>Drag 'n' drop a photo here, or click to select photo</span>
                </div>
                :
                <img src={getImagePreview()} width={500} />
              }
              <div className='my-4'>
                <label className='block text-gray-700 text-sm font-bold mb-2'>
                  Description
                </label>
                <textarea
                  className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                  id='username'
                  placeholder='Description'
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <button
                className='bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow float-right'
                onClick={postImage}
              >
                Post
              </button>
            </div>
          )}
        </div>
      </div>
    </Nav>
  );
}