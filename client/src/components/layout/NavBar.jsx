import React from "react";

import "bootstrap/dist/css/bootstrap.min.css";

import { FaSeedling, FaHome, FaChartLine, FaUsers, FaSignInAlt, FaUserPlus } from "react-icons/fa";

const Navbar = () => {

 return (

   <nav className="navbar navbar-expand-lg glass-navbar sticky-top px-2">

     {/* Logo / Brand */}

     <a className="navbar-brand fw-bold" href="#">
        <FaSeedling size={30} className="highlight mb-3" />
       EcoTrackify
     </a>

     {/* Collapse toggle for mobile */}

     <button

       className="navbar-toggler"

       type="button"

       data-bs-toggle="collapse"

       data-bs-target="#navbarNav"

       aria-controls="navbarNav"

       aria-expanded="false"

       aria-label="Toggle navigation"

     >

       <span className="navbar-toggler-icon"></span>

     </button>

     {/* Navbar links */}

     <div className="collapse navbar-collapse" id="navbarNav">

       <div className="ms-auto d-flex gap-3 align-items-center">

         <a className="nav-link p-2 d-flex align-items-center gap-1" href="/">

           <FaHome /> Home

         </a>

         <a className="nav-link p-2 d-flex align-items-center gap-1" href="/dashboard">

           <FaChartLine /> Dashboard

         </a>

         <a className="nav-link p-2 d-flex align-items-center gap-1" href="/community">

           <FaUsers /> Community

         </a>

         <a className="nav-link p-2 d-flex align-items-center gap-1" href="/signin">

           <FaSignInAlt /> Sign In

         </a>

         <a className="nav-link p-2 d-flex align-items-center gap-1" href="/signup">

           <FaUserPlus /> Sign Up

         </a>

       </div>

     </div>

   </nav>

 );

};

export default Navbar;