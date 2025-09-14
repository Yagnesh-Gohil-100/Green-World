import React, { useState } from "react";
import axios from "axios";
import { FaShieldAlt, FaKey, FaEye, FaEyeSlash } from "react-icons/fa";
import "./Security.css";

const Security = () => {
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    if (passwords.newPassword !== passwords.confirmPassword) {
      setError("New passwords don't match");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.put("http://localhost:5000/api/users/change-password", {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword
      });

      setMessage("Password changed successfully!");
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setError(err.response?.data?.error || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <div className="security-container">
      <h3><FaShieldAlt /> Security Settings</h3>

      {message && <div className="security-message success">{message}</div>}
      {error && <div className="security-message error">{error}</div>}

      <form onSubmit={handleSubmit} className="security-form">
        <div className="form-group">
          <label>Current Password</label>
          <div className="password-input">
            <input
              type={showPasswords.current ? "text" : "password"}
              value={passwords.currentPassword}
              onChange={(e) => setPasswords(prev => ({ ...prev, currentPassword: e.target.value }))}
              placeholder="Enter current password"
              required
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => togglePasswordVisibility('current')}
            >
              {showPasswords.current ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        <div className="form-group">
          <label>New Password</label>
          <div className="password-input">
            <input
              type={showPasswords.new ? "text" : "password"}
              value={passwords.newPassword}
              onChange={(e) => setPasswords(prev => ({ ...prev, newPassword: e.target.value }))}
              placeholder="Enter new password"
              required
              minLength="6"
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => togglePasswordVisibility('new')}
            >
              {showPasswords.new ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        <div className="form-group">
          <label>Confirm New Password</label>
          <div className="password-input">
            <input
              type={showPasswords.confirm ? "text" : "password"}
              value={passwords.confirmPassword}
              onChange={(e) => setPasswords(prev => ({ ...prev, confirmPassword: e.target.value }))}
              placeholder="Confirm new password"
              required
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => togglePasswordVisibility('confirm')}
            >
              {showPasswords.confirm ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        <button 
          type="submit" 
          className="change-password-btn"
          disabled={loading}
        >
          <FaKey /> {loading ? "Changing..." : "Change Password"}
        </button>
      </form>
    </div>
  );
};

export default Security;