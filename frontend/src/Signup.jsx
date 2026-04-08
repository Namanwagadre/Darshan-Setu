import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Signup() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'user' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('https://darshan-setu-backend.onrender.com/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (res.ok) {
        
        toast.success("Account created successfully! Please login.");
        navigate('/login'); 
      } else {
        toast.error(data.message || 'Signup failed!');
      }
    } catch (err) {
      setError('Server error!');
    }
  };

  return (
    <div className="min-h-screen bg-orange-50 flex items-center justify-center px-5">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full border border-gray-100">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">📝 Create Account</h2>
        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Full Name</label>
            <input type="text" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
              value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Email</label>
            <input type="email" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
              value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Password</label>
            <input type="password" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
              value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Select Role</label>
            <select className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
              value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})}>
              <option value="user">Normal User (Only View)</option>
              <option value="admin">Admin (Add/Edit/Delete)</option>
            </select>
          </div>
          {error && <p className="text-red-500 text-sm font-medium text-center">{error}</p>}
          <button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-lg transition-colors mt-2">
            Sign Up
          </button>
        </form>
        <p className="text-center mt-4 text-gray-600">
          Already have an account? <Link to="/login" className="text-orange-600 font-bold hover:underline">Login here</Link>
        </p>
      </div>
    </div>
  );
}