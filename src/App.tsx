
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";
import Login from './pages/Auth/login';
import Dashboard from './pages/Dashboard/dashbord';
import ForgotPassword from "./pages/Auth/forgotpassword";

const App: React.FC = () => {
  return (
    <Router>
     
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/Auth/forgot-password" element={<ForgotPassword />} />
          
        </Routes>
    
    </Router>
  );
};

export default App;