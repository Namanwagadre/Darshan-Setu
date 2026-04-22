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
    <div className="min-h-screen bg-orange-50 py-5 px-4 md:px-8 font-sans">
      
      {/* --- CLEAN & COMPACT RESPONSIVE NAVBAR --- */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center bg-white p-5 rounded-2xl shadow-sm mb-8 gap-4 border border-orange-100">
        <h2 className="text-2xl font-black text-orange-600 tracking-tighter">Darshan Setu</h2>
        
        <div className="flex flex-col items-center md:items-end gap-3 w-full md:w-auto">
          {user ? (
            <div className="flex flex-col items-center md:items-end gap-2 w-full">
              <span className="font-bold text-gray-700 text-sm md:text-base">
                Namaste, {user.name} 🙏
              </span>
              
              {/* Action Buttons Group */}
              <div className="flex flex-wrap justify-center gap-2">
                <Link to="/profile" className="px-3 py-2 bg-green-50 text-green-700 text-xs font-bold rounded-lg hover:bg-green-600 hover:text-white transition-all border border-green-200">
                  👤 Profile
                </Link>
                
                {user.role === 'admin' && (
                  <Link to="/admin" className="px-3 py-2 bg-blue-50 text-blue-600 text-xs font-bold rounded-lg hover:bg-blue-600 hover:text-white transition-all border border-blue-200">
                    ➕ Add Temple
                  </Link>
                )}

                <button 
                  onClick={handleLogout} 
                  className="px-3 py-2 bg-red-50 text-red-600 text-xs font-bold rounded-lg hover:bg-red-600 hover:text-white transition-all border border-red-200"
                >
                  Logout 🚪
                </button>
              </div>
            </div>
          ) : (
            <div className="flex gap-3">
              <Link to="/login" className="px-6 py-2 bg-orange-100 text-orange-600 font-bold rounded-xl hover:bg-orange-600 hover:text-white transition-all">Login</Link>
              <Link to="/signup" className="px-6 py-2 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-700 transition-all shadow-md">Sign Up</Link>
            </div>
          )}
        </div>
      </div>

      {/* --- HERO SECTION --- */}
      <div className="max-w-7xl mx-auto mb-10 text-center">
        <h1 className="text-4xl md:text-6xl font-black text-orange-600 mb-4 px-2 leading-tight">
          Explore Temples <br className="md:hidden"/> of India
        </h1>
        <div className="max-w-2xl mx-auto relative mt-6 px-2">
          <input
            type="text"
            placeholder="Search name, city, or deity..."
            className="w-full px-6 py-4 rounded-full border-2 border-orange-100 shadow-lg focus:outline-none focus:ring-4 focus:ring-orange-200 text-gray-700 text-base md:text-lg transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="absolute right-8 top-4 text-xl">🔍</span>
        </div>
      </div>

      {/* --- TEMPLE GRID --- */}
      <div className="max-w-7xl mx-auto">
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-4 border-orange-600 mb-4"></div>
            <p className="text-xl font-bold text-gray-500">Fetching Spiritual Wonders... 🕉️</p>
          </div>
        ) : filteredTemples.length === 0 ? (
          <div className="text-center text-xl font-bold text-gray-400 mt-10 bg-white p-10 rounded-3xl shadow-inner">
            No temples found matching "{searchTerm}" 😔
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filteredTemples.map((temple) => (
              <Link to={`/temple/${temple._id}`} key={temple._id} className="bg-white rounded-3xl shadow-md hover:shadow-2xl transition-all duration-500 overflow-hidden border border-orange-50 flex flex-col group">
                
                {/* Image Container */}
                <div className="h-56 w-full bg-gray-100 overflow-hidden relative">
                  {temple.imageUrl ? (
                    <img src={temple.imageUrl} alt={temple.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 font-medium bg-gray-50">
                      <span>📸 No Image Available</span>
                    </div>
                  )}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black text-orange-600 shadow-sm uppercase tracking-widest border border-orange-100">
                    🚩 {temple.location.state}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col">
                  <h2 className="text-2xl font-extrabold text-gray-800 mb-1 group-hover:text-orange-600 transition-colors leading-tight">{temple.name}</h2>
                  <p className="text-orange-500 font-bold text-[10px] mb-4 uppercase tracking-[0.2em]">Deity: {temple.deity}</p>
                  
                  <div className="flex items-center text-gray-700 mb-4 bg-orange-50/70 p-3 rounded-2xl border border-orange-100">
                    <span className="text-base">📍</span>
                    <p className="ml-2 text-xs font-bold uppercase tracking-tight">{temple.location.city}, {temple.location.state}</p>
                  </div>
                  
                  <p className="text-gray-500 text-sm mb-6 line-clamp-2 leading-relaxed font-medium">
                    {temple.historicalBackground}
                  </p>
                  
                  {/* Timings */}
                  <div className="border-t-2 border-dashed border-gray-100 pt-5 mt-auto">
                    <h3 className="text-xs font-black text-gray-400 mb-3 uppercase tracking-widest flex items-center gap-2">
                      🙏 Darshan Timings
                    </h3>
                    <div className="space-y-2">
                      {temple.darshanTimings && temple.darshanTimings.slice(0, 2).map((timing, index) => (
                        <div key={index} className="flex justify-between items-center text-[11px] bg-gray-50/50 px-3 py-2 rounded-lg">
                          <span className="font-bold text-gray-500">{timing.sessionName}</span>
                          <span className="font-black text-orange-600">{timing.startTime} - {timing.endTime}</span>
                        </div>
                      ))}
                    </div>
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