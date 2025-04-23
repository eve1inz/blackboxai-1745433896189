import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AdminPanelPage() {
  const [users, setUsers] = useState([]);
  const [channels, setChannels] = useState([]);
  const [selectedTab, setSelectedTab] = useState('users');
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchUsers();
    fetchChannels();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data);
    } catch (error) {
      setError('Failed to fetch users');
      console.error(error);
    }
  };

  const fetchChannels = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/channels', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setChannels(response.data);
    } catch (error) {
      setError('Failed to fetch channels');
      console.error(error);
    }
  };

  const handleBanUser = async (userId) => {
    try {
      await axios.put(
        `http://localhost:5000/api/users/${userId}/ban`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchUsers();
    } catch (error) {
      setError('Failed to ban user');
      console.error(error);
    }
  };

  const handleWarnUser = async (userId) => {
    try {
      await axios.put(
        `http://localhost:5000/api/users/${userId}/warn`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchUsers();
    } catch (error) {
      setError('Failed to warn user');
      console.error(error);
    }
  };

  const handleDeleteChannel = async (channelId) => {
    try {
      await axios.delete(`http://localhost:5000/api/channels/${channelId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchChannels();
    } catch (error) {
      setError('Failed to delete channel');
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <h1 className="text-3xl font-bold text-youtubeRed mb-6">Admin Panel</h1>
      {error && <p className="text-red-600 mb-4">{error}</p>}

      <div className="mb-6">
        <button
          className={`mr-4 px-4 py-2 rounded ${
            selectedTab === 'users' ? 'bg-youtubeRed text-white' : 'bg-gray-200'
          }`}
          onClick={() => setSelectedTab('users')}
        >
          Users
        </button>
        <button
          className={`px-4 py-2 rounded ${
            selectedTab === 'channels' ? 'bg-youtubeRed text-white' : 'bg-gray-200'
          }`}
          onClick={() => setSelectedTab('channels')}
        >
          Channels
        </button>
      </div>

      {selectedTab === 'users' && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Users</h2>
          {users.length === 0 ? (
            <p>No users found.</p>
          ) : (
            <table className="w-full table-auto border-collapse border border-gray-300">
              <thead>
                <tr>
                  <th className="border border-gray-300 px-4 py-2">ID</th>
                  <th className="border border-gray-300 px-4 py-2">Nickname</th>
                  <th className="border border-gray-300 px-4 py-2">Email</th>
                  <th className="border border-gray-300 px-4 py-2">Role</th>
                  <th className="border border-gray-300 px-4 py-2">Banned</th>
                  <th className="border border-gray-300 px-4 py-2">Warnings</th>
                  <th className="border border-gray-300 px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="border border-gray-300 px-4 py-2">{user.id}</td>
                    <td className="border border-gray-300 px-4 py-2">{user.nickname}</td>
                    <td className="border border-gray-300 px-4 py-2">{user.email}</td>
                    <td className="border border-gray-300 px-4 py-2">{user.role}</td>
                    <td className="border border-gray-300 px-4 py-2">{user.banned ? 'Yes' : 'No'}</td>
                    <td className="border border-gray-300 px-4 py-2">{user.warnings}</td>
                    <td className="border border-gray-300 px-4 py-2 space-x-2">
                      <button
                        onClick={() => handleBanUser(user.id)}
                        className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-800"
                      >
                        Ban
                      </button>
                      <button
                        onClick={() => handleWarnUser(user.id)}
                        className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-700"
                      >
                        Warn
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {selectedTab === 'channels' && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Channels</h2>
          {channels.length === 0 ? (
            <p>No channels found.</p>
          ) : (
            <table className="w-full table-auto border-collapse border border-gray-300">
              <thead>
                <tr>
                  <th className="border border-gray-300 px-4 py-2">ID</th>
                  <th className="border border-gray-300 px-4 py-2">Title</th>
                  <th className="border border-gray-300 px-4 py-2">Seller ID</th>
                  <th className="border border-gray-300 px-4 py-2">Price</th>
                  <th className="border border-gray-300 px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {channels.map((channel) => (
                  <tr key={channel.id}>
                    <td className="border border-gray-300 px-4 py-2">{channel.id}</td>
                    <td className="border border-gray-300 px-4 py-2">{channel.title}</td>
                    <td className="border border-gray-300 px-4 py-2">{channel.sellerId}</td>
                    <td className="border border-gray-300 px-4 py-2">${channel.price.toFixed(2)}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      <button
                        onClick={() => handleDeleteChannel(channel.id)}
                        className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-800"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

export default AdminPanelPage;
