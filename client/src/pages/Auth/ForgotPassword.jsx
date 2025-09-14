import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaUser, FaLock, FaEnvelope, FaKey } from "react-icons/fa";
import axios from "axios";
import "./SignIn.css"; // Reuse your existing CSS

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [step, setStep] = useState(1); // 1: Enter email, 2: Security question, 3: Reset password
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [securityQuestion, setSecurityQuestion] = useState("");

  // Validation
  const validateForm = () => {
    let formErrors = {};

    if (step === 1) {
      if (!email) {
        formErrors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(email)) {
        formErrors.email = "Invalid email format";
      }
    } else if (step === 2) {
      if (!securityAnswer) {
        formErrors.securityAnswer = "Security answer is required";
      }
    } else if (step === 3) {
      if (!newPassword) {
        formErrors.newPassword = "New password is required";
      } else if (newPassword.length < 6) {
        formErrors.newPassword = "Password must be at least 6 characters";
      }
      if (!confirmPassword) {
        formErrors.confirmPassword = "Confirm your password";
      } else if (newPassword !== confirmPassword) {
        formErrors.confirmPassword = "Passwords do not match";
      }
    }

    return formErrors;
  };

  // Step 1: Verify email and get security question
  const handleVerifyEmail = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setLoading(true);
    setErrors({});
    setMessage("");

    try {
      const response = await axios.post("http://localhost:5000/api/auth/verify-email", {
        email,
      });

      if (response.data.success) {
        setSecurityQuestion(response.data.securityQuestion);
        setStep(2);
        setMessage("Please answer your security question");
      }
    } catch (error) {
      console.error("Email verification failed:", error);
      if (error.response?.data) {
        setMessage(error.response.data.error || "Email not found or verification failed.");
      } else {
        setMessage("Network error. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify security answer
  const handleVerifySecurityAnswer = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const response = await axios.post("http://localhost:5000/api/auth/verify-security-answer", {
        email,
        securityAnswer,
      });

      if (response.data.success) {
        setStep(3);
        setMessage("Now you can set your new password");
      }
    } catch (error) {
      console.error("Security answer verification failed:", error);
      if (error.response?.data) {
        setMessage(error.response.data.error || "Incorrect security answer.");
      } else {
        setMessage("Network error. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Reset password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const response = await axios.post("http://localhost:5000/api/auth/reset-password", {
        email,
        newPassword,
      });

      if (response.data.success) {
        setMessage("Password reset successful! You can now sign in with your new password.");
        // Clear form
        setEmail("");
        setNewPassword("");
        setConfirmPassword("");
        setSecurityAnswer("");
        
        setTimeout(() => {
          window.location.href = "/signin";
        }, 3000);
      }
    } catch (error) {
      console.error("Password reset failed:", error);
      if (error.response?.data) {
        setMessage(error.response.data.error || "Password reset failed.");
      } else {
        setMessage("Network error. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signin-container">
      {/* Header */}
      <div className="signin-header">
        <h2 className="signin-main-title">
          {step === 1 ? "Reset Your Password" : 
           step === 2 ? "Security Verification" : 
           "Set New Password"}
        </h2>
        <p className="signin-subtitle">
          {step === 1 ? "Enter your email to continue" : 
           step === 2 ? "Answer your security question" : 
           "Enter your new password"}
        </p>
      </div>

      {/* Glass Card */}
      <div className="signin-card">
        {message && (
          <div className={`message ${message.includes("successful") ? "success" : "error"}`}>
            {message}
          </div>
        )}

        {step === 1 && (
          <form onSubmit={handleVerifyEmail}>
            <div className="form-group icon-input">
              <label>Email Address</label>
              <div className="input-wrapper">
                <FaEnvelope className="input-icon" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && <p className="error">{errors.email}</p>}
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Verifying..." : "Continue"}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifySecurityAnswer}>
            <div className="form-group">
              <label>Security Question</label>
              <p className="security-question">{securityQuestion}</p>
            </div>

            <div className="form-group icon-input">
              <label>Your Answer</label>
              <div className="input-wrapper">
                <FaKey className="input-icon" />
                <input
                  type="text"
                  value={securityAnswer}
                  onChange={(e) => setSecurityAnswer(e.target.value)}
                  placeholder="Enter your answer"
                />
              </div>
              {errors.securityAnswer && <p className="error">{errors.securityAnswer}</p>}
            </div>

            <div className="button-group">
              <button 
                type="button" 
                className="btn btn-outline-secondary"
                onClick={() => setStep(1)}
                disabled={loading}
              >
                Back
              </button>
              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? "Verifying..." : "Verify Answer"}
              </button>
            </div>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleResetPassword}>
            <div className="form-group icon-input">
              <label>New Password</label>
              <div className="input-wrapper">
                <FaLock className="input-icon" />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                />
              </div>
              {errors.newPassword && <p className="error">{errors.newPassword}</p>}
            </div>

            <div className="form-group icon-input">
              <label>Confirm Password</label>
              <div className="input-wrapper">
                <FaLock className="input-icon" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                />
              </div>
              {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}
            </div>

            <div className="button-group">
              <button 
                type="button" 
                className="btn btn-outline-secondary"
                onClick={() => setStep(2)}
                disabled={loading}
              >
                Back
              </button>
              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </div>
          </form>
        )}

        <p className="signin-link">
          Remember your password? <Link to="/signin">Sign in</Link>
        </p>
      </div>
    </div>
  );
}