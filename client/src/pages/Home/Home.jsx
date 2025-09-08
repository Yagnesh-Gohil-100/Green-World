import React from "react";

import { FaLeaf, FaUsers, FaChartLine, FaLightbulb, FaSeedling } from "react-icons/fa";

import "./Home.css";

const Home = () => {

 return (

   <div className="home-container">

     {/* Hero Section */}

     <div className="hero-section row align-items-center">

       {/* Left Side */}

       <div className="col-12 col-md-6 text-center text-md-start">

         <h1 className="fw-bold home-bounce">

           Track Your <span className="highlight">Carbon Footprint</span> & Live Sustainably

         </h1>

         <p className="home-paragraph">

           Join thousands of eco-conscious individuals monitoring their environmental impact,

           setting sustainability goals, and building a greener future together.

         </p>

         <div className="mt-4 d-flex gap-3 flex-wrap justify-content-center justify-content-md-start">

           <a href="/signup" className="btn btn-eco shadow-hover">

             Start Your Eco Journey

           </a>

           <a href="/signin" className="btn btn-outline-light shadow-hover">

             Sign In

           </a>

         </div>

         {/* Stats */}

         <div className="mt-4 d-flex flex-wrap gap-4 justify-content-center justify-content-md-start">

           <div>

             <h4 className="highlight">1.2M</h4>

             <small>CO₂ Saved Tons</small>

           </div>

           <div>

             <h4 className="highlight">50K</h4>

             <small>Active Users</small>

           </div>

           <div>

             <h4 className="highlight">150K</h4>

             <small>Sustainability Goals</small>

           </div>

           <div>

             <h4 className="highlight">25K</h4>

             <small>Eco Tips Shared</small>

           </div>

         </div>

       </div>

       {/* Right Side Logo instead of Image */}

       <div className="col-12 col-md-6 text-center mt-4 mt-md-0">

         <FaSeedling className="hero-logo" />

       </div>

     </div>

     {/* Features Section */}

     <div className="container py-5">

       <h2 className="text-center fw-bold home-bounce">

         Everything You Need for <span className="highlight">Sustainable Living</span>

       </h2>

       <p className="text-center home-paragraph mb-5">

         Comprehensive tools to track, analyze, and reduce your environmental impact

         while connecting with a community of eco-warriors.

       </p>

       <div className="row g-4">

         <div className="col-12 col-md-3 home-bounce">

           <div className="feature-card text-center p-3 h-100">

             <FaChartLine size={40} className="highlight mb-3" />

             <h5 className="highlight">Carbon Footprint Tracking</h5>

             <p className="home-paragraph">

               Monitor your emissions from transportation, energy use, and daily activities.

             </p>

           </div>

         </div>

         <div className="col-12 col-md-3 home-bounce">

           <div className="feature-card text-center p-3 h-100">

             <FaLeaf size={40} className="highlight mb-3" />

             <h5 className="highlight">Sustainability Goals</h5>

             <p className="home-paragraph">

               Set personal environmental goals and track progress with helpful insights.

             </p>

           </div>

         </div>

         <div className="col-12 col-md-3 home-bounce">

           <div className="feature-card text-center p-3 h-100">

             <FaUsers size={40} className="highlight mb-3" />

             <h5 className="highlight">Community Sharing</h5>

             <p className="home-paragraph">

               Connect with like-minded individuals, share eco-tips, and inspire sustainability.

             </p>

           </div>

         </div>

         <div className="col-12 col-md-3 home-bounce">

           <div className="feature-card text-center p-3 h-100">

             <FaLightbulb size={40} className="highlight mb-3" />

             <h5 className="highlight">Eco-Friendly Practices</h5>

             <p className="home-paragraph">

               Discover sustainable practices with personalized recommendations.

             </p>

           </div>

         </div>

       </div>

     </div>

     {/* Footer Section */}

     <footer className="footer-section">

       <div className="container py-5">

         <div className="row text-center text-md-start">

           {/* Logo + Description */}

           <div className="col-12 col-md-3 mb-4">

             <h4 className="footer-logo">

               <FaSeedling className="footer-icon" /> Ecotrackify

             </h4>

             <p className="footer-text">

               Making sustainable living accessible and achievable for everyone.

             </p>

           </div>

           {/* Features */}

           <div className="col-6 col-md-3 mb-4">

             <h5 className="footer-heading">Features</h5>

             <ul className="footer-links">

               <li>Carbon Tracking</li>

               <li>Goal Setting</li>

               <li>Community Tips</li>

               <li>Progress Analytics</li>

             </ul>

           </div>

           {/* Support */}

           <div className="col-6 col-md-3 mb-4">

             <h5 className="footer-heading">Support</h5>

             <ul className="footer-links">

               <li>Help Center</li>

               <li>Contact Us</li>

               <li>Privacy Policy</li>

               <li>Terms of Service</li>

             </ul>

           </div>

           {/* Connect */}

           <div className="col-12 col-md-3 mb-4">

             <h5 className="footer-heading">Connect</h5>

             <ul className="footer-links">

               <li>Newsletter</li>

               <li>Social Media</li>

               <li>Blog</li>

               <li>Partnerships</li>

             </ul>

           </div>

         </div>

         {/* Bottom Copyright */}

         <div className="footer-bottom text-center mt-4">

           <p>© 2025 Ecotrackify. All rights reserved. Building a sustainable future together.</p>

         </div>

       </div>

     </footer>

   </div>

 );

};

export default Home;