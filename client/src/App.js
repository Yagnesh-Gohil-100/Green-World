import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/layout/NavBar";
import Home from "./pages/Home/Home";
import Signup from "./pages/Auth/SignUp";
import Signin from "./pages/Auth/SignIn";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="app-background">
        {/* Navbar is always visible */}
        <Navbar />
        {/* Routes */}
        <Routes>
          {/* Landing Page */}
          <Route path="/" element={<Home />} />
          {/* Signup Page */}
          <Route path="/signup" element={<Signup />} />
          {/* Signin Page */}
          <Route path="/signin" element={<Signin />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;