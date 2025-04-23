import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function ChannelDetailPage() {
  const { id } = useParams();
  const [channel, setChannel] = useState(null);

  useEffect(() => {
    fetchChannel();
  }, [id]);

  const fetchChannel = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/channels/${id}`);
      setChannel(response.data);
    } catch (error) {
      console.error('Error fetching channel:', error);
    }
  };

  if (!channel) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <img
        src={channel.coverImage || 'https://via.placeholder.com/800x400?text=No+Image'}
        alt={channel.title}
        className="w-full h-64 object-cover rounded"
      />
      <h1 className="text-4xl font-bold text-youtubeRed mt-4">{channel.title}</h1>
      <p className="text-gray-700 mt-2">{channel.subscribers.toLocaleString()} subscribers</p>
      <p className="text-red-600 font-bold text-2xl mt-2">${channel.price.toFixed(2)}</p>
      <p className="mt-4 whitespace-pre-line">{channel.description || 'No description provided.'}</p>

      {channel.analyticsScreenshots && channel.analyticsScreenshots.length > 0 && (
        <div className="mt-6">
          <h2 className="text-2xl font-semibold mb-2">Analytics Screenshots</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {channel.analyticsScreenshots.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`Analytics screenshot ${index + 1}`}
                className="rounded shadow"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ChannelDetailPage;
