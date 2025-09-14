import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaBell, FaPalette, FaSave } from "react-icons/fa";
import "./Settings.css";

const Settings = () => {
  const [settings, setSettings] = useState({
    notifications: true,
    theme: "light"
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/users/settings");
      setSettings(response.data.data);
    } catch (err) {
      console.error("Error fetching settings:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      const response = await axios.put("http://localhost:5000/api/users/settings", settings);
      setMessage("Settings saved successfully!");
      setTimeout(() => setMessage(""), 3000);
      
      // Apply theme immediately
      if (settings.theme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.documentElement.removeAttribute('data-theme');
      }
    } catch (err) {
      console.error("Error saving settings:", err);
      setMessage("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return <div className="settings-loading">Loading settings...</div>;
  }

  return (
    <div className="settings-container">
      <h3>Application Settings</h3>
      
      {message && (
        <div className={`settings-message ${message.includes('success') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      <div className="settings-group">
        <div className="setting-item">
          <div className="setting-label">
            <FaBell className="setting-icon" />
            <span>Notifications</span>
          </div>
          <label className="switch">
            <input
              type="checkbox"
              checked={settings.notifications}
              onChange={(e) => handleSettingChange('notifications', e.target.checked)}
            />
            <span className="slider"></span>
          </label>
        </div>

        <div className="setting-item">
          <div className="setting-label">
            <FaPalette className="setting-icon" />
            <span>Theme</span>
          </div>
          <select
            value={settings.theme}
            onChange={(e) => handleSettingChange('theme', e.target.value)}
            className="theme-select"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>
      </div>

      <button 
        className="save-settings-btn"
        onClick={handleSaveSettings}
        disabled={saving}
      >
        <FaSave /> {saving ? "Saving..." : "Save Settings"}
      </button>
    </div>
  );
};

export default Settings;