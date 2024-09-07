// src/Components/InventoryManagement.js
import React, { useState } from 'react';
import '../CSS/InventoryManagement.css';

const InventoryManagement = () => {
  const [files, setFiles] = useState([]);
  const [itemType, setItemType] = useState('');
  const [brandName, setBrandName] = useState('');
  const [capacity, setCapacity] = useState('');
  const [color, setColor] = useState('');
  const [specialFeatures, setSpecialFeatures] = useState('');
  const [price, setPrice] = useState('');

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length > 5) {
      alert('You can only upload up to 5 photos.');
      return;
    }
    setFiles(selectedFiles);
  };

  const handleUpdate = () => {
    if (files.length === 0) {
      alert('Please upload at least one photo.');
      return;
    }
    // Logic for updating the inventory with file and form details
    console.log({
      itemType,
      brandName,
      capacity,
      color,
      specialFeatures,
      price,
      files,
    });
    // Clear form after submission
    setItemType('');
    setBrandName('');
    setCapacity('');
    setColor('');
    setSpecialFeatures('');
    setPrice('');
    setFiles([]);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent the default form submission
      handleUpdate(); // Trigger the update function
    }
  };

  return (
    <div className="inventory-management">
      <div className="left-section">
        <h2>Upload Photos</h2>
        <input
          type="file"
          accept=".jpeg, .png"
          multiple
          onChange={handleFileChange}
        />
        <p>Selected Photos:</p>
        <ul>
          {files.length > 0 ? (
            files.map((file, index) => (
              <li key={index}>{file.name}</li>
            ))
          ) : (
            <li>No photos selected.</li>
          )}
        </ul>
      </div>
      <div className="right-section">
        <h2>Inventory Form</h2>
        <label>
          What is this?
          <input
            type="text"
            value={itemType}
            onChange={(e) => setItemType(e.target.value)}
            placeholder="e.g., RAM, Laptop"
            onKeyDown={handleKeyDown}
          />
        </label>
        <label>
          Brand Name:
          <input
            type="text"
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </label>
        <label>
          Capacity:
          <input
            type="text"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </label>
        <label>
          Color:
          <input
            type="text"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </label>
        <label>
          Special Features:
          <input
            type="text"
            value={specialFeatures}
            onChange={(e) => setSpecialFeatures(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </label>
        <label>
          Price:
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </label>
        <button onClick={handleUpdate}>Update Inventory</button>
      </div>
    </div>
  );
};

export default InventoryManagement;
