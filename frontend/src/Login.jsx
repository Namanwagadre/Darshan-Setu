import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('https://darshan-setu-backend.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('userInfo', JSON.stringify(data.user)); 
        
        
        toast.success(`Welcome back, ${data.user.name}!`);
        navigate('/'); 
      } else {
        
        toast.error(data.message || 'Invalid Email or Password!');
      }
    } catch (err) {
      setError('Server error!');
    }
  };

  return (
    <div className="min-h-screen bg-orange-50 flex items-center justify-center px-5">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full border border-gray-100">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">🔒 Secure Login</h2>
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Email Address</label>
            <input type="email" required className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
              value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Password</label>
            <input type="password" required className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
              value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          {error && <p className="text-red-500 text-center font-medium">{error}</p>}
          <button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-lg transition-colors">
            Login
          </button>
        </form>
        <p className="text-center mt-4 text-gray-600">
          Don't have an account? <Link to="/signup" className="text-orange-600 font-bold hover:underline">Sign Up here</Link>
        </p>
      </div>
    </div>
  );
}