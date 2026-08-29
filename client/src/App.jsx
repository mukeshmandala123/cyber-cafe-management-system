import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { useEffect, useState } from "react";

import Terminals from "./pages/Terminals";
import Customers from "./pages/Customers";
import Sessions from "./pages/Sessions";
import Services from "./pages/Services";
import Billing from "./pages/Billing";

import "./App.css";

function Dashboard() {
  const [dashboard, setDashboard] = useState({
    totalCustomers: 0,
    totalTerminals: 0,
    availableTerminals: 0,
    activeSessions: 0,
  });

  const fetchDashboard = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/dashboard"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch dashboard data");
      }

      const data = await response.json();

      setDashboard({
        totalCustomers: data.totalCustomers || 0,
        totalTerminals: data.totalTerminals || 0,
        availableTerminals: data.availableTerminals || 0,
        activeSessions: data.activeSessions || 0,
      });
    } catch (error) {
      console.error("Dashboard error:", error);
    }
  };

  useEffect(() => {
    fetchDashboard();

    const interval = setInterval(
      fetchDashboard,
      5000
    );

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container-fluid py-4">

      <div className="mb-4">
        <h1 className="fw-bold">
          Cyber Cafe Management System
        </h1>

        <p className="text-muted">
          Monitor your cyber cafe from one place.
        </p>
      </div>

      <div className="row g-4">

        <div className="col-md-6 col-lg-3">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h6 className="text-muted">
                Total Customers
              </h6>

              <h2 className="fw-bold">
                {dashboard.totalCustomers}
              </h2>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h6 className="text-muted">
                Total Terminals
              </h6>

              <h2 className="fw-bold">
                {dashboard.totalTerminals}
              </h2>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h6 className="text-muted">
                Available Terminals
              </h6>

              <h2 className="fw-bold">
                {dashboard.availableTerminals}
              </h2>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h6 className="text-muted">
                Active Sessions
              </h6>

              <h2 className="fw-bold">
                {dashboard.activeSessions}
              </h2>
            </div>
          </div>
        </div>

      </div>

      <div className="card shadow-sm mt-4">

        <div className="card-body">

          <h5 className="fw-bold mb-3">
            Quick Actions
          </h5>

          <Link
            to="/customers"
            className="btn btn-primary me-2 mb-2"
          >
            Manage Customers
          </Link>

          <Link
            to="/terminals"
            className="btn btn-outline-primary me-2 mb-2"
          >
            Manage Terminals
          </Link>

          <Link
            to="/sessions"
            className="btn btn-success me-2 mb-2"
          >
            Manage Sessions
          </Link>

          <Link
            to="/services"
            className="btn btn-warning me-2 mb-2"
          >
            Services
          </Link>

          <Link
            to="/billing"
            className="btn btn-dark mb-2"
          >
            Final Billing
          </Link>

        </div>

      </div>

    </div>
  );
}

function App() {
  return (
    <BrowserRouter>

      <div className="d-flex flex-column min-vh-100">

        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">

          <div className="container-fluid">

            <Link
              className="navbar-brand fw-bold"
              to="/"
            >
              Cyber Cafe
            </Link>

            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
            >
              <span className="navbar-toggler-icon"></span>
            </button>

            <div
              className="collapse navbar-collapse"
              id="navbarNav"
            >

              <ul className="navbar-nav ms-auto">

                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/"
                  >
                    Dashboard
                  </Link>
                </li>

                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/customers"
                  >
                    Customers
                  </Link>
                </li>

                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/terminals"
                  >
                    Terminals
                  </Link>
                </li>

                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/sessions"
                  >
                    Sessions
                  </Link>
                </li>

                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/services"
                  >
                    Services
                  </Link>
                </li>

                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/billing"
                  >
                    Billing
                  </Link>
                </li>

              </ul>

            </div>

          </div>

        </nav>

        <main className="flex-grow-1">

          <Routes>

            <Route
              path="/"
              element={<Dashboard />}
            />

            <Route
              path="/customers"
              element={<Customers />}
            />

            <Route
              path="/terminals"
              element={<Terminals />}
            />

            <Route
              path="/sessions"
              element={<Sessions />}
            />

            <Route
              path="/services"
              element={<Services />}
            />

            <Route
              path="/billing"
              element={<Billing />}
            />

          </Routes>

        </main>

        <footer className="bg-dark text-white text-center py-3">

          <small>
            Cyber Cafe Management System © 2026
          </small>

        </footer>

      </div>

    </BrowserRouter>
  );
}

export default App;