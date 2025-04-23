import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function Layout({ children }) {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-youtubeRed text-white p-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          YouTube Channel Marketplace
        </Link>
        <nav className="space-x-4">
          <Link to="/" className="hover:underline">
            Home
          </Link>
          {!user && (
            <>
              <Link to="/login" className="hover:underline">
                Login
              </Link>
              <Link to="/register" className="hover:underline">
                Register
              </Link>
            </>
          )}
          {user && user.role === 'buyer' && (
            <Link to={`/buyer-profile/${user.id}`} className="hover:underline">
              Profile
            </Link>
          )}
          {user && user.role === 'seller' && (
            <>
              <Link to="/seller-panel" className="hover:underline">
                Seller Panel
              </Link>
              <Link to={`/buyer-profile/${user.id}`} className="hover:underline">
                Profile
              </Link>
            </>
          )}
          {user && user.role === 'admin' && (
            <>
              <Link to="/admin-panel" className="hover:underline">
                Admin Panel
              </Link>
              <Link to={`/buyer-profile/${user.id}`} className="hover:underline">
                Profile
              </Link>
            </>
          )}
          {user && (
            <button
              onClick={handleLogout}
              className="bg-white text-youtubeRed px-3 py-1 rounded hover:bg-gray-200"
            >
              Logout
            </button>
          )}
        </nav>
      </header>
      <main className="flex-grow bg-gray-50">{children}</main>
      <footer className="bg-youtubeRed text-white p-4 text-center">
        &copy; {new Date().getFullYear()} YouTube Channel Marketplace
      </footer>
    </div>
  );
}

export default Layout;
