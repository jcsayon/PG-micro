import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// import { useSupabase } from "../context/SupabaseContext";

const LoginPage = () => {
  // const supabase = useSupabase();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    // const { error } = await supabase.auth.signInWithPassword({ email, password });
    // if (error) {
    //   setError(error.message);
    // } else {
    //   // Redirect to dashboard or handle successful login
    //   navigate('/dashboard');
    // }
    // For now, just navigate to the dashboard without authentication
    navigate('/dashboard');
  };

  return (
    <div className="flex justify-center items-center h-screen bg-purple-100" style={{ width: '1920px', height: '1080px' }}>
      <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-md sm:w-11/12">
        <h1 className="text-2xl font-bold text-purple-600 text-center mb-6">
          PG Micro World Computers
        </h1>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 mb-4 border rounded"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 mb-4 border rounded"
          />
          <button type="submit" className="w-full p-2 bg-purple-600 text-white rounded">
            Login
          </button>
        </form>
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </div>
  );
};

export default LoginPage;
