import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import LandingPage from "./pages/LandingPage.jsx";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/homepage" element={<LandingPage />} />

      {/* Redirect unknown routes to homepage */}
      <Route path="*" element={<Navigate to="/homepage" />} />
    </Routes>
  );
}

export default App;
