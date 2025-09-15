// src/pages/Dashboard/PersonalDashboard/PersonalDashboard.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    FaBusAlt,
    FaRecycle,
    FaMedal,
    FaLeaf,
    FaChartBar,
    FaPlusCircle,
    FaBullseye,
    FaTrophy,
    FaCloud,
    FaUser,
    FaExclamationTriangle,
    FaSync
} from "react-icons/fa";
import { MdOutlineBolt } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../../contexts/AuthContext';
import "./PersonalDashboard.css";
import Goals from "../Goals/Goals";

const PersonalDashboard = () => {
    const [carbonData, setCarbonData] = useState([]);
    const [goals, setGoals] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { currentUser, logout } = useAuth();

    const TRANSPORT_FACTOR = 0.21;
    const ENERGY_FACTOR = 0.475;
    const WASTE_FACTOR = 0.7;

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
                Authorization: `Bearer ${token}`
            }
        });
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    // In your fetchDashboardData function - FIX THE AXIOS CALLS
    const fetchDashboardData = async () => {
        if (!currentUser) return;

        setLoading(true);
        setError(null);

        try {
            const authAxios = getAuthAxios();

            // Fetch carbon data and goals in parallel
            const [carbonResponse, goalsResponse] = await Promise.all([
                authAxios.get("/carbon-footprint"),
                authAxios.get("/goals").catch(err => {
                    // If 404 or no goals, return null instead of throwing error
                    if (err.response?.status === 404) {
                        return { data: { success: true, data: null } };
                    }
                    throw err;
                })
            ]);

            setCarbonData(carbonResponse.data.data || []);
            setGoals(goalsResponse.data.data); // This could be null if no goals set

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

    const handleResetGoals = async () => {
        try {
            const defaultGoals = { transport: 200, energy: 150, waste: 50 };
            const authAxios = getAuthAxios();
            const response = await authAxios.post("/goals", defaultGoals);

            // Use response.data.data (SAME AS YOUR COMMUNITY CODE)
            if (response.data.success) {
                setGoals(response.data.data);
            } else {
                throw new Error(response.data.error || "Failed to reset goals");
            }
        } catch (error) {
            console.error("Error resetting goals:", error);
            alert(error.response?.data?.error || "Failed to reset goals. Please try again.");
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/signin');
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading your sustainability dashboard...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <FaExclamationTriangle className="error-icon" />
                <h3>Oops! Something went wrong</h3>
                <p>{error}</p>
                <button className="btn-eco" onClick={fetchDashboardData}>
                    <FaSync /> Try Again
                </button>
            </div>
        );
    }

    // Get latest carbon data or use defaults
    const latest = carbonData.length > 0
        ? carbonData[carbonData.length - 1]
        : { transport: 0, energy: 0, waste: 0 };

    const total =
        latest.transport * TRANSPORT_FACTOR +
        latest.energy * ENERGY_FACTOR +
        latest.waste * WASTE_FACTOR;

    // Calculate monthly target and reduction only if goals exist
    const monthlyTarget = goals ?
        goals.transport * TRANSPORT_FACTOR +
        goals.energy * ENERGY_FACTOR +
        goals.waste * WASTE_FACTOR : 0;

    const reduction = total > 0 && monthlyTarget > 0 && goals ?
        Math.max(0, Math.round(((total - monthlyTarget) / total) * 100)) : 0;

    const achievements = [];
    if (goals) {
        if (latest.transport <= goals.transport) achievements.push({ label: "Green Commuter", icon: <FaBusAlt /> });
        if (latest.energy <= goals.energy) achievements.push({ label: "Energy Saver", icon: <MdOutlineBolt /> });
        if (latest.waste <= goals.waste) achievements.push({ label: "Waste Reducer", icon: <FaRecycle /> });
    }

    const sum = latest.transport + latest.energy + latest.waste || 1;

    return (
        <div className="personal-dashboard-container">
            {/* Header with user info */}
            <div className="dashboard-header">
                <div className="user-info">
                    <FaUser className="user-icon" />
                    <div>
                        <h2>Welcome, {currentUser?.name || 'Eco Warrior'}!</h2>
                        <p>Track your sustainability journey</p>
                    </div>
                </div>

            </div>

            <h2 className="dashboard-title">
                <FaLeaf className="leaf-icon" /> Personal Eco Dashboard
            </h2>

            {/* Show setup prompt if no goals */}
            {!goals && (
                <div className="setup-prompt">
                    <h3>Welcome to Your Sustainability Journey!</h3>
                    <p>Get started by setting your environmental goals</p>
                    <button
                        className="btn-eco"
                        onClick={() => setShowModal(true)}
                    >
                        <FaBullseye /> Set Your First Goals
                    </button>
                </div>
            )}

            {/* Stats Cards - Only show if goals exist */}
            {goals && (
                <>
                    <div className="stats-grid">
                        <div className="stat-card">
                            <FaCloud className="stat-icon" />
                            <div>
                                <p>Carbon Footprint</p>
                                <h3>{total.toFixed(1)} kg CO₂</h3>
                            </div>
                        </div>
                        <div className="stat-card">
                            <FaBullseye className="stat-icon" />
                            <div>
                                <p>Monthly Target</p>
                                <h3>{monthlyTarget.toFixed(1)} kg CO₂</h3>
                            </div>
                        </div>
                        <div className="stat-card">
                            <FaLeaf className="stat-icon" />
                            <div>
                                <p>Reduction</p>
                                <h3>{reduction}%</h3>
                            </div>
                        </div>
                        <div className="stat-card">
                            <FaTrophy className="stat-icon" />
                            <div>
                                <p>Achievements</p>
                                <h3>{achievements.length}</h3>
                            </div>
                        </div>
                    </div>

                    <div className="dashboard-row">
                        {/* Carbon Breakdown */}
                        <div className="dashboard-card">
                            <div className="card-header">
                                <h5>Carbon Breakdown</h5>
                                <button
                                    className="btn-icon"
                                    onClick={() => navigate("/carbon-footprint")}
                                >
                                    <FaPlusCircle /> Log Activity
                                </button>
                            </div>

                            {carbonData.length === 0 ? (
                                <div className="no-data-message">
                                    <p>No activity data yet</p>
                                    <button
                                        className="btn-outline"
                                        onClick={() => navigate("/carbon-footprint")}
                                    >
                                        Log Your First Activity
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className="progress-item">
                                        <p><FaBusAlt /> Transport: {latest.transport} km</p>
                                        <div className="progress">
                                            <div
                                                className="progress-bar-personal bg-eco"
                                                style={{ width: `${(latest.transport / sum) * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                    <div className="progress-item">
                                        <p><MdOutlineBolt /> Energy: {latest.energy} kWh</p>
                                        <div className="progress">
                                            <div
                                                className="progress-bar-personal bg-eco"
                                                style={{ width: `${(latest.energy / sum) * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                    <div className="progress-item">
                                        <p><FaRecycle /> Waste: {latest.waste} kg</p>
                                        <div className="progress">
                                            <div
                                                className="progress-bar-personal bg-eco"
                                                style={{ width: `${(latest.waste / sum) * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    <div className="view-btn-wrap">
                                        <button
                                            className="btn-view"
                                            onClick={() => navigate("/carbon-breakdown")}
                                        >
                                            <FaChartBar /> View Detailed Analysis
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Goals Section */}
                        <div className="dashboard-card">
                            <div className="card-header">
                                <h5><FaBullseye /> Your Goals</h5>
                            </div>

                            {["transport", "energy", "waste"].map((type) => (
                                <div key={type} className="progress-item">
                                    <p>
                                        {type === "transport" ? <FaBusAlt /> :
                                            type === "energy" ? <MdOutlineBolt /> : <FaRecycle />}{" "}
                                        {type.charAt(0).toUpperCase() + type.slice(1)}: {latest[type]} / {goals[type]}
                                    </p>
                                    <div className="progress">
                                        <div
                                            className={`progress-bar-personal ${latest[type] > goals[type] ? "bg-danger" : "bg-eco"
                                                }`}
                                            style={{
                                                width: `${Math.min((latest[type] / goals[type]) * 100, 100)}%`
                                            }}
                                        ></div>
                                    </div>
                                </div>
                            ))}

                            <div className="goal-buttons">
                                <button
                                    className="btn-eco"
                                    onClick={() => setShowModal(true)}
                                >
                                    <FaBullseye /> Manage Goals
                                </button>
                                <button
                                    className="btn-outline"
                                    onClick={handleResetGoals}
                                >
                                    <FaRecycle /> Reset to Default
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Achievements Section */}
                    <div className="achievements-card">
                        <h5><FaMedal /> Your Achievements</h5>
                        <div className="badges-row">
                            {achievements.length > 0 ? (
                                achievements.map((ach, idx) => (
                                    <div key={idx} className="badge-card">
                                        {ach.icon} {ach.label}
                                    </div>
                                ))
                            ) : (
                                <p className="no-achievements">
                                    No achievements yet. Keep working towards your goals!
                                </p>
                            )}
                        </div>
                    </div>
                </>
            )}

            {/* Goals Modal */}
            {showModal && (
                <Goals
                    initialGoals={goals || { transport: 200, energy: 150, waste: 50 }}
                    onClose={() => setShowModal(false)}
                    updateGoals={setGoals}
                />
            )}
        </div>
    );
};

export default PersonalDashboard;