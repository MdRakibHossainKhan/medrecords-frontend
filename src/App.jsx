import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default route redirects to Login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* The Login Page */}
        <Route path="/login" element={<Login />} />

        {/* We will add the Dashboard and Patient pages here later! */}
      </Routes>
    </BrowserRouter>
  );
}