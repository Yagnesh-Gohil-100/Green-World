// src/components/forms/CarbonFootprintForm.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../contexts/AuthContext';
import "./CarbonFootprintForm.css";

const CarbonFootprintForm = () => {
  const [formData, setFormData] = useState({
    transport: 100,
    energy: 50,
    waste: ""
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { userType, logout } = useAuth();

  // Get axios instance with auth headers (SAME PATTERN AS GOALS)
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

  const validate = () => {
    const newErrors = {};
    if (formData.waste === "" || formData.waste < 0.1) {
      newErrors.waste = "Enter a valid waste amount (0.1-50 kg)";
    }
    if (formData.transport < 1 || formData.transport > 200) {
      newErrors.transport = "Transport must be between 1-200 km";
    }
    if (formData.energy < 1 || formData.energy > 100) {
      newErrors.energy = "Energy must be between 1-100 kWh";
    }
    return newErrors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (error[name]) {
      setError(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    
    if (Object.keys(validationErrors).length > 0) {
      setError(validationErrors);
      return;
    }

    setLoading(true);
    setError({});
    setMessage("");

    try {
      const authAxios = getAuthAxios();
      
      const payload = {
        transport: Number(formData.transport),
        energy: Number(formData.energy),
        waste: Number(formData.waste),
        userType: userType,
        timestamp: new Date().toISOString()
      };

      const response = await authAxios.post("/carbon-footprint", payload);

      setMessage("Carbon footprint data submitted successfully!");
      
      setTimeout(() => {
        // Redirect to appropriate dashboard based on user type
        if (userType === 'personal') {
          navigate('/dashboard/personal');
        } else if (userType === 'business') {
          navigate('/dashboard/business');
        } else if (userType === 'employee') {
          navigate('/dashboard/employee');
        } else {
          navigate('/dashboard');
        }
      }, 1500);

    } catch (err) {
      console.error("Submission error:", err);
      
      if (err.response?.status === 401) {
        setMessage("Session expired. Please log in again.");
        setTimeout(() => {
          logout();
          navigate('/signin');
        }, 2000);
      } else if (err.response?.data?.error) {
        setMessage(err.response.data.error);
      } else {
        setMessage("Failed to submit data. Please try again!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="carbon-form-container">
      <div className="carbon-form-card">
        <h2 className="carbon-form-title">
          Track Your Carbon Footprint
        </h2>
        <p className="carbon-form-subtitle">
          Adjust your daily activity values to calculate your environmental impact
        </p>

        <form onSubmit={handleSubmit} className="carbon-form">
          {/* Transport slider */}
          <div className="form-section">
            <label className="form-label">
              Transportation: <span className="value-display">{formData.transport} km/day</span>
            </label>
            <div className="slider-container">
              <input
                type="range"
                className="form-slider"
                name="transport"
                min="1"
                max="200"
                value={formData.transport}
                onChange={handleInputChange}
              />
              <div className="slider-limits">
                <span>1 km</span>
                <span>200 km</span>
              </div>
            </div>
            {error.transport && <p className="error-text">{error.transport}</p>}
          </div>

          {/* Energy slider */}
          <div className="form-section">
            <label className="form-label">
              Energy Consumption: <span className="value-display">{formData.energy} kWh/day</span>
            </label>
            <div className="slider-container">
              <input
                type="range"
                className="form-slider"
                name="energy"
                min="1"
                max="100"
                value={formData.energy}
                onChange={handleInputChange}
              />
              <div className="slider-limits">
                <span>1 kWh</span>
                <span>100 kWh</span>
              </div>
            </div>
            {error.energy && <p className="error-text">{error.energy}</p>}
          </div>

          {/* Waste input */}
          <div className="form-section">
            <label className="form-label">
              Waste Production (kg/day)
            </label>
            <input
              type="number"
              className="form-input"
              name="waste"
              value={formData.waste}
              min="0.1"
              max="50"
              step="0.1"
              onChange={handleInputChange}
              placeholder="Enter waste in kg"
            />
            {error.waste && <p className="error-text">{error.waste}</p>}
          </div>

          <button
            type="submit"
            className="submit-button"
            disabled={loading || !formData.waste || formData.waste <= 0}
          >
            {loading ? "Calculating..." : "Calculate Carbon Footprint"}
          </button>
        </form>

        {message && (
          <div className={`message ${message.includes("success") ? "success" : "error"}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default CarbonFootprintForm;