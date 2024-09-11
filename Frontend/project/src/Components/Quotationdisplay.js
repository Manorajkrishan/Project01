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
  const [showShareOptions, setShowShareOptions] = useState(false);

  // Mock data for products with details
  const mockProducts = [
    { id: 1, name: 'Product 1', brand: 'Brand A', specs: '4GB RAM', price: 100, available: true },
    { id: 2, name: 'Product 2', brand: 'Brand B', specs: '8GB RAM', price: 200, available: true },
    { id: 3, name: 'Product 3', brand: 'Brand C', specs: '16GB RAM', price: 300, available: false },
    // Add more products as needed
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

  // Generate and store PDF
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
    return doc.output('blob');
  };

  // Trigger file download
  const downloadPDF = async () => {
    const pdfBlob = await generatePDF();
    const url = URL.createObjectURL(pdfBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Quotation_${invoiceNumber}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Handle share options
  const handleShareOption = async (option) => {
    const pdfBlob = await generatePDF();
    const url = URL.createObjectURL(pdfBlob);

    if (option === 'email') {
      // For email, the user has to manually attach the file in their email client
      alert('PDF saved. You can now attach it manually to your email.');
    } else if (option === 'whatsapp') {
      // Open WhatsApp web with a pre-filled message; file upload needs to be done manually
      alert('PDF saved. You can now upload it manually in WhatsApp.');
      window.open(`https://web.whatsapp.com/`, '_blank');
    }

    // Hide share options after selection
    setShowShareOptions(false);
    URL.revokeObjectURL(url);
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
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Total</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {quotation.map((product) => (
                    <tr key={product.id}>
                      <td>{product.name}</td>
                      <td>${product.price}</td>
                      <td>
                        <button onClick={() => decreaseQuantity(product.id)}>-</button>
                        {product.quantity}
                        <button onClick={() => increaseQuantity(product.id)}>+</button>
                      </td>
                      <td>${(product.price * product.quantity).toFixed(2)}</td>
                      <td>
                        <button onClick={() => removeFromQuotation(product.id)}>Remove</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <h4>Total Amount: ${calculateTotal()}</h4>
              <button onClick={downloadPDF}>Generate PDF</button>
              <button onClick={() => setShowShareOptions(true)}>Share</button>
            </div>
          ) : (
            <p>No products added to the quotation.</p>
          )}
        </div>

        {/* Share Options Modal */}
        {showShareOptions && (
          <div className="share-options">
            <button onClick={() => handleShareOption('email')}>Share via Email</button>
            <button onClick={() => handleShareOption('whatsapp')}>Share via WhatsApp</button>
            <button onClick={() => setShowShareOptions(false)}>Close</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuotationDisplay;
