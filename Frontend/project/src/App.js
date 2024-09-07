import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './Components/Header';
import Footer from './Components/Footer';
import Home from './Components/Home';
import QuotationDisplay from './Components/Quotationdisplay';
import InventoryManagement from './Components/InventoryManagement'; // Import InventoryManagement

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/quotation" element={<QuotationDisplay />} />
          <Route path="/inventory" element={<InventoryManagement />} /> {/* Add this route */}
        </Routes>
       
      </div>
    </Router>
  );
}

export default App;
