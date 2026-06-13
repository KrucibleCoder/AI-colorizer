import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home.jsx";
import DevDashboard from "./pages/DevDashboard.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/__dev/dashboard" element={<DevDashboard />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}