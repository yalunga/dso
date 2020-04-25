import React, { useState, useEffect } from 'react';
import Nav from '../components/Nav';
import Avatar from 'react-avatar';

export default ({ match: { params: { id } } }) => {
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState(null);

  useEffect(() => {
    const getPost = async () => {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/post/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const post = await response.json();
      setPost(post);
      setLoading(false);
    }
    getPost();
  }, []);
  console.log(post);
  if (loading) {
    return null;
  }
  return (
    <Nav>
      <div className='w-full flex justify-center'>
        <div className='p-4 bg-white shadow rounded flex flex-row'>
          <div>
            <label className='block text-gray-700 text-sm font-bold mb-2'>
              Product
            </label>
            <img className='rounded-b object-cover' style={{ width: 600, maxHeight: 750 }} src={`https://firebasestorage.googleapis.com/v0/b/dso462-6cea8.appspot.com/o/posts%2F${id}.jpg?alt=media`} />
            <label className='block text-gray-700 text-sm font-bold mb-2'>
              Description
            </label>
            <span className='text-sm'>{post.description}</span>
            <div className='flex flex-row float-right'>
              <button
                className='bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow float-right'
              >
                Contact
              </button>
              <button
                className='bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow float-right ml-2'
              >
                Add To Cart
              </button>
            </div>
          </div>
          <div className='p-4'>
            <div>
              <Avatar name={post.user.name} round src={`https://firebasestorage.googleapis.com/v0/b/dso462-6cea8.appspot.com/o/users%2F${post.user.id}.jpg?alt=media`} />
            </div>
            <div className={'w-full text-center'}>
              <span className='text-sm font-bold text-center'>{post.user.name}</span>
            </div>
            <div>
              <span className='text-sm'>{post.user.description}</span>
            </div>
          </div>
        </div>
      </div>
    </Nav>
  )
}