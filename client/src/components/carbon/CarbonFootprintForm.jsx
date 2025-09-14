
import React from "react";

import { FaLeaf, FaWeightHanging, FaTimes } from "react-icons/fa";

import "./Forms.css";

const CarbonFootprintForm = ({ onClose }) => {

 const handleSubmit = (e) => {

   e.preventDefault();

   alert("Carbon footprint logged successfully ✅");

   onClose();

 };

 return (

   <div className="modal-overlay">

     <div className="modal-card pop-in">

       <div className="form-header">

         <FaLeaf className="form-icon" />

         <h3 className="form-title">Log Carbon Footprint</h3>

         <button className="close-btn" onClick={onClose}>

           <FaTimes />

         </button>

       </div>

       <form onSubmit={handleSubmit}>

         <div className="form-group">

           <label>

             <FaLeaf className="input-icon" /> Activity

           </label>

           <input

             type="text"

             name="activity"

             className="form-control"

             placeholder="Eg: Car travel"

             required

           />

         </div>

         <div className="form-group">

           <label>

             <FaWeightHanging className="input-icon" /> Emission (kg CO₂)

           </label>

           <input

             type="number"

             name="emission"

             className="form-control"

             placeholder="Eg: 20"

             required

           />

         </div>

         <div className="form-actions">

           <button type="submit" className="btn-eco">

             <FaLeaf /> Save

           </button>

           <button type="button" className="btn btn-outline-light" onClick={onClose}>

             <FaTimes /> Cancel

           </button>

         </div>

       </form>

     </div>

   </div>

 );

};

export default CarbonFootprintForm;