import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function App() {
  const [temples, setTemples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();


  const userInfoString = localStorage.getItem('userInfo');
  const user = userInfoString ? JSON.parse(userInfoString) : null;

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('userInfo');
    navigate('/login');
  };

  useEffect(() => {
    fetch('https://darshan-setu-backend.onrender.com/api/temples')
      .then(res => res.json())
      .then(data => {
        setTemples(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching data:", err);
        setLoading(false);
      });
  }, []);

  const filteredTemples = temples.filter(temple => {
    const searchLower = searchTerm.toLowerCase();
    return (
      temple.name.toLowerCase().includes(searchLower) ||
      temple.location.city.toLowerCase().includes(searchLower) ||
      temple.location.state.toLowerCase().includes(searchLower) ||
      temple.deity.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="min-h-screen bg-orange-50 py-5 px-5">
      
      
      <div className="max-w-7xl mx-auto flex justify-between items-center bg-white p-4 rounded-xl shadow-sm mb-8">
        <h2 className="text-2xl font-bold text-orange-600">Darshan Setu</h2>
        
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="font-semibold text-gray-700">Namaste, {user.name} 🙏</span>
              <Link to="/profile" className="px-4 py-2 bg-green-100 text-green-700 font-semibold rounded-lg hover:bg-green-600 hover:text-white transition-colors">
                👤 My Profile
              </Link>
              
              {user.role === 'admin' && (
                <Link to="/admin" className="px-4 py-2 bg-blue-100 text-blue-600 font-semibold rounded-lg hover:bg-blue-600 hover:text-white transition-colors">
                  ➕ Add Temple
                </Link>
              )}
              <button onClick={handleLogout} className="px-4 py-2 bg-red-100 text-red-600 font-semibold rounded-lg hover:bg-red-600 hover:text-white transition-colors">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="px-4 py-2 bg-orange-100 text-orange-600 font-semibold rounded-lg hover:bg-orange-600 hover:text-white transition-colors">Login</Link>
              <Link to="/signup" className="px-4 py-2 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-colors">Sign Up</Link>
            </>
          )}
        </div>
      </div>
     

      <div className="max-w-7xl mx-auto mb-10 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-orange-600 mb-4">
          Explore Temples of India
        </h1>
        <div className="max-w-2xl mx-auto relative mt-6">
          <input
            type="text"
            placeholder="Search by temple name, city, state, or deity..."
            className="w-full px-5 py-4 rounded-full border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-700 text-lg transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="absolute right-5 top-4 text-2xl">🔍</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {loading ? (
          <div className="text-center text-2xl font-semibold text-gray-500 mt-20">Fetching Temples... ⏳</div>
        ) : filteredTemples.length === 0 ? (
          <div className="text-center text-xl text-gray-500 mt-10">No temples found matching "{searchTerm}" 😔</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTemples.map((temple) => (
              <Link to={`/temple/${temple._id}`} key={temple._id} className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 block cursor-pointer flex flex-col">
                
               
                <div className="h-48 w-full bg-gray-200 overflow-hidden relative">
                  {temple.imageUrl ? (
                    <img src={temple.imageUrl} alt={temple.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 font-medium bg-gray-100">
                      <span>📸 No Image Available</span>
                    </div>
                  )}
                </div>

                <div className="p-6 flex-1 flex flex-col">
                  <h2 className="text-2xl font-bold text-gray-800 mb-1">{temple.name}</h2>
                  <p className="text-orange-500 font-medium text-sm mb-4">Deity: {temple.deity}</p>
                  <div className="flex items-center text-gray-600 mb-4 bg-gray-50 p-2 rounded-lg">
                    <span>📍</span><p className="ml-2 text-sm font-semibold">{temple.location.city}, {temple.location.state}</p>
                  </div>
                  <p className="text-gray-600 text-sm mb-5 line-clamp-3">{temple.historicalBackground}</p>
                  
                  <div className="border-t border-gray-200 pt-4 mt-auto">
                    <h3 className="font-semibold text-gray-800 mb-2">🙏 Darshan Timings</h3>
                    {temple.darshanTimings && temple.darshanTimings.map((timing, index) => (
                      <div key={index} className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>{timing.sessionName}</span>
                        <span className="font-medium text-gray-800">{timing.startTime} - {timing.endTime}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;