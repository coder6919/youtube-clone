import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import { toast } from 'react-toastify';

const Register = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/auth/register', formData);
      toast.success("Registration Successful! Please Login.");
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration Failed");
    }
  };

  return (
    <div className="flex justify-center items-center h-[calc(100vh-80px)]">
      <div className="bg-youtube-gray p-8 rounded-lg w-full max-w-md border border-gray-700">
        <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block mb-1 text-sm text-gray-400">Username</label>
            <input 
              type="text" 
              name="username"
              className="w-full bg-black border border-gray-600 p-2 rounded focus:border-blue-500 outline-none"
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm text-gray-400">Email</label>
            <input 
              type="email" 
              name="email"
              className="w-full bg-black border border-gray-600 p-2 rounded focus:border-blue-500 outline-none"
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm text-gray-400">Password</label>
            <input 
              type="password" 
              name="password"
              className="w-full bg-black border border-gray-600 p-2 rounded focus:border-blue-500 outline-none"
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-semibold mt-2 cursor-pointer">
            Register
          </button>
        </form>

        <p className="mt-4 text-center text-gray-400 text-sm">
          Already have an account? <Link to="/login" className="text-blue-400 hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;