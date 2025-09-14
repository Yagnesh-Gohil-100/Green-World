import React from "react";

import "../../pages/Comm/Community.css";

const CategoryFilter = ({ categories, selectedCategory, onCategoryChange }) => {

 return (

   <div className="chip-row" role="tablist">

     {categories.map((cat) => (

       <button

         key={cat}

         role="tab"

         aria-selected={selectedCategory === cat}

         className={`chip ${selectedCategory === cat ? "active" : ""}`}

         onClick={() => onCategoryChange(cat)}

       >

         {cat}

       </button>

     ))}

   </div>

 );

};

export default CategoryFilter;
 