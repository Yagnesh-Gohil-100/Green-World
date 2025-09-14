import {
   FaSeedling,
   FaLeaf,
   FaHandsHelping,
   FaTrophy,
   FaGlobe,
} from "react-icons/fa";
import "../Home/Home.css"; // reuse same styles

const About = () => {
   return (
       <div className="home-container">
           {/* Hero Section for About */}
           <div className="hero-section row align-items-center position-relative">
               {/* Text Content */}
               <div className="col-12 col-md-7 text-center text-md-start z-2 pe-md-5">
                   <h1 className="fw-bold">
                       About <span className="highlight">Ecotrackify</span>
                   </h1>
                   <p className="home-paragraph1 mt-3">
                       At <span className="highlight fw-bold">Ecotrackify</span>, our
                       mission is simple — empower individuals to make sustainable choices
                       every day. From tracking your carbon footprint to setting eco-friendly
                       goals, we help you build habits that protect the planet 🌍.
                   </p>
                   {/* Buttons */}
                   <div className="mt-4 d-flex gap-3 flex-wrap">
                       <a href="/signup" className="btn btn-eco shadow-hover">
                           Start Your Eco Journey
                       </a>
                       <a href="/signin" className="btn btn-outline-light shadow-hover">
                           Sign In
                       </a>
                   </div>
               </div>
               <br />
               {/* Globe on Right Side */}
               <div className="col-12 col-md-5 position-relative">
                   <div className="globe-container">
                       <FaGlobe className="floating-globe" />
                   </div>
               </div>
           </div>
           {/* Extra Info Section */}
           <div className="container py-5">
               <h2 className="text-center fw-bold">
                   Why Choose <span className="highlight">Ecotrackify?</span>
               </h2>
               <p className="text-center home-paragraph mb-5">
                   We believe that small steps lead to big change. Here’s what makes our
                   platform unique:
               </p>
               <div className="row g-4 text-center">
                   <div className="col-12 col-md-4">
                       <div className="feature-card p-3 h-100">
                           <FaLeaf className="feature-icon mb-3" size={40} />
                           <h5 className="highlight">Track Your Impact</h5>
                           <p className="home-paragraph">
                               Monitor your carbon footprint in real time and stay accountable.
                           </p>
                       </div>
                   </div>
                   <div className="col-12 col-md-4">
                       <div className="feature-card p-3 h-100">
                           <FaHandsHelping className="feature-icon mb-3" size={40} />
                           <h5 className="highlight">Community Support</h5>
                           <p className="home-paragraph">
                               Share tips, learn from others, and grow together sustainably.
                           </p>
                       </div>
                   </div>
                   <div className="col-12 col-md-4">
                       <div className="feature-card p-3 h-100">
                           <FaTrophy className="feature-icon mb-3" size={40} />
                           <h5 className="highlight">Achieve Your Goals</h5>
                           <p className="home-paragraph">
                               Set personal eco-goals, track your progress, and earn badges.
                           </p>
                       </div>
                   </div>
               </div>
           </div>
           {/* Call to Action */}
           <div className="cta-card">
               <FaSeedling className="mb-3" size={45} />
               <h2>Ready to make a difference?</h2>
               <p>
                   Sign up today and take your first step toward a sustainable lifestyle.
               </p>
               <a href="/signup" className="btn btn-eco shadow-hover">
                   Join Now
               </a>
           </div>
       </div>
   );
};
export default About;