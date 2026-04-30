import  { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './navbar.css';

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = async () => {
    await logout();
    setIsDropdownOpen(false);
    navigate('/auth');
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <Link to="/">Testman</Link>
        </div>
        
        <div className="navbar-menu">
          {user ? (
            <div className="profile-container" ref={dropdownRef}>
              <button 
                className="profile-trigger" 
                onClick={toggleDropdown}
                aria-haspopup="true"
                aria-expanded={isDropdownOpen}
              >
                <img 
                  src={`https://ui-avatars.com/api/?name=${user.username || 'User'}&background=6366f1&color=fff`} 
                  alt="Profile" 
                  className="profile-pic" 
                />
              </button>
              
              {isDropdownOpen && (
                <div className="profile-dropdown">
                  <div className="dropdown-header">
                    <strong>{user.username}</strong>
                    <span>{user.email}</span>
                  </div>
                  <div className="dropdown-divider"></div>
                  <button className="dropdown-item logout-btn" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/auth" className="login-btn">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
