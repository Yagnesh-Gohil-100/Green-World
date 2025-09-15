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
import { useAuth } from "../../../contexts/AuthContext";
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

  const getAuthAxios = () => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Authentication token not found");
    return axios.create({
      baseURL: "http://localhost:5000/api",
      headers: { Authorization: `Bearer ${token}` },
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
      const [carbonResponse, goalsResponse, teamResponse] = await Promise.all([
        authAxios.get("/carbon-footprint"),
        authAxios.get("/goals").catch((err) => {
          if (err.response?.status === 404) return { data: { data: null } };
          throw err;
        }),
        authAxios.get("/business/team-stats"),
      ]);

      setCarbonData(carbonResponse.data.data || []);
      setGoals(goalsResponse.data.data);
      setTeamStats(teamResponse.data.data);
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Session expired. Redirecting to login...");
        setTimeout(() => {
          logout();
          navigate("/signin");
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
    navigate("/signin");
  };

  if (loading) {
    return (
      <div className="employee-loading">
        <div className="spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="employee-error">
        <FaExclamationTriangle className="error-icon" />
        <h3>Oops! Something went wrong</h3>
        <p>{error}</p>
        <button className="btn btn-primary" onClick={fetchDashboardData}>
          <FaSync /> Try Again
        </button>
      </div>
    );
  }

  const latest =
    carbonData.length > 0
      ? carbonData[carbonData.length - 1]
      : { transport: 0, energy: 0, waste: 0 };

  const totalFootprint =
    latest.transport * TRANSPORT_FACTOR +
    latest.energy * ENERGY_FACTOR +
    latest.waste * WASTE_FACTOR;

  const monthlyTarget = goals
    ? goals.transport * TRANSPORT_FACTOR +
      goals.energy * ENERGY_FACTOR +
      goals.waste * WASTE_FACTOR
    : 0;

  const reduction =
    totalFootprint > 0 && monthlyTarget > 0 && goals
      ? Math.max(
          0,
          Math.round(((totalFootprint - monthlyTarget) / totalFootprint) * 100)
        )
      : 0;

  const achievements = [];
  if (goals) {
    if (latest.transport <= goals.transport)
      achievements.push({ label: "Green Commuter", icon: <FaAward />, pts: 50 });
    if (latest.energy <= goals.energy)
      achievements.push({ label: "Energy Saver", icon: <MdOutlineBolt />, pts: 40 });
    if (latest.waste <= goals.waste)
      achievements.push({ label: "Waste Warrior", icon: <FaLeaf />, pts: 60 });
  }
  const totalPoints = achievements.reduce((s, a) => s + a.pts, 0);

  return (
    <div className="employee-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="employee-info">
          <div className="avatar"><FaUserTie /></div>
          <div>
            <h2>Welcome, {currentUser?.name}</h2>
            <p className="role">
              <FaBuilding /> Employee at {currentUser?.organization}
            </p>
            <div className="stats">
              <span><FaMedal /> {totalPoints} Eco Points</span>
              <span><MdEmojiEvents /> {achievements.length} Achievements</span>
            </div>
          </div>
        </div>
        <div className="header-actions">
          <button onClick={fetchDashboardData} className="btn btn-icon"><FaSync /></button>
          <button onClick={handleLogout} className="btn btn-danger">Logout</button>
        </div>
      </header>

      {/* Stats */}
      <section className="stats-grid">
        <div className="stat-card primary">
          <FaLeaf className="icon" />
          <h3>{totalFootprint.toFixed(1)} kg CO₂</h3>
          <p>Your Carbon Footprint</p>
          <span><FiTrendingUp /> 12% lower than last month</span>
        </div>
        <div className="stat-card success">
          <FaBullseye className="icon" />
          <h3>{reduction}%</h3>
          <p>Target Reduction</p>
          <span><FaChartLine /> On track</span>
        </div>
        <div className="stat-card warning">
          <FaTrophy className="icon" />
          <h3>{teamStats?.rank || "N/A"}</h3>
          <p>Team Ranking</p>
          <span><FaUsers /> Top {teamStats?.topPercent || "30"}%</span>
        </div>
        <div className="stat-card info">
          <FaClock className="icon" />
          <h3>{carbonData.length}</h3>
          <p>Activities Logged</p>
          <span><FiTrendingUp /> Consistent</span>
        </div>
      </section>

      {/* Content */}
      <section className="content-grid">
        {/* Carbon Breakdown */}
        <div className="content-card">
          <div className="card-header">
            <h3>Your Carbon Breakdown</h3>
            <button className="btn btn-primary btn-sm" onClick={() => navigate("/carbon-footprint")}>Log Activity</button>
          </div>
          <div className="progress-list">
            <div><span>Transport: {latest.transport} km</span>
              <div className="bar"><div style={{ width: `${(latest.transport / 200) * 100}%` }} className="fill transport"></div></div>
            </div>
            <div><span>Energy: {latest.energy} kWh</span>
              <div className="bar"><div style={{ width: `${(latest.energy / 100) * 100}%` }} className="fill energy"></div></div>
            </div>
            <div><span>Waste: {latest.waste} kg</span>
              <div className="bar"><div style={{ width: `${(latest.waste / 50) * 100}%` }} className="fill waste"></div></div>
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="content-card">
          <div className="card-header">
            <h3>Your Achievements</h3>
            <span className="badge">{totalPoints} pts</span>
          </div>
          <div className="achievements">
            {achievements.length > 0 ? achievements.map((a, i) => (
              <div key={i} className="achievement">
                <div className="icon">{a.icon}</div>
                <div><h4>{a.label}</h4><p>{a.pts} points</p></div>
              </div>
            )) : (
              <div className="no-achievements"><MdEmojiEvents size={40} /><p>No achievements yet</p></div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default EmployeeDashboard;
