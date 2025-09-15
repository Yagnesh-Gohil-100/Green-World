// src/pages/Dashboard/EmployeeDashboard/EmployeeDashboard.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaUserTie,
  FaBuilding,
  FaLeaf,
  FaChartLine,
  FaTrophy,
  FaUsers,
  FaBullseye,
  FaSync,
  FaExclamationTriangle,
  FaMedal,
  FaClock,
  FaAward
} from "react-icons/fa";

import { FiTrendingUp } from "react-icons/fi";
import { MdOutlineBolt, MdEmojiEvents } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../../contexts/AuthContext';
import "./EmployeeDashboard.css";

const EmployeeDashboard = () => {
  const [carbonData, setCarbonData] = useState([]);
  const [goals, setGoals] = useState(null);
  const [teamStats, setTeamStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  const TRANSPORT_FACTOR = 0.21;
  const ENERGY_FACTOR = 0.475;
  const WASTE_FACTOR = 0.7;

  // Get axios instance with auth headers
  const getAuthAxios = () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.error('No token found in localStorage');
      throw new Error('Authentication token not found');
    }

    return axios.create({
      baseURL: 'http://localhost:5000/api',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    if (!currentUser) return;    
    
    setLoading(true);
    setError(null);

    try {
      const authAxios = getAuthAxios();
      
      // Fetch carbon data, goals, and team stats in parallel
      const [carbonResponse, goalsResponse, teamResponse] = await Promise.all([
        authAxios.get("/carbon-footprint"),
        authAxios.get("/goals").catch(err => { 
          if (err.response?.status === 404) {
            return { data: { success: true, data: null } };
          }
          throw err;
        }),
        authAxios.get("/business/team-stats") // New endpoint for team statistics
      ]);

      setCarbonData(carbonResponse.data.data || []);
      setGoals(goalsResponse.data.data);
      setTeamStats(teamResponse.data.data);
      
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      
      if (error.response?.status === 401) {
        setError("Session expired. Please log in again.");
        setTimeout(() => {
          logout();
          navigate('/signin');
        }, 2000);
      } else {
        setError("Failed to load dashboard data. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  if (loading) {
    return (
      <div className="employee-loading-container">
        <div className="employee-loading-spinner"></div>
        <p>Loading your employee dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="employee-error-container">
        <FaExclamationTriangle className="error-icon" />
        <h3>Oops! Something went wrong</h3>
        <p>{error}</p>
        <button className="btn-primary" onClick={fetchDashboardData}>
          <FaSync /> Try Again
        </button>
      </div>
    );
  }

  // Get latest carbon data or use defaults
  const latest = carbonData.length > 0 
    ? carbonData[carbonData.length - 1] 
    : { transport: 0, energy: 0, waste: 0 };

  const totalFootprint =
    latest.transport * TRANSPORT_FACTOR +
    latest.energy * ENERGY_FACTOR +
    latest.waste * WASTE_FACTOR;

  const monthlyTarget = goals ? 
    goals.transport * TRANSPORT_FACTOR +
    goals.energy * ENERGY_FACTOR +
    goals.waste * WASTE_FACTOR : 0;

  const reduction = totalFootprint > 0 && monthlyTarget > 0 && goals ? 
    Math.max(0, Math.round(((totalFootprint - monthlyTarget) / totalFootprint) * 100)) : 0;

  // Calculate achievements
  const achievements = [];
  if (goals) {
    if (latest.transport <= goals.transport) achievements.push({ 
      label: "Green Commuter", 
      icon: <FaAward />,
      points: 50 
    });
    if (latest.energy <= goals.energy) achievements.push({ 
      label: "Energy Saver", 
      icon: <MdOutlineBolt />,
      points: 40 
    });
    if (latest.waste <= goals.waste) achievements.push({ 
      label: "Waste Warrior", 
      icon: <FaLeaf />,
      points: 60 
    });
  }

  const totalPoints = achievements.reduce((sum, ach) => sum + ach.points, 0);

  return (
    <div className="employee-dashboard-container">
      {/* Header with user info */}
      <div className="employee-header">
        <div className="employee-info">
          <div className="employee-avatar">
            <FaUserTie />
          </div>
          <div>
            <h2>Welcome, {currentUser?.name}!</h2>
            <p className="employee-role">
              <FaBuilding /> Employee at {currentUser?.organization}
            </p>
            <p className="employee-stats">
              <span className="stat-badge">
                <FaMedal /> {totalPoints} Eco Points
              </span>
              <span className="stat-badge">
                <MdEmojiEvents /> {achievements.length} Achievements
              </span>
            </p>
          </div>
        </div>
        <div className="header-actions">
          <button className="btn-refresh" onClick={fetchDashboardData} title="Refresh data">
            <FaSync />
          </button>
          <button className="btn-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <div className="dashboard-title-section">
        <h1 className="dashboard-title">
          <FaUserTie /> Employee Sustainability Dashboard
        </h1>
        <p className="dashboard-subtitle">
          Track your environmental impact and contribute to your company's green goals
        </p>
      </div>

      {/* Main Stats Grid */}
      <div className="employee-stats-grid">
        <div className="stat-card primary">
          <div className="stat-icon">
            <FaLeaf />
          </div>
          <div className="stat-content">
            <h3>{totalFootprint.toFixed(1)} kg CO₂</h3>
            <p>Your Carbon Footprint</p>
            <span className="stat-trend">
              <FiTrendingUp /> 12% lower than last month
            </span>
          </div>
        </div>

        <div className="stat-card success">
          <div className="stat-icon">
            <FaBullseye />
          </div>
          <div className="stat-content">
            <h3>{reduction}%</h3>
            <p>Target Reduction</p>
            <span className="stat-trend">
              <FaChartLine /> On track to goal
            </span>
          </div>
        </div>

        <div className="stat-card warning">
          <div className="stat-icon">
            <FaTrophy />
          </div>
          <div className="stat-content">
            <h3>{teamStats?.rank || 'N/A'}</h3>
            <p>Team Ranking</p>
            <span className="stat-trend">
              <FaUsers /> Top {teamStats?.topPercent || '30'}%
            </span>
          </div>
        </div>

        <div className="stat-card info">
          <div className="stat-icon">
            <FaClock />
          </div>
          <div className="stat-content">
            <h3>{carbonData.length}</h3>
            <p>Activities Logged</p>
            <span className="stat-trend">
              <FiTrendingUp /> Consistent contributor
            </span>
          </div>
        </div>
      </div>

      <div className="dashboard-content-grid">
        {/* Carbon Breakdown */}
        <div className="content-card">
          <div className="card-header">
            <h3>Your Carbon Breakdown</h3>
            <button 
              className="btn-primary btn-sm"
              onClick={() => navigate("/carbon-footprint")}
            >
              Log New Activity
            </button>
          </div>
          
          <div className="breakdown-chart">
            <div className="chart-item">
              <div className="chart-label">
                <span className="transport-dot"></span>
                Transport: {latest.transport} km
              </div>
              <div className="chart-bar">
                <div 
                  className="chart-fill transport"
                  style={{ width: `${(latest.transport / 200) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div className="chart-item">
              <div className="chart-label">
                <span className="energy-dot"></span>
                Energy: {latest.energy} kWh
              </div>
              <div className="chart-bar">
                <div 
                  className="chart-fill energy"
                  style={{ width: `${(latest.energy / 100) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div className="chart-item">
              <div className="chart-label">
                <span className="waste-dot"></span>
                Waste: {latest.waste} kg
              </div>
              <div className="chart-bar">
                <div 
                  className="chart-fill waste"
                  style={{ width: `${(latest.waste / 50) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Team Comparison */}
        <div className="content-card">
          <div className="card-header">
            <h3>Team Comparison</h3>
            <span className="badge-team">Your Team</span>
          </div>
          
          <div className="team-comparison">
            <div className="comparison-item">
              <span className="label">Your Footprint</span>
              <span className="value">{totalFootprint.toFixed(1)} kg</span>
            </div>
            <div className="comparison-item">
              <span className="label">Team Average</span>
              <span className="value">{teamStats?.averageFootprint || '0'} kg</span>
            </div>
            <div className="comparison-item">
              <span className="label">Team Best</span>
              <span className="value best">{teamStats?.bestFootprint || '0'} kg</span>
            </div>
          </div>

          <div className="progress-ring">
            <div className="ring-container">
              <div className="ring" style={{ '--progress': '75' }}>
                <span className="ring-text">75%</span>
              </div>
              <p>Better than peers</p>
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="content-card">
          <div className="card-header">
            <h3>Your Achievements</h3>
            <span className="badge-points">{totalPoints} pts</span>
          </div>
          
          <div className="achievements-grid">
            {achievements.length > 0 ? (
              achievements.map((ach, idx) => (
                <div key={idx} className="achievement-item">
                  <div className="achievement-icon">{ach.icon}</div>
                  <div className="achievement-details">
                    <h4>{ach.label}</h4>
                    <p>{ach.points} points earned</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-achievements">
                <MdEmojiEvents size={48} />
                <p>Complete activities to earn achievements!</p>
              </div>
            )}
          </div>
        </div>

        {/* Weekly Goals Progress */}
        <div className="content-card">
          <div className="card-header">
            <h3>Weekly Progress</h3>
            <span className="badge-progress">This Week</span>
          </div>
          
          <div className="weekly-progress">
            <div className="progress-item">
              <span className="progress-label">Carbon Reduction</span>
              <div className="progress-bar-employee">
                <div className="progress-fill" style={{ width: '65%' }}></div>
              </div>
              <span className="progress-value">65%</span>
            </div>
            
            <div className="progress-item">
              <span className="progress-label">Activity Completion</span>
              <div className="progress-bar-employee">
                <div className="progress-fill" style={{ width: '80%' }}></div>
              </div>
              <span className="progress-value">80%</span>
            </div>
            
            <div className="progress-item">
              <span className="progress-label">Goal Achievement</span>
              <div className="progress-bar-employee">
                <div className="progress-fill" style={{ width: '45%' }}></div>
              </div>
              <span className="progress-value">45%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="action-buttons">
          <button className="action-btn primary">
            <FaLeaf />
            Log Carbon Activity
          </button>
          <button className="action-btn secondary">
            <FaBullseye />
            Set Goals
          </button>
          <button className="action-btn tertiary">
            <FaChartLine />
            View Reports
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;