import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Events from "./pages/Events";
import EventForm from "./pages/EventForm";
import Teachings from "./pages/Teachings";
import TeachingForm from "./pages/TeachingForm";
import Settings from "./pages/Settings";

// Protected Route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const isAuthenticated = localStorage.getItem("adminToken");
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="events" element={<Events />} />
            <Route path="events/new" element={<EventForm />} />
            <Route path="events/edit/:id" element={<EventForm />} />
            <Route path="teachings" element={<Teachings />} />
            <Route path="teachings/new" element={<TeachingForm />} />
            <Route path="teachings/edit/:id" element={<TeachingForm />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {/* Toast notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#363636",
              color: "#fff",
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: "#4ade80",
                secondary: "#fff",
              },
            },
            error: {
              duration: 5000,
              iconTheme: {
                primary: "#ef4444",
                secondary: "#fff",
              },
            },
          }}
        />
      </div>
    </Router>
  );
}

export default App;
