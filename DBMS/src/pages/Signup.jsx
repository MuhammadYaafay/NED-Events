import { LogIn, UserPen } from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSignUp } from "@clerk/clerk-react";

const Signup = () => {
  const { signUp, isLoaded, setActive } = useSignUp();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("Vendor"); 
  const [error, setError] = useState(""); 
  const [pendingVerification, setPendingVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLoaded) return;

    try {
      // Step 1: Create user account
      await signUp.create({
        emailAddress: email,
        password,
        unsafeMetadata: { username, userType },
      });

      // Step 2: Send verification email
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      // Step 3: Show verification input
      setPendingVerification(true);
    } catch (err) {
      setError(err.errors?.[0]?.message || "Signup failed. Please try again.");
    }
  };

  const handleVerification = async (e) => {
    e.preventDefault();
    if (!isLoaded) return;

    try {
      // Step 4: Verify the email with the entered code
      const result = await signUp.attemptEmailAddressVerification({
        code: verificationCode,
      });

      // Step 5: Activate session and redirect
      await setActive({ session: result.createdSessionId });

      window.location.href = "/homepage";
    } catch (err) {
      setError(err.errors?.[0]?.message || "Verification failed. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen w-screen overflow-auto">
      <div className="bg-white text-black p-10 rounded-lg shadow-2xl w-full max-w-lg">
        <div className="flex justify-center mb-4">
          <img
            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            alt="User Avatar"
            className="w-20 h-20 rounded-full"
          />
        </div>

        <h2 className="text-3xl font-bold mb-6 text-center">Signup</h2>

        {error && <p className="text-red-500 text-center">{error}</p>}

        {!pendingVerification ? (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                User Type:
              </label>
              <select
                value={userType}
                onChange={(e) => setUserType(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Vendor">Vendor</option>
                <option value="Buyer">Buyer</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-blue-500 text-white py-3 rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Signup
              <LogIn className="h-5 w-5" />
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerification}>
            <h3 className="text-lg font-semibold text-center mb-4">
              Enter the verification code sent to your email
            </h3>

            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              type="submit"
              className="w-full mt-4 flex items-center justify-center gap-2 bg-green-500 text-white py-3 rounded-md shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Verify Email
            </button>
          </form>
        )}

        <div className="mt-4 text-center">
          <Link to="/login" className="text-blue-600 hover:underline">
            Already have an account? Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
