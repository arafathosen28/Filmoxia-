import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center">
            <span className="text-xl font-bold">Filmoxia</span>
          </Link>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/admin/dashboard\" className="hover:text-gray-300">
                  Dashboard
                </Link>
                <button
                  onClick={logout}
                  className="hover:text-gray-300"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link to="/admin/login" className="hover:text-gray-300">
                Admin Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar