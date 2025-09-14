import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  FaUser, 
  FaEnvelope, 
  FaBuilding, 
  FaShieldAlt, 
  FaEdit,
  FaSave,
  FaTimes
} from "react-icons/fa";
import { useAuth } from '../../contexts/AuthContext';
import Settings from "./Settings";
import Security from "./Security";
import "./Profile.css";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("info");
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const { currentUser, userType } = useAuth();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/users/profile");
      setUserData(response.data.data);
      setEditData(response.data.data);
    } catch (err) {
      console.error("Error fetching user profile:", err);
      setError("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      const response = await axios.put("http://localhost:5000/api/users/profile", editData);
      setUserData(response.data.data);
      setEditing(false);
      setMessage("Profile updated successfully");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(err.response?.data?.error || "Failed to update profile");
    }
  };

  const handleCancelEdit = () => {
    setEditData(userData);
    setEditing(false);
  };

  const handleInputChange = (field, value) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading">Loading profile...</div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="profile-container">
        <div className="error">Failed to load profile</div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-icon">
          <span>{userData.name?.charAt(0)?.toUpperCase() || 'U'}</span>
        </div>
        <div className="profile-info">
          <h2>{userData.name}</h2>
          <p>{userData.email}</p>
          <span className="account-type">
            {userType} Account
          </span>
        </div>
        
        {!editing ? (
          <button 
            className="edit-btn"
            onClick={() => setEditing(true)}
          >
            <FaEdit /> Edit Profile
          </button>
        ) : (
          <div className="edit-actions">
            <button className="save-btn" onClick={handleSaveProfile}>
              <FaSave /> Save
            </button>
            <button className="cancel-btn" onClick={handleCancelEdit}>
              <FaTimes /> Cancel
            </button>
          </div>
        )}
      </div>

      {/* Messages */}
      {message && <div className="message success">{message}</div>}
      {error && <div className="message error">{error}</div>}

      {/* Tabs */}
      <div className="tabs">
        <button
          className={`tab-btn ${activeTab === "info" ? "active" : ""}`}
          onClick={() => setActiveTab("info")}
        >
          Profile Info
        </button>
        <button
          className={`tab-btn ${activeTab === "settings" ? "active" : ""}`}
          onClick={() => setActiveTab("settings")}
        >
          Settings
        </button>
        <button
          className={`tab-btn ${activeTab === "security" ? "active" : ""}`}
          onClick={() => setActiveTab("security")}
        >
          Security
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === "info" && (
          <div className="info-section">
            <h3>Profile Information</h3>
            
            <div className="info-item">
              <label><FaUser /> Full Name:</label>
              {editing ? (
                <input
                  type="text"
                  value={editData.name || ""}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="edit-input"
                />
              ) : (
                <span>{userData.name}</span>
              )}
            </div>

            <div className="info-item">
              <label><FaEnvelope /> Email:</label>
              {editing ? (
                <input
                  type="email"
                  value={editData.email || ""}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="edit-input"
                />
              ) : (
                <span>{userData.email}</span>
              )}
            </div>

            <div className="info-item">
              <label><FaBuilding /> Account Type:</label>
              <span>{userType}</span>
            </div>

            <div className="info-item">
              <label>Member Since:</label>
              <span>{new Date(userData.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <Settings />
        )}

        {activeTab === "security" && (
          <Security />
        )}
      </div>
    </div>
  );
};

export default Profile;