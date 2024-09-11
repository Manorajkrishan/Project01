import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../CSS/QuotationPage.css'; // Import your CSS

const QuotationPage = () => {
  const { id } = useParams(); // Get the uniqueID from URL
  const [quotationData, setQuotationData] = useState(null);

  useEffect(() => {
    const data = localStorage.getItem(id);
    if (data) {
      setQuotationData(JSON.parse(data));
    }
  }, [id]);

  if (!quotationData) return <p>Loading...</p>;

  return (
    <div className="quotation-page">
      <h1>Quotation</h1>
      <p>Invoice No: {quotationData.invoiceNumber}</p>
      <p>Date: {quotationData.dateTime}</p>
      <table className="quotation-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Brand</th>
            <th>Specs</th>
            <th>Price</th>
            <th>Quantity</th>
          </tr>
        </thead>
        <tbody>
          {quotationData.products.map((product) => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>{product.brand}</td>
              <td>{product.specs}</td>
              <td>${product.price}</td>
              <td>{product.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h4>Total Amount: ${quotationData.totalAmount}</h4>
    </div>
  );
};

export default QuotationPage;
