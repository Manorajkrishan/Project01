import React, { useState } from 'react';

const products = [
  { id: 1, name: 'Laptop', brand: 'Dell', price: 1000, available: true },
  { id: 2, name: 'Keyboard', brand: 'Logitech', price: 50, available: false },
  { id: 3, name: 'Monitor', brand: 'Samsung', price: 300, available: true },
];

const SearchProducts = ({ onAddToQuotation }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleSearch = () => {
    const product = products.find(
      (item) => item.name.toLowerCase() === searchTerm.toLowerCase() || item.id === parseInt(searchTerm)
    );
    setSelectedProduct(product || null);
  };

  const handleAddToQuotation = () => {
    if (selectedProduct && selectedProduct.available) {
      onAddToQuotation(selectedProduct);
    } else {
      alert('Product is not available.');
    }
  };

  return (
    <div className="search-section">
      <input
        type="text"
        placeholder="Enter product number or name"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>

      {selectedProduct ? (
        <div className="product-details">
          <h3>Product Details</h3>
          <p>Name: {selectedProduct.name}</p>
          <p>Brand: {selectedProduct.brand}</p>
          <p>Price: ${selectedProduct.price}</p>
          <p>Availability: {selectedProduct.available ? 'In Stock' : 'Out of Stock'}</p>
          {selectedProduct.available && (
            <button onClick={handleAddToQuotation}>Add to Quotation</button>
          )}
        </div>
      ) : (
        <p>No product found.</p>
      )}
    </div>
  );
};

export default SearchProducts;
