import React, { useState } from 'react';
import { Form, InputGroup, Button } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';

export default function SearchBar2({ placeholder, onSearch }) {
    const [searchText, setSearchText] = useState('');

    const handleSearch = (event) => {
        setSearchText(event.target.value);
        if (onSearch) {
            onSearch(event.target.value);
        }
    };

    return (
        <>
      <div className="w-50 w-md-100">
    <InputGroup className="mb-3">
        <Form.Control
            type="text"
            placeholder={placeholder || "Search..."}
            value={searchText}
            onChange={handleSearch}
            className="rounded-start"
        />
        <Button 
            variant="primary" 
            className="rounded-end"
            onClick={() => onSearch(searchText)}
        >
            <FaSearch />
        </Button>
    </InputGroup>
</div>

        </>
    );
}
