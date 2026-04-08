import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Profile() {
  const [savedTemples, setSavedTemples] = useState([]);
  const [loading, setLoading] = useState(true);

  
  const userInfoString = localStorage.getItem('userInfo');
  const user = userInfoString ? JSON.parse(userInfoString) : null;

  useEffect(() => {
    if (user) {
      fetch(`https://darshan-setu-backend.onrender.com/api/auth/saved-temples/${user.id}`)
        .then(res => res.json())
        .then(data => {
          setSavedTemples(data);
          setLoading(false);
        })
        .catch(err => {
          console.error("Error fetching saved temples:", err);
          setLoading(false);
        });
    }
  }, [user]);

  if (!user) return <div className="text-center mt-20 text-xl font-bold">Please Login to view your profile.</div>;

  return (
    <div className="min-h-screen bg-orange-50 py-10 px-5">
      <div className="max-w-7xl mx-auto">
        
       
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">👤 My Profile</h1>
            <p className="text-gray-600 mt-2">Namaste, {user.name}! Here are your saved temples.</p>
          </div>
          <Link to="/" className="px-5 py-2 bg-orange-100 text-orange-600 font-bold rounded-xl hover:bg-orange-600 hover:text-white transition-all">
            ← Back to Home
          </Link>
        </div>

        
        {loading ? (
          <div className="text-center text-xl font-semibold text-gray-500 mt-10">Loading your saved temples... ⏳</div>
        ) : savedTemples.length === 0 ? (
          <div className="text-center bg-white p-10 rounded-2xl shadow-sm border border-gray-100 mt-10">
            <h2 className="text-2xl text-gray-600 font-semibold mb-4">You haven't saved any temples yet. 😔</h2>
            <Link to="/" className="px-6 py-3 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-700 transition-all">
              Explore Temples
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {savedTemples.map((temple) => (
              <Link to={`/temple/${temple._id}`} key={temple._id} className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 block">
                <div className="p-6 h-full flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-2xl font-bold text-gray-800">{temple.name}</h2>
                    <span className="text-2xl" title="Saved">🔖</span>
                  </div>
                  <p className="text-orange-500 font-medium text-sm mb-4">Deity: {temple.deity}</p>
                  <div className="flex items-center text-gray-600 mb-4 bg-gray-50 p-2 rounded-lg">
                    <span>📍</span><p className="ml-2 text-sm font-semibold">{temple.location.city}, {temple.location.state}</p>
                  </div>
                  <p className="text-gray-600 text-sm mb-5 line-clamp-3">{temple.historicalBackground}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}