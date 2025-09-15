import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from './contexts/AuthContext';

import Navbar from "./components/layout/NavBar";
import About from "./pages/About/About";
import Home from "./pages/Home/Home";
import Signup from "./pages/Auth/SignUp";
import Signin from "./pages/Auth/SignIn";
import ProtectedRoute from './components/common/ProtectedRoute'
import PersonalDashboard from './pages/Dashboard/PersonalDashboard/PersonalDashboard'
import BusinessDashboard from './pages/Dashboard/BusinessDashboard/BusinessDashboard'
import EmployeeDashboard from './pages/Dashboard/EmployeeDashboard/EmployeeDashboard'
import DashboardRedirect from './components/dashboard/DashboardRedirect'
import ForgotPassword from './pages/Auth/ForgotPassword'
import Profile from './pages/Profile/Profile'
import Settings from './pages/Profile/Settings'

import CarbonFootprintForm from './components/forms/CarbonFootprintForm';
import Community from "./pages/Comm/Community";

import "./App.css";


// function App() {
//   return (
//     <Router>
//       <div className="app-background">
//         {/* Navbar is always visible */}
//         <Navbar />
//         {/* Routes */}
//         <Routes>
//           {/* Landing Page */}
//           <Route path="/" element={<Home />} />
//           {/* Signup Page */}
//           <Route path="/signup" element={<Signup />} />
//           {/* Signin Page */}
//           <Route path="/signin" element={<Signin />} />
//         </Routes>
//       </div>
//     </Router>
//   );
// }

// export default App;

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-background">
          <Navbar />
          <Routes>
            <Route path="/" element={<About />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            
            {/* Protected Routes */}
            {/* <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            /> */}
            <Route 
              path="/home" 
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <DashboardRedirect />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/dashboard/personal" 
              element={
                <ProtectedRoute>
                  <PersonalDashboard />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/dashboard/business" 
              element={
                <ProtectedRoute>
                  <BusinessDashboard />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/dashboard/employee" 
              element={
                <ProtectedRoute>
                  <EmployeeDashboard />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/settings" 
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/community" 
              element={
                <ProtectedRoute>
                  <Community />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/carbon-footprint" 
              element={
                <ProtectedRoute>
                  <CarbonFootprintForm  />
                </ProtectedRoute>
              } 
            />
            
            {/* Add more protected routes as needed */}
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;