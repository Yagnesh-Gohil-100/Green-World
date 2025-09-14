
import React from "react";
import { FaBullseye, FaCalendarAlt, FaTimes, FaCheckCircle } from "react-icons/fa";
import "./Forms.css";
const GoalsForm = ({ onClose }) => {
 const handleSubmit = (e) => {
   e.preventDefault();
   alert("Goal added successfully 🎯");
   onClose();
 };
 return (
   <div className="modal-overlay">
     <div className="modal-card pop-in">
       <div className="form-header">
         <FaBullseye className="form-icon" />
         <h3 className="form-title">Set a New Goal</h3>
         <button className="close-btn" onClick={onClose}>
           <FaTimes />
         </button>
       </div>
       <form onSubmit={handleSubmit}>
         <div className="form-group">
           <label>
             <FaBullseye className="input-icon" /> Goal Title
           </label>
           <input
             type="text"
             name="title"
             className="form-control"
             placeholder="Eg: Reduce plastic usage"
             required
           />
         </div>
         <div className="form-group">
           <label>
             <FaCalendarAlt className="input-icon" /> Target Date
           </label>
           <input
             type="date"
             name="targetDate"
             className="form-control"
             required
           />
         </div>
         <div className="form-actions">
           <button type="submit" className="btn-eco">
             <FaCheckCircle /> Save
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
export default GoalsForm;