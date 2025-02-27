import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import TrafficMap from "./TrafficMap";
import Events from "./Events";
import Feedback from "./Feedback";
import Analytics from "./Analytics"; // Import Analytics component
import Footer from "./Footer";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="app">
        {/* Navbar */}
        <nav className="navbar">
          <div className="navbar-links">
            <Link to="/">Home</Link>
            <Link to="/traffic">Real-Time Traffic Monitoring</Link>
            <Link to="/waste">Waste Collection Management</Link>
            <Link to="/events">City Events Management</Link>
            <Link to="/transport">Public Transport Management</Link>
            <Link to="/feedback">Citizen Feedback and Engagement</Link>
            <div className="navbar-profile">
              <div className="profile-circle">A</div>
            </div>
          </div>
        </nav>

        {/* Page Routing */}
        <div className="main-content">
          <Routes>
            <Route path="/traffic" element={<TrafficMap />} />
            <Route path="/events" element={<Events />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/analytics" element={<Analytics />} /> {/* Add Analytics route */}
          </Routes>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;