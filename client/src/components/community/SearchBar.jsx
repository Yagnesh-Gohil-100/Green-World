
import React from 'react';

import "../../pages/Comm/Community.css";

const SearchBar = ({ searchQuery, onSearchChange }) => {

 return (

   <div className="search-box">

     <input

       type="text"

       placeholder="Search tips by title..."

       value={searchQuery}

       onChange={(e) => onSearchChange(e.target.value)}

     />

   </div>

 );

};

export default SearchBar;
 