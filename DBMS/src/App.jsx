import { Routes, Route, Navigate } from "react-router-dom";
import { SignedIn, SignedOut } from "@clerk/clerk-react";

import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import LandingPage from "./pages/LandingPage.jsx";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<SignedOut><Login /></SignedOut>} />
      <Route path="/signup" element={<SignedOut><Signup /></SignedOut>} />
      <Route path="/homepage" element={<LandingPage/>} />

      {/* Catch-all for unknown routes */}
      <Route path="*" element={<Navigate to="/homepage" />} />
    </Routes>
  );
}

export default App;