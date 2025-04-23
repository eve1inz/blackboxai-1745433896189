import React from 'react';
import { Link } from 'react-router-dom';

function ChannelCard({ channel }) {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <img
        src={channel.coverImage || 'https://via.placeholder.com/400x200?text=No+Image'}
        alt={channel.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-youtubeDark">{channel.title}</h3>
        <p className="text-sm text-gray-600">{channel.subscribers.toLocaleString()} subscribers</p>
        <p className="text-red-600 font-bold text-xl mt-2">${channel.price.toFixed(2)}</p>
        <Link
          to={`/channel/${channel.id}`}
          className="inline-block mt-4 px-4 py-2 bg-youtubeRed text-white rounded hover:bg-red-700 transition-colors"
        >
          More Details
        </Link>
      </div>
    </div>
  );
}

export default ChannelCard;
