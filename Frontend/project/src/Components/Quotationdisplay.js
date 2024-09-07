import React, { useState, useEffect } from 'react';
// Import QRCodeCanvas instead of QRCode
import { QRCodeCanvas } from 'qrcode.react';
import '../CSS/Quotationdisplay.css';


const QuotationDisplay = () => {
  // State for the list of products
  const [productList, setProductList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [quotation, setQuotation] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [dateTime, setDateTime] = useState('');

  // Mock data for products with details (can be replaced with real API data)
  const mockProducts = [
    { id: 1, name: 'Laptop', brand: 'Dell', specs: '8GB RAM, 256GB SSD', price: 1000, available: true },
    { id: 2, name: 'Keyboard', brand: 'Logitech', specs: 'Mechanical', price: 100, available: true },
    { id: 3, name: 'Mouse', brand: 'HP', specs: 'Wireless', price: 50, available: false },
    { id: 4, name: 'Monitor', brand: 'Samsung', specs: '27 inch, 1080p', price: 300, available: true },
    { id: 5, name: 'RAM', brand: 'Corsair', specs: '4GB, DDR4', price: 40, available: true },
    { id: 6, name: 'RAM', brand: 'Kingston', specs: '4GB, DDR3', price: 35, available: true },
    { id: 7, name: 'RAM', brand: 'Crucial', specs: '8GB, DDR4', price: 70, available: true },
  ];

  // Generate unique invoice number
  const generateInvoiceNumber = () => {
    const randomStr = Math.random().toString(36).substring(2, 7).toUpperCase();
    return `INV-${randomStr}-${Date.now()}`;
  };

  // Fetch data or use mock data on component mount
  useEffect(() => {
    setProductList(mockProducts);
    setInvoiceNumber(generateInvoiceNumber());
    const now = new Date();
    setDateTime(now.toLocaleString());
  }, []);

  // Handle search functionality for product name or specs
  const handleSearch = () => {
    const filtered = productList.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.specs.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.id.toString() === searchTerm
    );
    setFilteredProducts(filtered);
  };

  // Check if a product is available and add it to the quotation
  const addToQuotation = (product) => {
    if (product.available) {
      setQuotation((prevQuotation) => {
        const updatedQuotation = [...prevQuotation];
        const index = updatedQuotation.findIndex((p) => p.id === product.id);

        if (index === -1) {
          updatedQuotation.push({ ...product, quantity: 1 });
        } else {
          updatedQuotation[index].quantity += 1;
        }

        return updatedQuotation;
      });
    } else {
      alert(`${product.name} is not available.`);
    }
  };

  // Increase quantity
  const increaseQuantity = (id) => {
    setQuotation((prevQuotation) =>
      prevQuotation.map((product) =>
        product.id === id ? { ...product, quantity: product.quantity + 1 } : product
      )
    );
  };

  // Decrease quantity
  const decreaseQuantity = (id) => {
    setQuotation((prevQuotation) =>
      prevQuotation
        .map((product) =>
          product.id === id
            ? { ...product, quantity: product.quantity - 1 }
            : product
        )
        .filter((product) => product.quantity > 0) // Remove product if quantity becomes zero
    );
  };

  // Remove a product from the quotation
  const removeFromQuotation = (id) => {
    setQuotation((prevQuotation) =>
      prevQuotation.filter((product) => product.id !== id)
    );
  };

  // Calculate the total amount of the quotation
  const calculateTotal = () => {
    return quotation.reduce(
      (total, product) => total + product.price * product.quantity,
      0
    ).toFixed(2);
  };

  // Generate QR code data
  const generateQRCodeData = () => {
    return JSON.stringify({
      invoiceNumber,
      dateTime,
      products: quotation,
      totalAmount: calculateTotal(),
    });
  };

  return (
    <div className="quotation-display">
      <div className="left-section">
        <h2>Product Search</h2>

        {/* Search for a product */}
        <div className="search-section">
          <input
            type="text"
            placeholder="Enter product name, specs, or ID (e.g., '4GB RAM')"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button onClick={handleSearch}>Search</button>
        </div>

        {/* Display product list only after search */}
        {filteredProducts.length > 0 ? (
          <div className="product-list">
            <h3>Search Results:</h3>
            <ul>
              {filteredProducts.map((product) => (
                <li key={product.id}>
                  <strong>{product.name}</strong> - {product.brand} - {product.specs} - ${product.price}{' '}
                  <button onClick={() => addToQuotation(product)}>Add to Quotation</button>
                </li>
              ))}
            </ul>
          </div>
        ) : searchTerm ? (
          <p>No products found matching your search.</p>
        ) : null}
      </div>

      {/* Quotation Display on the Right Side */}
      <div className="right-section">
        <div className="quotation-header-info">
          <div className="invoice-number">
            <p>Invoice No: {invoiceNumber}</p>
            <p>{dateTime}</p>
          </div>
          <div className="qr-code">
            {/* Generate QR code */}
            <QRCodeCanvas value={generateQRCodeData()} />
          </div>
        </div>
        <h2>Quotation</h2>
        <div className="quotation-sheet">
          {quotation.length > 0 ? (
            <div>
              <table className="quotation-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Brand</th>
                    <th>Specs</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {quotation.map((product) => (
                    <tr key={product.id}>
                      <td>{product.name}</td>
                      <td>{product.brand}</td>
                      <td>{product.specs}</td>
                      <td>${product.price}</td>
                      <td>{product.quantity}</td>
                      <td>
                        <button onClick={() => increaseQuantity(product.id)}>+</button>
                        <button onClick={() => decreaseQuantity(product.id)}>-</button>
                        <button onClick={() => removeFromQuotation(product.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <h4>Total Amount: ${calculateTotal()}</h4>
            </div>
          ) : (
            <p>No products in the quotation.</p>
          )}
        </div>
      </div>
     
     
    </div>
  );
};

export default QuotationDisplay;
