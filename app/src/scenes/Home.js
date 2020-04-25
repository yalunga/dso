import React, { useState, useEffect } from 'react';
import Nav from '../components/Nav';
import Avatar from 'react-avatar';

function Home() {
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    const getPhotos = async () => {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/post`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const posts = await response.json();
      console.log(posts);
      setPhotos(posts.reverse());
    }
    getPhotos();
  }, []);

  return (
    <Nav>
      <div className='w-full flex justify-center'>
        <div className='p-4 grid grid-cols-1 gap-4'>
          {photos.map((o) => (
            <div className='h-auto border bg-white shadow rounded cursor-pointer' onClick={() => window.location.href = `/product/${o.id}`}>
              <div className='w-full h-auto border-b-2 p-4 flex flex-row'>
                <div className='mt mr-2 text-center'>
                  <Avatar name={o.user.name} round size={24} src={`https://firebasestorage.googleapis.com/v0/b/dso462-6cea8.appspot.com/o/users%2F${o.user.id}.jpg?alt=media`} />
                </div>
                <div className='flex flex-col'>
                  <span className='font-semibold text-sm'>{o.user.name}</span>
                  {o.user.instagram_username && <span className='text-xs'>@{o.user.instagram_username}</span>}
                </div>
              </div>
              <img className='rounded-b object-cover' style={{ width: 600, maxHeight: 750 }} src={`https://firebasestorage.googleapis.com/v0/b/dso462-6cea8.appspot.com/o/posts%2F${o.id}.jpg?alt=media`} />
              <div className='w-full h-auto border-t-2 p-4 flex flex-row'>
                <span className='text-sm'>{o.description}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Nav>
  );
}

export default Home;
