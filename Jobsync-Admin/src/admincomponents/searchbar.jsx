import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import 'bootstrap-icons/font/bootstrap-icons.css'; 

const SearchBar = ({ searchQuery, setSearchQuery }) => {
  const handleInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <div className="mb-3"> 
      <div className="input-group">
        <input
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          placeholder="Search by name, company, or position..."
          className="form-control"
          style={{
            backgroundColor: 'transparent', 
            border: '1px solid #ccc', 
            borderRadius: '10px',
            paddingLeft: '35px', 
            marginLeft: '-120px'
          }}
        />
   
        <span className="input-group-text" style={{ position: 'absolute', left: '3px', top: '50%', transform: 'translateY(-50%)' , marginLeft: '-120px' }}>
          <i className="bi bi-search"></i> 
        </span>
      </div>
    </div>
  );
};

export default SearchBar;
