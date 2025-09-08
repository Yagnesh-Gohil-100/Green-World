import React, { useState } from "react";

import { FaUser, FaLock } from "react-icons/fa";

import axios from "axios";

import "./SignIn.css";

export default function Signin() {

 const [email, setEmail] = useState("");

 const [password, setPassword] = useState("");

 const [errors, setErrors] = useState({});

 const [message, setMessage] = useState("");

 // Validation

 const validateForm = () => {

   let formErrors = {};

   if (!email) {

     formErrors.email = "Email is required";

   } else if (!/\S+@\S+\.\S+/.test(email)) {

     formErrors.email = "Invalid email format";

   }

   if (!password) {

     formErrors.password = "Password is required";

   } else if (password.length < 6) {

     formErrors.password = "Password must be at least 6 characters";

   }

   return formErrors;

 };

 const handleSubmit = async (e) => {

   e.preventDefault();

   const formErrors = validateForm();

   if (Object.keys(formErrors).length > 0) {

     setErrors(formErrors);

     return;

   }

   setErrors({});

   try {

     const response = await axios.post("http://localhost:5000/api/signin", {

       email,

       password,

     });

     setMessage("Signin successful ✅");

     console.log("Server response:", response.data);

   } catch (error) {

     console.error("Signin failed:", error);

     setMessage("Signin failed ❌. Please check your credentials.");

   }

 };

 return (

   <div className="signin-container">

     {/* Header Section */}

     <div className="signin-header">

       <h2 className="signin-main-title">Join Ecotrackify</h2>

       <p className="signin-subtitle">

         Start your journey towards sustainable living

       </p>

     </div>

     {/* Glass Card */}

     <div className="signin-card">

       <h3 className="signin-title">Sign In</h3>

       <form onSubmit={handleSubmit}>

         {/* Email */}

         <div className="form-group icon-input">

           <label>Email</label>

           <div className="input-wrapper">

             <FaUser className="input-icon" />

             <input

               type="email"

               value={email}

               onChange={(e) => setEmail(e.target.value)}

               placeholder="Enter your email"

             />

           </div>

           {errors.email && <p className="error">{errors.email}</p>}

         </div>

         {/* Password */}

         <div className="form-group icon-input">

           <label>Password</label>

           <div className="input-wrapper">

             <FaLock className="input-icon" />

             <input

               type="password"

               value={password}

               onChange={(e) => setPassword(e.target.value)}

               placeholder="Enter your password"

             />

           </div>

           {errors.password && <p className="error">{errors.password}</p>}

         </div>

         {/* Options */}

         <div className="signin-extra">

           <div>

             <input type="checkbox" id="rememberMe" />

             <label htmlFor="rememberMe" className="ms-2">

               Remember Me

             </label>

           </div>

           <a href="#">Forgot Password?</a>

         </div>

         {/* Button */}

         <button type="submit" className="submit-btn">

           Sign In

         </button>

       </form>

       {/* Message */}

       {message && <p className="form-message">{message}</p>}

     </div>

   </div>

 );

}