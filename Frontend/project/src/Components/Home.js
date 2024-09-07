import React from 'react';
import { useNavigate } from 'react-router-dom';
import quotation from '../Images/quotation.png';
import Inventory from '../Images/Inventory.jpeg';
import '../CSS/Home.css';
import Footer from './Footer';

const Home = () => {
  const navigate = useNavigate();

  const handleQuotationClick = () => {
    navigate('/quotation');
  };

  const handleInventoryClick = () => {
    navigate('/inventory');
  };

  return (
    <div className="content">
      <div className="left-side">
        <button className="inventory-button" onClick={handleInventoryClick}>
          <img src={Inventory} alt="Inventory" />
          <p>Inventory</p>
        </button>
      </div>

      <div className="right-side">
        <button className="quotation-button" onClick={handleQuotationClick}>
          <img src={quotation} alt="Create a Quotation" />
          <p>Create a Quotation</p>
        </button>
      </div>
      <br />
      <Footer />
    </div>
  );
};

export default Home;
