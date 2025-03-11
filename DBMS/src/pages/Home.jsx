import React from "react";
import { SignOutButton } from "@clerk/clerk-react";

export default function Home() {
  return (
    <div className="flex items-center justify-center h-screen w-screen bg-gray-900">
      <div className="bg-white text-black p-10 rounded-lg shadow-2xl w-full max-w-lg text-center">
        <h1 className="text-3xl font-bold mb-6">Home</h1>

        <p className="text-lg text-gray-600 mb-6">
          Welcome, User! You are signed in.
        </p>
        <SignOutButton>
          <button className="w-full bg-red-500 py-3 rounded-md text-white text-center shadow-md hover:bg-red-600">
            Sign Out
          </button>
        </SignOutButton>
      </div>
    </div>
  );
}
