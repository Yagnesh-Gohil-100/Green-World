
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
 FaSeedling,
 FaBusAlt,
 FaBolt,
 FaRecycle,
 FaTrash,
 FaUndo,
 FaPlus,
 FaLeaf,
} from "react-icons/fa";
import { MdOutlineHome } from "react-icons/md";
import "./Dashboard.css";
const Dashboard = () => {
 const [activities, setActivities] = useState([]);
 const [loading, setLoading] = useState(true);
 // Modal states
 const [showGoalsForm, setShowGoalsForm] = useState(false);
 // Goals form state
 const [goalTransport, setGoalTransport] = useState("");
 const [goalEnergy, setGoalEnergy] = useState("");
 const [goalWaste, setGoalWaste] = useState("");
 useEffect(() => {
   axios
     .get("http://localhost:4000/CarbonFootprint")
     .then((res) => {
       setActivities(res.data);
       setLoading(false);
     })
     .catch((err) => console.error("Error", err));
 }, []);
 if (loading) return <h2>Loading...</h2>;
 if (!activities.length) return <h2>No Data Found...</h2>;
 const latest = activities[activities.length - 1];
 const total = latest.transport + latest.energy + latest.waste;
 // Goals handlers
 const handleDeleteGoals = () => {
   axios
     .delete("http://localhost:4000/goals/1")
     .then(() => alert("Goals deleted successfully"))
     .catch((err) => console.error("Error deleting goals", err));
 };
 const handleResetGoals = () => {
   axios
     .put("http://localhost:4000/goals/1", {
       transport: 0,
       energy: 0,
       waste: 0,
     })
     .then(() => alert("Goals reset successfully"))
     .catch((err) => console.error("Error resetting goals", err));
 };
 const handleGoalsSubmit = (e) => {
   e.preventDefault();
   const newGoals = { goalTransport, goalEnergy, goalWaste };
   axios
     .post("http://localhost:4000/goals", newGoals)
     .then(() => {
       alert("Goals set!");
       setShowGoalsForm(false);
     })
     .catch((err) => console.error("Error setting goals", err));
 };
 return (
   <div className="dashboard container mt-4">
     <h2 className="dashboard-title">
       <FaSeedling className="text-success me-2" />
       Your Eco Dashboard
     </h2>
     <p className="dashboard-subtitle">
       Track your progress and make a positive environmental impact
     </p>
     {/* Stats */}
     <div className="row g-3">
       <div className="col-md-3 col-sm-6">
         <div className="card stat-card p-3">
           <p className="label">Total Carbon Footprint</p>
           <h3>{total} tons CO₂</h3>
           <span className="small-text">This month</span>
         </div>
       </div>
       <div className="col-md-3 col-sm-6">
         <div className="card stat-card p-3">
           <p className="label">Monthly Target</p>
           <h3>2 tons CO₂</h3>
           <span className="small-text">Goal for this month</span>
         </div>
       </div>
       <div className="col-md-3 col-sm-6">
         <div className="card stat-card p-3">
           <p className="label">Reduction</p>
           <h3>15%</h3>
           <span className="small-text">From last month</span>
         </div>
       </div>
       <div className="col-md-3 col-sm-6">
         <div className="card stat-card p-3">
           <p className="label">Achievements</p>
           <h3>3</h3>
           <span className="small-text">Badges earned</span>
         </div>
       </div>
     </div>
     {/* Carbon Footprint Breakdown */}
     <div className="row mt-4">
       <div className="card col-md-6 p-3">
         <h5>
           <FaLeaf className="text-success me-2" />
           Carbon Footprint Breakdown
         </h5>
         <p>
           <FaBusAlt className="me-2 text-secondary" />
           Transportation
         </p>
         <div className="progress mb-2">
           <div
             className="progress-bar bg-success"
             style={{
               width: total ? `${(latest.transport / total) * 100}%` : "0%",
             }}
           ></div>
         </div>
         <p>
           <MdOutlineHome className="me-2 text-secondary" />
           Energy
         </p>
         <div className="progress mb-2">
           <div
             className="progress-bar bg-success"
             style={{
               width: total ? `${(latest.energy / total) * 100}%` : "0%",
             }}
           ></div>
         </div>
         <p>
           <FaRecycle className="me-2 text-secondary" />
           Waste
         </p>
         <div className="progress mb-2">
           <div
             className="progress-bar bg-success"
             style={{
               width: total ? `${(latest.waste / total) * 100}%` : "0%",
             }}
           ></div>
         </div>
         {/* Disabled Log Activity button (for now goes nowhere) */}
         <button
           className="btn btn-outline-success mt-3"
           onClick={() => alert("Navigate to Log Activities Page soon!")}
         >
           <FaPlus className="me-1" /> Log Activity
         </button>
       </div>
       {/* Goals */}
       <div className="col-md-6">
         <div className="card p-3 shadow-sm">
           <h5>
             <FaSeedling className="text-success me-2" />
             Sustainability Goals
           </h5>
           <div className="mb-3">
             <p>
               <FaBusAlt className="me-2 text-secondary" />
               Reduce Transportation Emissions
             </p>
             <div className="progress">
               <div className="progress-bar bg-success" style={{ width: "19%" }}>
                 19%
               </div>
             </div>
             <span className="goal-text">Target: 30% reduction</span>
           </div>
           <div className="mb-3">
             <p>
               <MdOutlineHome className="me-2 text-secondary" />
               Lower Energy Consumption
             </p>
             <div className="progress">
               <div className="progress-bar bg-success" style={{ width: "20%" }}>
                 20%
               </div>
             </div>
             <span className="goal-text">Target: 25% reduction</span>
           </div>
           <div>
             <p>
               <FaRecycle className="me-2 text-secondary" />
               Minimize Waste Generation
             </p>
             <div className="progress">
               <div className="progress-bar bg-success" style={{ width: "18%" }}>
                 18%
               </div>
             </div>
             <span className="goal-text">Target: 40% reduction</span>
           </div>
           <div className="d-flex gap-2 mt-3 flex-wrap">
             <button
               className="btn btn-success"
               onClick={() => setShowGoalsForm(true)}
             >
               <FaPlus className="me-1" /> Set Goals
             </button>
             <button className="btn btn-danger" onClick={handleDeleteGoals}>
               <FaTrash className="me-1" /> Delete
             </button>
             <button className="btn btn-warning" onClick={handleResetGoals}>
               <FaUndo className="me-1" /> Reset
             </button>
           </div>
         </div>
       </div>
     </div>
     {/* Achievements */}
     <div className="card p-3 mt-4 achievements-card">
       <h5>Recent Achievements</h5>
       <div className="d-flex gap-3 mt-2 flex-wrap">
         <span className="badge-card">🌱 Eco Warrior</span>
         <span className="badge-card">🚌 Green Commuter</span>
         <span className="badge-card">⚡ Energy Saver</span>
       </div>
     </div>
     {/* Modal for Goals Form */}
     {showGoalsForm && (
       <div className="modal-overlay fade-in">
         <div className="modal-card">
           <button
             className="btn-close float-end"
             onClick={() => setShowGoalsForm(false)}
           ></button>
           <h5 className="mb-3">Set Sustainability Goals</h5>
           <form onSubmit={handleGoalsSubmit}>
             <div className="mb-3">
               <label>Transport Goal (%)</label>
               <input
                 type="number"
                 className="form-control"
                 value={goalTransport}
                 onChange={(e) => setGoalTransport(e.target.value)}
                 required
               />
             </div>
             <div className="mb-3">
               <label>Energy Goal (%)</label>
               <input
                 type="number"
                 className="form-control"
                 value={goalEnergy}
                 onChange={(e) => setGoalEnergy(e.target.value)}
                 required
               />
             </div>
             <div className="mb-3">
               <label>Waste Goal (%)</label>
               <input
                 type="number"
                 className="form-control"
                 value={goalWaste}
                 onChange={(e) => setGoalWaste(e.target.value)}
                 required
               />
             </div>
             <div className="d-flex gap-2">
               <button type="submit" className="btn btn-success w-100">
                 Save Goals
               </button>
               <button
                 type="button"
                 className="btn btn-secondary w-100"
                 onClick={() => setShowGoalsForm(false)}
               >
                 Cancel
               </button>
             </div>
           </form>
         </div>
       </div>
     )}
   </div>
 );
};
export default Dashboard;