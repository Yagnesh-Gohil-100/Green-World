import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  FaSeedling,
  FaHome,
  FaChartLine,
  FaUsers,
  FaSignInAlt,
  FaUserPlus,
  FaUserCircle,
  FaInfoCircle,
  FaCog,
  FaLeaf,
  FaSignOutAlt,
} from "react-icons/fa";
import { useAuth } from "../../contexts/AuthContext";
import { Navbar, Nav, Container, Dropdown } from "react-bootstrap";
import "./NavBar.css";

const NavBar = () => {
  const { currentUser, userType, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const formatUserType = (type) => {
    const typeMap = {
      personal: "Personal User",
      business: "Business Admin",
      employee: "Business Employee",
    };
    return typeMap[type] || type;
  };

  return (
    <Navbar expand="lg" bg="light" variant="light" sticky="top" className="eco-navbar shadow-sm">
      <Container fluid>
        {/* Brand */}
        {currentUser ? (<Navbar.Brand as={Link} to="/home" className="fw-bold d-flex align-items-center">
          <FaSeedling size={28} className="me-2 text-success" />
          EcoTrackify
        </Navbar.Brand>): (
          <Navbar.Brand as={Link} to="/" className="fw-bold d-flex align-items-center">
          <FaSeedling size={28} className="me-2 text-success" />
          EcoTrackify
        </Navbar.Brand>
        )}

        <Navbar.Toggle aria-controls="main-navbar" />
        <Navbar.Collapse id="main-navbar">
          {/* Left side */}
          <Nav className="me-auto">
            {currentUser ? (
              <>
                <Nav.Link as={Link} to="/home" className="d-flex align-items-center gap-2">
                  <FaHome /> Home
                </Nav.Link>

                <Nav.Link as={Link} to="/dashboard" className="d-flex align-items-center gap-2">
                  <FaChartLine /> Dashboard
                </Nav.Link>
                <Nav.Link as={Link} to="/carbon-footprint" className="d-flex align-items-center gap-2">
                  <FaLeaf /> Carbon Tracker
                </Nav.Link>
                <Nav.Link as={Link} to="/community" className="d-flex align-items-center gap-2">
                  <FaUsers /> Community
                </Nav.Link>
              </>
            ) : (
              <>
                {/* Not logged in → only About, but make it feel centered */}
                <Nav.Link as={Link} to="/" className="d-flex align-items-center gap-2">
                  <FaInfoCircle /> About
                </Nav.Link>
              </>
            )}
          </Nav>

          {/* Right side */}
          <Nav className="ms-auto">
            {currentUser ? (
              <>
                <Dropdown align="end">
                  <Dropdown.Toggle
                    as="button"
                    className="btn btn-link nav-link d-flex align-items-center text-decoration-none"
                    style={{ border: "none", background: "none" }}
                  >
                    <FaUserCircle className="me-2" />
                    <span className="d-none d-md-inline">
                      {currentUser?.name || currentUser?.organization}
                    </span>
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Header>
                      Signed in as <strong>{formatUserType(userType)}</strong>
                    </Dropdown.Header>
                    <Dropdown.Divider />
                    <Dropdown.Item as={Link} to="/profile" className="d-flex align-items-center gap-2">
                      <FaUserCircle /> Manage Profile
                    </Dropdown.Item>
 
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={handleLogout} className="d-flex align-items-center gap-2">
                      <FaSignOutAlt /> Logout
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/signin" className="d-flex align-items-center gap-2">
                  <FaSignInAlt /> Sign In
                </Nav.Link>
                <Link
                  to="/signup"
                  className="btn btn-success btn-signup d-flex align-items-center gap-2 ms-2"
                  style={{ padding: "0.5rem 1rem" }}
                >
                  <FaUserPlus /> Sign Up
                </Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
