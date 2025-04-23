import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function BuyerProfilePage() {
  const { id } = useParams();
  const [buyer, setBuyer] = useState(null);

  useEffect(() => {
    fetchBuyer();
  }, [id]);

  const fetchBuyer = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/users/${id}`);
      setBuyer(response.data);
    } catch (error) {
      console.error('Error fetching buyer profile:', error);
    }
  };

  if (!buyer) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="flex items-center space-x-4 mb-6">
        <img
          src={buyer.avatar || 'https://via.placeholder.com/100?text=Avatar'}
          alt={buyer.nickname}
          className="w-24 h-24 rounded-full object-cover"
        />
        <div>
          <h1 className="text-3xl font-bold text-youtubeRed">{buyer.nickname}</h1>
          <p className="text-gray-700">{buyer.profileDescription || 'No profile description provided.'}</p>
        </div>
      </div>

      <h2 className="text-2xl font-semibold mb-4">Products</h2>
      {buyer.channels && buyer.channels.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {buyer.channels.map((channel) => (
            <div key={channel.id} className="bg-white rounded shadow p-4">
              <img
                src={channel.coverImage || 'https://via.placeholder.com/400x200?text=No+Image'}
                alt={channel.title}
                className="w-full h-40 object-cover rounded"
              />
              <h3 className="text-lg font-semibold mt-2">{channel.title}</h3>
              <p>{channel.subscribers.toLocaleString()} subscribers</p>
              <p className="text-red-600 font-bold">${channel.price.toFixed(2)}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No products found.</p>
      )}

      <h2 className="text-2xl font-semibold mb-4">Reviews</h2>
      {buyer.reviews && buyer.reviews.length > 0 ? (
        <div className="space-y-4">
          {buyer.reviews.map((review) => (
            <div key={review.id} className="bg-white rounded shadow p-4">
              <p className="font-semibold">Rating: {review.rating} / 5</p>
              <p>{review.comment || 'No comment provided.'}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No reviews found.</p>
      )}
    </div>
  );
}

export default BuyerProfilePage;
