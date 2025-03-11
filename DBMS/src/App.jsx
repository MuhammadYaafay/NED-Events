import { Routes, Route, Navigate } from "react-router-dom";
import { SignedIn, SignedOut } from "@clerk/clerk-react";

import PublicHome from "./pages/PublicHome.jsx"; // Visible to everyone
import Home from "./pages/Home.jsx"; // Visible to signed-in users
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";

function App() {
  return (
    <Routes>
      {/* Show Public Home if Signed Out, Authenticated Home if Signed In */}
      <Route
        path="/"
        element={
          <>
            <SignedOut>
              <PublicHome />
            </SignedOut>
            <SignedIn>
              <Home />
            </SignedIn>
          </>
        }
      />

      {/* Login & Signup Routes */}
      <Route path="/login" element={<SignedOut><Login /></SignedOut>} />
      <Route path="/signup" element={<SignedOut><Signup /></SignedOut>} />

      {/* Catch-all for unknown routes */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;