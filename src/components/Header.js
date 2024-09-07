import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import logo from '../images/ligdingo-logo.png'; // Update the path if needed

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => {
    console.log('User object:', user);
  }, [user]);

  const handleIconClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    logout();
    console.log('Logging out...');
  };

  const styles = {
    header: {
      backgroundColor: '#333',
      color: 'white',
      padding: '20px',
      position: 'fixed', // Ensure the header is fixed at the top
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000, // Make sure it's on top of other content
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center', // Center all content horizontally
      gap: '20px', // Space between the logo and user section
    },
    logoContainer: {
      marginLeft: 160,
      flex: 1, // Allows the logo to stay centered
      display: 'flex',
      justifyContent: 'center', // Center the logo within its container
    },
    logo: {
      maxHeight: '100px', // Adjust the max-height as needed
      maxWidth: 'auto',  // Keep the aspect ratio
      objectFit: 'contain',
    },
    userSection: {
      display: 'flex',
      alignItems: 'center',
    },
    userIconContainer: {
      position: 'relative',
    },
    userIcon: {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      cursor: 'pointer',
    },
    dropdownMenu: {
      position: 'absolute',
      top: '50px',
      right: 0,
      backgroundColor: 'white',
      color: 'black',
      border: '1px solid #ccc',
      padding: '10px',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
    },
    dropdownButton: {
      background: 'none',
      border: 'none',
      color: 'black',
      cursor: 'pointer',
      fontSize: '14px',
    },
    userText: {
      marginLeft: '20px',
    }
  };

  return (
    <header style={styles.header}>
      <div style={styles.logoContainer}>
        <img src={logo} alt="Λιγδ-ingo Logo" style={styles.logo} />
      </div>
      <div style={styles.userSection}>
        {user && user.profileImage ? (
          <div style={styles.userIconContainer} onClick={handleIconClick}>
            <img src={user.profileImage} alt="User Icon" style={styles.userIcon} />
            {isDropdownOpen && (
              <div style={styles.dropdownMenu}>
                <button style={styles.dropdownButton} onClick={handleLogout}>
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <p style={styles.userText}>User not logged in</p>
        )}
      </div>
    </header>
  );
};

export default Header;
