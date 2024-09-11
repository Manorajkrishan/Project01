import React, { useState, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import '../CSS/Quotationdisplay.css';

const QuotationDisplay = () => {
  const [productList, setProductList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [quotation, setQuotation] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [qrCodeData, setQRCodeData] = useState('');

  // Mock data for products with details
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

    // Load quotation data from local storage
    const storedQuotation = localStorage.getItem('quotation');
    if (storedQuotation) {
      const parsedQuotation = JSON.parse(storedQuotation);
      setInvoiceNumber(parsedQuotation.invoiceNumber);
      setDateTime(parsedQuotation.dateTime);
      setQuotation(parsedQuotation.products);
    } else {
      const newInvoiceNumber = generateInvoiceNumber();
      setInvoiceNumber(newInvoiceNumber);
      const now = new Date();
      setDateTime(now.toLocaleString());
    }
  }, []);

  useEffect(() => {
    // Update local storage whenever the quotation changes
    localStorage.setItem('quotation', JSON.stringify({
      invoiceNumber,
      dateTime,
      products: quotation,
      totalAmount: calculateTotal(),
    }));
  }, [quotation, invoiceNumber, dateTime]);

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

  // Generate and download PDF
  const generatePDF = async () => {
    const doc = new jsPDF();
    const pdfContent = document.querySelector('.right-section');

    // Convert content to canvas
    const canvas = await html2canvas(pdfContent);
    const imgData = canvas.toDataURL('image/png');
    const imgWidth = 210; // A4 width in mm
    const imgHeight = canvas.height * imgWidth / canvas.width;
    const pdfHeight = imgHeight > 297 ? imgHeight / 2 : imgHeight; // A4 height in mm

    // Add image to PDF
    doc.addImage(imgData, 'PNG', 0, 0, imgWidth, pdfHeight);
    doc.save(`Quotation_${invoiceNumber}.pdf`);
  };

  // Share options
  const handleShare = () => {
    const url = generateQRCodeData();
    const encodedUrl = encodeURIComponent(url);
    const emailSubject = `Quotation ${invoiceNumber}`;
    const emailBody = `Please find the attached quotation: ${url}`;
    const whatsappMessage = `Here is your quotation: ${url}`;
    
    // Sharing via email
    window.open(`mailto:?subject=${emailSubject}&body=${emailBody}`, '_blank');
    
    // Sharing via WhatsApp
    window.open(`https://wa.me/?text=${whatsappMessage}`, '_blank');
  };

  useEffect(() => {
    setQRCodeData(generateQRCodeData());
  }, [quotation, invoiceNumber, dateTime]);

  return (
    <div className="quotation-display">
      <div className="left-section">
        <h2>Product Search</h2>
        <div className="search-section">
          <input
            type="text"
            placeholder="Enter product name, specs, or ID (e.g., '4GB RAM')"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button onClick={handleSearch}>Search</button>
        </div>
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

      <div className="right-section">
        <div className="quotation-header-info">
          <div className="invoice-number">
            <p>Invoice No: {invoiceNumber}</p>
            <p>{dateTime}</p>
          </div>
          <div className="qr-code">
            <QRCodeCanvas value={qrCodeData} />
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
              <button onClick={generatePDF}>Download PDF</button>
              <button onClick={handleShare}>Share</button>
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
