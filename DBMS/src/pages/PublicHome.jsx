import React from "react";
import { Link } from "react-router-dom";
import NavBar from "../components/NavBar.jsx"
export default function PublicHome() {
  return (
    <>
    <NavBar/>
    <div className="flex items-center justify-center h-screen w-screen">
      <div className="bg-white text-black p-10 rounded-lg shadow-2xl w-full max-w-lg text-center">
        <div className="flex justify-center mb-4">
          <img
            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            alt="App Logo"
            className="w-20 h-20 rounded-full"
          />
        </div>

        <h1 className="text-3xl font-bold mb-6">Welcome to Our App</h1>
        <p className="text-lg text-gray-600 mb-6">
          Please login or sign up to continue.
        </p>

        <div className="flex flex-col gap-4">
          <Link
            to="/login"
            className="w-full !bg-blue-500 py-3 rounded-md !text-white text-center shadow-md hover:bg-blue-600"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="w-full !bg-green-500 py-3 rounded-md !text-white text-center shadow-md hover:bg-green-600"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
    </>

  );
}
