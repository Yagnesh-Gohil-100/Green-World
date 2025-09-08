import React, { useState } from "react";
import axios from "axios";
import { FaLeaf, FaUser, FaBuilding } from "react-icons/fa"; // Added icons
import "./SignUp.css";
const SignUp = () => {
    const [activeTab, setActiveTab] = useState("personal");
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const validate = () => {
        let tempErrors = {};
        if (!formData.name.trim()) {
            tempErrors.name =
                activeTab === "personal"
                    ? "Full name is required"
                    : "Employee name is required";
        }
        if (!formData.email) {
            tempErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            tempErrors.email = "Invalid email format";
        }
        if (!formData.password) {
            tempErrors.password = "Password is required";
        } else if (formData.password.length < 6) {
            tempErrors.password = "Password must be at least 6 characters";
        }
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        try {
            console.log(formData);

            await axios.post("http://localhost:5000/api/auth/signup", {
                ...formData,
                userType: activeTab,
            });
            alert("Signup successful!");
            setFormData({ name: "", email: "", password: "" });
            setErrors({});
        } catch (err) {
            console.error(err);
            alert("Signup failed!");
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="signup-container">
            {/* Falling Leaves Animation */}
            <div className="falling-leaves">
                {Array.from({ length: 10 }).map((_, i) => (
                    <FaLeaf key={i} className="leaf-icon" />
                ))}
            </div>
            <div className="signup-card">
                <h2 className="signup-title">Create Account</h2>
                {/* Tabs */}
                <div className="tab-container">
                    <button
                        type="button"
                        className={`tab-btn ${activeTab === "personal" ? "active" : ""}`}
                        onClick={() => setActiveTab("personal")}
                    >
                        <FaUser className="tab-icon" /> Personal
                    </button>
                    <button
                        type="button"
                        className={`tab-btn ${activeTab === "business" ? "active" : ""}`}
                        onClick={() => setActiveTab("business")}
                    >
                        <FaBuilding className="tab-icon" /> Business
                    </button>
                </div>
                {/* Form */}
                <form onSubmit={handleSubmit} noValidate>
                    <div className="form-group">
                        <label>
                            {activeTab === "personal" ? "Full Name" : "Employee Name"}
                        </label>
                        <input
                            type="text"
                            name="name"
                            placeholder={
                                activeTab === "personal"
                                    ? "Enter your full name"
                                    : "Enter employee name"
                            }
                            value={formData.name}
                            onChange={handleChange}
                        />
                        {errors.name && <p className="error">{errors.name}</p>}
                    </div>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                        {errors.email && <p className="error">{errors.email}</p>}
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                        />
                        {errors.password && <p className="error">{errors.password}</p>}
                    </div>
                    <button type="submit" className="submit-btn" disabled={loading}>
                        {loading ? "Creating..." : "Create Account →"}
                    </button>
                </form>
                <p className="signin-link">
                    Already have an account? <a href="/signin">Sign in</a>
                </p>
            </div>
        </div>
    );
};
export default SignUp;