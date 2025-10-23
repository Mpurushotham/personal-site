import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Header: React.FC = () => {
  const { isAuthenticated, logout, currentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 ${
      isActive
        ? 'bg-accent text-primary'
        : 'text-text-secondary hover:text-text-main hover:bg-secondary'
    }`;

  return (
    <header className="bg-primary/80 backdrop-blur-sm sticky top-0 z-50 shadow-lg shadow-black/20">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <NavLink to="/" className="text-2xl font-bold text-accent">
              PM.
            </NavLink>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <NavLink to="/" className={navLinkClasses}>
                  Home
                </NavLink>
                <NavLink to="/tech-newsletters" className={navLinkClasses}>
                  Tech Newsletters
                </NavLink>
                {isAuthenticated && (
                   <NavLink to="/admin" className={navLinkClasses}>
                    Admin
                  </NavLink>
                )}
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            {isAuthenticated && (
               <div className="flex items-center gap-4">
                <span className="text-sm text-text-secondary hidden sm:block" title={currentUser?.email || ''}>
                  {currentUser?.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 rounded-md text-sm font-medium text-text-secondary hover:text-text-main hover:bg-secondary transition-colors duration-300"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
