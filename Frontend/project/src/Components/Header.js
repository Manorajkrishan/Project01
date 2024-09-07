import React from 'react';
import '../CSS/Header.css';
import logo from '../Images/Logo.jpeg'

const Header = () => {
  return (
    <header className="App-header">
      <img src={logo} alt="Company Logo" className="logo" />
      <h1>Welcome to Cyberpunch Store</h1>
    </header>
  );
};

export default Header;
