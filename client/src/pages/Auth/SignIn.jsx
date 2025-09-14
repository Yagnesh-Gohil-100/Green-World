// import React, { useState } from "react";

// import { FaUser, FaLock } from "react-icons/fa";

// import axios from "axios";

// import "./SignIn.css";

// export default function Signin() {

//  const [email, setEmail] = useState("");

//  const [password, setPassword] = useState("");

//  const [errors, setErrors] = useState({});

//  const [message, setMessage] = useState("");

//  // Validation

//  const validateForm = () => {

//    let formErrors = {};

//    if (!email) {

//      formErrors.email = "Email is required";

//    } else if (!/\S+@\S+\.\S+/.test(email)) {

//      formErrors.email = "Invalid email format";

//    }

//    if (!password) {

//      formErrors.password = "Password is required";

//    } else if (password.length < 6) {

//      formErrors.password = "Password must be at least 6 characters";

//    }

//    return formErrors;

//  };

//  const handleSubmit = async (e) => {

//    e.preventDefault();

//    const formErrors = validateForm();

//    if (Object.keys(formErrors).length > 0) {

//      setErrors(formErrors);

//      return;

//    }

//    setErrors({});

//    try {

//      const response = await axios.post("http://localhost:5000/api/signin", {

//        email,

//        password,

//      });

//      setMessage("Signin successful ✅");

//      console.log("Server response:", response.data);

//    } catch (error) {

//      console.error("Signin failed:", error);

//      setMessage("Signin failed ❌. Please check your credentials.");

//    }

//  };

//  return (

//    <div className="signin-container">

//      {/* Header Section */}

//      <div className="signin-header">

//        <h2 className="signin-main-title">Join Ecotrackify</h2>

//        <p className="signin-subtitle">

//          Start your journey towards sustainable living

//        </p>

//      </div>

//      {/* Glass Card */}

//      <div className="signin-card">

//        <h3 className="signin-title">Sign In</h3>

//        <form onSubmit={handleSubmit}>

//          {/* Email */}

//          <div className="form-group icon-input">

//            <label>Email</label>

//            <div className="input-wrapper">

//              <FaUser className="input-icon" />

//              <input

//                type="email"

//                value={email}

//                onChange={(e) => setEmail(e.target.value)}

//                placeholder="Enter your email"

//              />

//            </div>

//            {errors.email && <p className="error">{errors.email}</p>}

//          </div>

//          {/* Password */}

//          <div className="form-group icon-input">

//            <label>Password</label>

//            <div className="input-wrapper">

//              <FaLock className="input-icon" />

//              <input

//                type="password"

//                value={password}

//                onChange={(e) => setPassword(e.target.value)}

//                placeholder="Enter your password"

//              />

//            </div>

//            {errors.password && <p className="error">{errors.password}</p>}

//          </div>

//          {/* Options */}

//          <div className="signin-extra">

//            <div>

//              <input type="checkbox" id="rememberMe" />

//              <label htmlFor="rememberMe" className="ms-2">

//                Remember Me

//              </label>

//            </div>

//            <a href="#">Forgot Password?</a>

//          </div>

//          {/* Button */}

//          <button type="submit" className="submit-btn">

//            Sign In

//          </button>

//        </form>

//        {/* Message */}

//        {message && <p className="form-message">{message}</p>}

//      </div>

//    </div>

//  );

// }


// -------------------------------------------------------------------------------------------

// import React, { useState } from "react";
// import axios from "axios";
// import { FaUser, FaBuilding, FaUserTie, FaCrown } from "react-icons/fa";
// import "./login.css";

// const SignIn = () => {
//   const [activeTab, setActiveTab] = useState("personal");
//   const [role, setRole] = useState(""); // For business role selection
//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   });
//   const [errors, setErrors] = useState({});
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const validate = () => {
//     let tempErrors = {};

//     // Business role validation
//     if (activeTab === "business" && !role) {
//       tempErrors.role = "Please select your role";
//     }

//     // Email validation
//     if (!formData.email) {
//       tempErrors.email = "Email is required";
//     } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
//       tempErrors.email = "Invalid email format";
//     }

//     // Password validation
//     if (!formData.password) {
//       tempErrors.password = "Password is required";
//     }

//     setErrors(tempErrors);
//     return Object.keys(tempErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validate()) return;

//     setLoading(true);

//     try {
//       const url = "http://localhost:5000/api/auth/login";

//       // Determine userType based on activeTab and role
//       let userType;
//       if (activeTab === "personal") {
//         userType = "personal";
//       } else if (activeTab === "business") {
//         userType = role === "admin" ? "business" : "employee";
//       }

//       const loginData = {
//         email: formData.email,
//         password: formData.password,
//         userType: userType
//       };

//       console.log(loginData);

//       // const response = await axios.post(url, loginData);

//       // if (response.data.success) {
//       //   alert("Login successful!");
//       //   // Save token and user type to localStorage
//       //   localStorage.setItem("token", response.data.token);
//       //   localStorage.setItem("userType", response.data.userType);

//       //   // Redirect based on user type
//       //   if (response.data.userType === "personal") {
//       //     window.location.href = "/dashboard/personal";
//       //   } else if (response.data.userType === "business") {
//       //     window.location.href = "/dashboard/business";
//       //   } else if (response.data.userType === "employee") {
//       //     window.location.href = "/dashboard/employee";
//       //   }
//       // } else {
//       //   alert(`Login failed: ${response.data.error}`);
//       // }


//       await axios.post(url, loginData)
//         .then(response => {
//           alert("Login successful!");
//           // Save token and user type to localStorage
//           localStorage.setItem("token", response.data.token);
//           localStorage.setItem("userType", response.data.userType);

//           // Redirect based on user type
//           if (response.data.userType === "personal") {
//             window.location.href = "/dashboard/personal";
//           } else if (response.data.userType === "business") {
//             window.location.href = "/dashboard/business";
//           } else if (response.data.userType === "employee") {
//             window.location.href = "/dashboard/employee";
//           }
//         })
//         .catch(error => {
//           alert(`Login failed: ${error.message}`);
//         })

//     } catch (err) {
//       console.error("Login error:", err);

//       if (err.response && err.response.data) {
//         alert(`Login failed: ${err.response.data.error}`);
//       } else {
//         alert("Login failed! Please try again.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="signin-container">
//       <div className="signin-card">
//         <h2 className="signin-title">Welcome Back</h2>
//         <p className="signin-subtitle">Sign in to continue your eco-journey</p>

//         {/* Tabs */}
//         <div className="tab-container">
//           <button
//             type="button"
//             className={`tab-btn ${activeTab === "personal" ? "active" : ""}`}
//             onClick={() => {
//               setActiveTab("personal");
//               setRole("");
//               setErrors({});
//             }}
//           >
//             <FaUser className="tab-icon" /> Personal
//           </button>
//           <button
//             type="button"
//             className={`tab-btn ${activeTab === "business" ? "active" : ""}`}
//             onClick={() => {
//               setActiveTab("business");
//               setRole("");
//               setErrors({});
//             }}
//           >
//             <FaBuilding className="tab-icon" /> Business
//           </button>
//         </div>

//         {/* Business Role Selection */}
//         {activeTab === "business" && (
//           <div className="role-selection">
//             <div className="role-options">
//               <div
//                 className={`role-option ${role === "admin" ? "selected" : ""}`}
//                 onClick={() => setRole("admin")}
//               >
//                 <FaCrown className="role-icon" />
//                 <span>Business Admin</span>
//               </div>
//               <div
//                 className={`role-option ${role === "employee" ? "selected" : ""}`}
//                 onClick={() => setRole("employee")}
//               >
//                 <FaUserTie className="role-icon" />
//                 <span>Employee</span>
//               </div>
//             </div>
//             {errors.role && <p className="error">{errors.role}</p>}
//           </div>
//         )}

//         {/* User Type Indicator */}
//         <div className="user-type-indicator">
//           <p>
//             Signing in as:{" "}
//             <span className="highlight">
//               {activeTab === "personal" && "Personal User"}
//               {activeTab === "business" && role === "admin" && "Business Admin"}
//               {activeTab === "business" && role === "employee" && "Business Employee"}
//               {activeTab === "business" && !role && "Select your role above"}
//             </span>
//           </p>
//         </div>

//         {/* Form */}
//         <form onSubmit={handleSubmit} noValidate>
//           {/* Email Field */}
//           <div className="form-group">
//             <label>Email Address</label>
//             <input
//               type="email"
//               name="email"
//               placeholder="Enter your email"
//               value={formData.email}
//               onChange={handleChange}
//             />
//             {errors.email && <p className="error">{errors.email}</p>}
//           </div>

//           {/* Password Field */}
//           <div className="form-group">
//             <label>Password</label>
//             <input
//               type="password"
//               name="password"
//               placeholder="Enter your password"
//               value={formData.password}
//               onChange={handleChange}
//             />
//             {errors.password && <p className="error">{errors.password}</p>}
//           </div>

//           {/* Remember Me & Forgot Password */}
//           <div className="signin-options">
//             <div className="remember-me">
//               <input type="checkbox" id="rememberMe" />
//               <label htmlFor="rememberMe">Remember me</label>
//             </div>
//             <a href="/forgot-password" className="forgot-password">
//               Forgot Password?
//             </a>
//           </div>

//           {/* Submit Button */}
//           <button
//             type="submit"
//             className="submit-btn"
//             disabled={loading || (activeTab === "business" && !role)}
//           >
//             {loading ? "Signing In..." : "Sign In →"}
//           </button>
//         </form>

//         {/* Sign Up Link */}
//         <p className="signup-link">
//           Don't have an account? <a href="/signup">Sign up now</a>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default SignIn;



// ---------------------------------------------------------------

import React, { useState } from "react";
import axios from "axios";
import { FaUser, FaBuilding } from "react-icons/fa";
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import "./login.css";

const SignIn = () => {
  const [activeTab, setActiveTab] = useState("personal");
  const [role, setRole] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    let tempErrors = {};
    if (activeTab === "business" && !role) {
      tempErrors.role = "Please select your role";
    }
    if (!formData.email) {
      tempErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = "Invalid email format";
    }
    if (!formData.password) {
      tempErrors.password = "Password is required";
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    try {
      const url = "http://localhost:5000/api/auth/login";
      let userType;
      if (activeTab === "personal") {
        userType = "personal";
      } else if (activeTab === "business") {
        userType = role === "admin" ? "business" : "employee";
      }

      const response = await axios.post(url, {
        email: formData.email,
        password: formData.password,
        userType: userType
      });

      if (response.data.success) {
        login(response.data.token, response.data.data, response.data.userType);

        // Redirect to appropriate dashboard based on user type
        if (userType === "personal") {
          navigate('/dashboard/personal');
        } else if (userType === "business") {
          navigate('/dashboard/business');
        } else if (userType === "employee") {
          navigate('/dashboard/employee');
        }
      }
    } catch (err) {
      // error handling
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signin-container">
      <div className="signin-card">
        <h2 className="signin-title">Welcome Back</h2>
        <p className="signin-subtitle">Sign in to continue your eco-journey</p>

        {/* Tabs */}
        <div className="tab-container">
          <button
            type="button"
            className={`tab-btn ${activeTab === "personal" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("personal");
              setRole("");
              setErrors({});
            }}
          >
            <FaUser className="tab-icon" /> Personal
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === "business" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("business");
              setRole("");
              setErrors({});
            }}
          >
            <FaBuilding className="tab-icon" /> Business
          </button>
        </div>

        {/* Business Role Selection - Dropdown (like SignUp) */}
        {activeTab === "business" && (
          <div className="form-group">
            <label>Select Role</label>
            <select
              name="role"
              className="dropdown-input"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="">-- Select Role --</option>
              <option value="employee">Business Employee</option>
              <option value="admin">Business Admin</option>
            </select>
            {errors.role && <p className="error">{errors.role}</p>}
          </div>
        )}



        {/* Form */}
        <form onSubmit={handleSubmit} noValidate>
          {/* Email Field */}
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

          {/* Password Field */}
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

          {/* Remember Me & Forgot Password */}
          <div className="signin-options">
            <div className="remember-me">
              <input type="checkbox" id="rememberMe" />
              <label htmlFor="rememberMe">Remember me</label>
            </div>
            <a href="/forgot-password" className="forgot-password">
              Forgot Password?
            </a>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="submit-btn"
            disabled={loading || (activeTab === "business" && !role)}
          >
            {loading ? "Signing In..." : "Sign In →"}
          </button>
        </form>

        {/* Sign Up Link */}
        <p className="signup-link">
          Don't have an account? <a href="/signup">Sign up now</a>
        </p>
      </div>
    </div>
  );
};

export default SignIn;