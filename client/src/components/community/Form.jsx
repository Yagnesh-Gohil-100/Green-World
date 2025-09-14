import React, { useState } from "react";

import "../../pages/Comm/Community.css";

const Form = ({ onSubmitTip, onCancel }) => {

 const [newTip, setNewTip] = useState({

   title: "",

   content: "",

   category: "General",

 });

 const handleSubmit = async (e) => {

   e.preventDefault();

   if (!newTip.title.trim() || !newTip.content.trim()) return;

   await onSubmitTip(newTip);

   setNewTip({ title: "", content: "", category: "General" });

 };

 return (

   <div className="add-card pop-in">

     <h5 className="mb-3">Share Your Eco Tip</h5>

     <form onSubmit={handleSubmit}>

       <label className="form-label">Tip title</label>

       <input

         className="form-control"

         type="text"

         value={newTip.title}

         onChange={(e) => setNewTip({ ...newTip, title: e.target.value })}

         placeholder="e.g., Switch to LED Bulbs"

         required

       />

       <label className="form-label mt-3">Describe your tip</label>

       <textarea

         className="form-control"

         rows="4"

         value={newTip.content}

         onChange={(e) => setNewTip({ ...newTip, content: e.target.value })}

         placeholder="Add steps, benefits, savings, etc."

         required

       />

       <div className="mt-3">

         <label className="form-label">Category</label>

         <select

           className="form-select"

           value={newTip.category}

           onChange={(e) => setNewTip({ ...newTip, category: e.target.value })}

         >

           <option>General</option>

           <option>Energy</option>

           <option>Transport</option>

           <option>Home & Garden</option>

         </select>

       </div>

       <div className="d-flex justify-content-end gap-2 mt-4">

         <button type="button" className="btn btn-outline-light" onClick={onCancel}>

           Cancel

         </button>

         <button type="submit" className="btn btn-eco">

           Share Tip

         </button>

       </div>

     </form>

   </div>

 );

};

export default Form;
 