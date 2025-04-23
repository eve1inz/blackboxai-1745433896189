import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ChannelCard from '../components/ChannelCard';

function HomePage() {
  const [channels, setChannels] = useState([]);
  const [filters, setFilters] = useState({
    subscribersMin: '',
    subscribersMax: '',
    monetization: '',
    priceMin: '',
    priceMax: '',
    mbMin: '',
    mbMax: '',
    title: '',
  });

  useEffect(() => {
    fetchChannels();
  }, []);

  const fetchChannels = async () => {
    try {
      const params = {};
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params[key] = value;
      });
      const response = await axios.get('http://localhost:5000/api/channels', { params });
      setChannels(response.data);
    } catch (error) {
      console.error('Error fetching channels:', error);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchChannels();
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-youtubeRed mb-6">YouTube Channel Marketplace</h1>

      <form onSubmit={handleFilterSubmit} className="mb-6 bg-white p-4 rounded shadow">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block font-semibold mb-1">Subscribers Min</label>
            <input
              type="number"
              name="subscribersMin"
              value={filters.subscribersMin}
              onChange={handleFilterChange}
              className="w-full border border-gray-300 rounded px-2 py-1"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Subscribers Max</label>
            <input
              type="number"
              name="subscribersMax"
              value={filters.subscribersMax}
              onChange={handleFilterChange}
              className="w-full border border-gray-300 rounded px-2 py-1"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Monetization</label>
            <select
              name="monetization"
              value={filters.monetization}
              onChange={handleFilterChange}
              className="w-full border border-gray-300 rounded px-2 py-1"
            >
              <option value="">Any</option>
              <option value="true">Available</option>
              <option value="false">Not Available</option>
            </select>
          </div>
          <div>
            <label className="block font-semibold mb-1">Price Min</label>
            <input
              type="number"
              name="priceMin"
              value={filters.priceMin}
              onChange={handleFilterChange}
              className="w-full border border-gray-300 rounded px-2 py-1"
              step="0.01"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Price Max</label>
            <input
              type="number"
              name="priceMax"
              value={filters.priceMax}
              onChange={handleFilterChange}
              className="w-full border border-gray-300 rounded px-2 py-1"
              step="0.01"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">MB Min</label>
            <input
              type="number"
              name="mbMin"
              value={filters.mbMin}
              onChange={handleFilterChange}
              className="w-full border border-gray-300 rounded px-2 py-1"
              step="0.01"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">MB Max</label>
            <input
              type="number"
              name="mbMax"
              value={filters.mbMax}
              onChange={handleFilterChange}
              className="w-full border border-gray-300 rounded px-2 py-1"
              step="0.01"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={filters.title}
              onChange={handleFilterChange}
              className="w-full border border-gray-300 rounded px-2 py-1"
              placeholder="Search title"
            />
          </div>
        </div>
        <button
          type="submit"
          className="mt-4 px-4 py-2 bg-youtubeRed text-white rounded hover:bg-red-700 transition-colors"
        >
          Apply Filters
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {channels.length === 0 ? (
          <p>No channels found.</p>
        ) : (
          channels.map((channel) => <ChannelCard key={channel.id} channel={channel} />)
        )}
      </div>
    </div>
  );
}

export default HomePage;
