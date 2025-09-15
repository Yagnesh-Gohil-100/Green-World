// src/pages/Dashboard/Goals/Goals.jsx
import React, { useState } from "react";
import axios from "axios";
import { MdErrorOutline } from "react-icons/md";
import { useAuth } from '../../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import "./Goals.css";

const Goals = ({ onClose, initialGoals, updateGoals }) => {
  const [form, setForm] = useState({ 
    transport: initialGoals?.transport || 200,
    energy: initialGoals?.energy || 150, 
    waste: initialGoals?.waste || 50 
  });
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const { logout } = useAuth();
  const navigate = useNavigate();

  // Get axios instance with auth headers (SAME AS YOUR COMMUNITY CODE)
  const getAuthAxios = () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.error('No token found in localStorage');
      throw new Error('Authentication token not found');
    }

    return axios.create({
      baseURL: 'http://localhost:5000/api',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const val = Number(value) || 0;
    setForm(prev => ({ ...prev, [name]: val }));
    setError(prev => ({ ...prev, [name]: "" }));
    setApiError("");
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!form.transport || form.transport < 50 || form.transport > 500) {
      newErrors.transport = "Transport must be between 50 and 500 km.";
    }
    if (!form.energy || form.energy < 50 || form.energy > 400) {
      newErrors.energy = "Energy must be between 50 and 400 kWh.";
    }
    if (!form.waste || form.waste < 10 || form.waste > 150) {
      newErrors.waste = "Waste must be between 10 and 150 kg.";
    }

    setError(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setApiError("");

    try {
      const authAxios = getAuthAxios();
      const response = await authAxios.post("/goals", {
        transport: Number(form.transport),
        energy: Number(form.energy),
        waste: Number(form.waste)
      });

      console.log('Save goals response:', response.data);

      if (response.data.success) {
        updateGoals(response.data.data);
        onClose();
      } else {
        throw new Error(response.data.error || "Failed to save goals");
      }

    } catch (err) {
      console.error("Error saving goals:", err);
      
      if (err.response?.status === 401) {
        setApiError("Session expired. Please log in again.");
        setTimeout(() => {
          logout();
          navigate('/signin');
        }, 2000);
      } else if (err.response?.data?.error) {
        setApiError(err.response.data.error);
      } else if (err.message) {
        setApiError(err.message);
      } else {
        setApiError("Failed to save goals. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const units = { 
    transport: "km", 
    energy: "kWh", 
    waste: "kg" 
  };

  const labels = {
    transport: "Transportation Distance",
    energy: "Energy Consumption",
    waste: "Waste Production"
  };

  const handleCancel = () => {
    if (!loading) {
      onClose();
    }
  };

  return (
    <div className="goals-modal-backdrop" onClick={handleCancel}>
      <div className="goals-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="goals-modal-header">
          <h2>🌱 Set Sustainability Goals</h2>
          <p>Define your monthly targets for a greener lifestyle</p>
        </div>

        <div className="goals-modal-content">
          {["transport", "energy", "waste"].map((type) => (
            <div className="goals-form-group" key={type}>
              <label htmlFor={type} className="goals-form-label">
                {labels[type]}
                <span className="units">({units[type]})</span>
              </label>
              
              <input
                id={type}
                type="number"
                name={type}
                value={form[type]}
                onChange={handleChange}
                min={type === "waste" ? 10 : 50}
                max={type === "transport" ? 500 : type === "energy" ? 400 : 150}
                className={error[type] ? "goals-input-error" : ""}
                disabled={loading}
                placeholder={`Enter ${units[type]}`}
              />
              
              {error[type] && (
                <div className="goals-error-message">
                  <MdErrorOutline className="error-icon" /> 
                  {error[type]}
                </div>
              )}
              
              <div className="goals-input-range">
                <span>Min: {type === "waste" ? 10 : 50}{units[type]}</span>
                <span>Max: {type === "transport" ? 500 : type === "energy" ? 400 : 150}{units[type]}</span>
              </div>
            </div>
          ))}

          {apiError && (
            <div className="goals-api-error">
              <MdErrorOutline className="error-icon" />
              {apiError}
            </div>
          )}
        </div>

        <div className="goals-modal-actions">
          <button 
            className="goals-btn-cancel" 
            onClick={handleCancel}
            disabled={loading}
            type="button"
          >
            Cancel
          </button>
          
          <button
            className="goals-btn-save"
            onClick={handleSave}
            disabled={loading}
            type="button"
          >
            {loading ? (
              <>
                <div className="goals-loading-spinner"></div>
                Saving...
              </>
            ) : (
              "Save Goals"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Goals;