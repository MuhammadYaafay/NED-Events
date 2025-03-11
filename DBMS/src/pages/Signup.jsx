import { LogIn, UserPen } from 'lucide-react';
import React, { useState } from 'react';
import { Link } from "react-router-dom";

const Signup = () => {
  const [email, setEmail] = useState('');
  const [Username, setUsername] = useState('');
  const [type, setType] = useState(["Vendor", "Buyer"]);
    
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Email:', email);
    console.log('Password:', password);
  };

  return (
    <div
    className="flex items-center justify-center  overflow-auto"
    
  >
      <div className="bg-white text-black p-10 rounded-lg shadow-2xl w-full max-w-lg">
        
        {/* Profile Image */}
        <div className="flex justify-center mb-4">
          <img
            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            alt="User Avatar"
            className="w-20 h-20 rounded-full"
          />
        </div>

        <h2 className="text-3xl font-bold mb-6 text-center">Signup</h2>
        
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Username
          </label>
          <input
            type="name"
            id="name"
            value={name}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        <div>
            <label htmlFor="">
                UserTypr:
      </label>

  <select name="type" id="">
    {type.map((e) => (
        <option key={e} value={e}>{e}</option>
    ))}
  </select>
</div>
        </div>
        <div className="flex gap-4">
          <button
            type="submit"
            onClick={handleSubmit}
            className="w-full flex items-center justify-center gap-2 bg-blue-500 text-white py-3 rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Login
            <LogIn className="h-5 w-5" />
          </button>

          {/* Register Button as a Link */}
          <Link
            to="/login"
            className="w-full flex items-center justify-center gap-2 bg-stone-700 text-white py-3 rounded-md shadow-md hover:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-600"
          >
            alreadyUser
            <UserPen className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
