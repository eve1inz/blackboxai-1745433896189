import React, { useState, useEffect } from 'react';
import axios from 'axios';

function SellerPanelPage() {
  const [channels, setChannels] = useState([]);
  const [form, setForm] = useState({
    title: '',
    subscribers: '',
    monetizationAvailable: false,
    price: '',
    mb: '',
    description: '',
  });
  const [coverImage, setCoverImage] = useState(null);
  const [analyticsScreenshots, setAnalyticsScreenshots] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (user && user.role === 'seller') {
      fetchChannels();
    }
  }, []);

  const fetchChannels = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/channels', {
        params: { sellerId: user.id },
        headers: { Authorization: `Bearer ${token}` },
      });
      setChannels(response.data);
    } catch (error) {
      console.error('Error fetching channels:', error);
      setError('Failed to fetch channels');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === 'coverImage') {
      if (files[0] && files[0].size > 5 * 1024 * 1024) {
        setError('Cover image must be less than 5MB');
        e.target.value = '';
        return;
      }
      setCoverImage(files[0]);
    } else if (name === 'analyticsScreenshots') {
      const selectedFiles = Array.from(files);
      if (selectedFiles.some(file => file.size > 5 * 1024 * 1024)) {
        setError('Each analytics screenshot must be less than 5MB');
        e.target.value = '';
        return;
      }
      if (selectedFiles.length > 5) {
        setError('Maximum 5 analytics screenshots allowed');
        e.target.value = '';
        return;
      }
      setAnalyticsScreenshots(selectedFiles);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const formData = new FormData();
      Object.keys(form).forEach(key => {
        formData.append(key, form[key]);
      });

      if (coverImage) {
        formData.append('coverImage', coverImage);
      }

      analyticsScreenshots.forEach(file => {
        formData.append('analyticsScreenshots', file);
      });

      await axios.post('http://localhost:5000/api/channels', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      setSuccess('Channel posted successfully');
      setForm({
        title: '',
        subscribers: '',
        monetizationAvailable: false,
        price: '',
        mb: '',
        description: '',
      });
      setCoverImage(null);
      setAnalyticsScreenshots([]);
      // Reset file inputs
      document.getElementById('coverImage').value = '';
      document.getElementById('analyticsScreenshots').value = '';
      fetchChannels();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post channel');
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== 'seller') {
    return (
      <div className="container mx-auto p-4">
        <p className="text-red-600">Access denied. You must be a seller to view this page.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold text-youtubeRed mb-6">Seller Panel</h1>

      <form onSubmit={handleSubmit} className="mb-8 bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Post a New Channel</h2>
        {error && <p className="text-red-600 mb-4">{error}</p>}
        {success && <p className="text-green-600 mb-4">{success}</p>}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block font-semibold mb-1">Cover Image (Max 5MB)</label>
            <input
              type="file"
              id="coverImage"
              name="coverImage"
              onChange={handleFileChange}
              accept="image/*"
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Title *</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Subscribers</label>
            <input
              type="number"
              name="subscribers"
              value={form.subscribers}
              onChange={handleChange}
              min="0"
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Price *</label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">MB</label>
            <input
              type="number"
              name="mb"
              value={form.mb}
              onChange={handleChange}
              min="0"
              step="0.01"
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div className="md:col-span-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="monetizationAvailable"
                checked={form.monetizationAvailable}
                onChange={handleChange}
                className="form-checkbox h-5 w-5 text-youtubeRed"
              />
              <span className="font-semibold">Monetization Available</span>
            </label>
          </div>

          <div className="md:col-span-2">
            <label className="block font-semibold mb-1">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="4"
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block font-semibold mb-1">Analytics Screenshots (Max 5 files, 5MB each)</label>
            <input
              type="file"
              id="analyticsScreenshots"
              name="analyticsScreenshots"
              onChange={handleFileChange}
              accept="image/*"
              multiple
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`mt-6 px-6 py-2 bg-youtubeRed text-white rounded hover:bg-red-700 transition-colors ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Posting...' : 'Post Channel'}
        </button>
      </form>

      <h2 className="text-2xl font-semibold mb-4">Your Channels</h2>
      {channels.length === 0 ? (
        <p>No channels posted yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {channels.map((channel) => (
            <div key={channel.id} className="bg-white rounded shadow p-4">
              <img
                src={channel.coverImage || 'https://via.placeholder.com/400x200?text=No+Image'}
                alt={channel.title}
                className="w-full h-40 object-cover rounded"
              />
              <h3 className="text-lg font-semibold mt-2">{channel.title}</h3>
              <p>{channel.subscribers.toLocaleString()} subscribers</p>
              <p className="text-red-600 font-bold">${channel.price.toFixed(2)}</p>
              {channel.monetizationAvailable && (
                <p className="text-green-600">Monetization Available</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SellerPanelPage;
