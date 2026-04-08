import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function TempleDetails() {
  const { id } = useParams(); 
  const userInfoString = localStorage.getItem('userInfo');
  const user = userInfoString ? JSON.parse(userInfoString) : null;
  const navigate = useNavigate();
  const [temple, setTemple] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetch(`https://darshan-setu-backend.onrender.com/api/temples/${id}`)
      .then(res => res.json())
      .then(data => {
        setTemple(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error:", err);
        setLoading(false);
      });
  }, [id]);

  const handleDelete = async () => {
    const confirmDelete = window.confirm(`Are you sure you want to delete ${temple.name}?`);
    if (!confirmDelete) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`https://darshan-setu-backend.onrender.com/api/temples/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success("Temple deleted successfully!"); // 🌟 ALERT HATAKAR TOAST LAGA DIYA
        navigate('/');
      } else {
        toast.error("Failed to delete the temple."); // 🌟 ALERT HATAKAR TOAST LAGA DIYA
        setIsDeleting(false);
      }
    } catch (error) {
      console.error("Error deleting temple:", error);
      toast.error("Server Error while deleting."); // 🌟 ALERT HATAKAR TOAST LAGA DIYA
      setIsDeleting(false);
    }
  };

  const handleBookmark = async () => {
    if (!user) {
      toast.error("Please login to save temples!");
      return;
    }

    try {
      const res = await fetch('https://darshan-setu-backend.onrender.com/api/auth/toggle-bookmark', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, templeId: id })
      });
      const data = await res.json();

      if (res.ok) {
        toast.success(data.message);
        const updatedUser = { ...user, savedTemples: data.savedTemples };
        localStorage.setItem('userInfo', JSON.stringify(updatedUser));
      } else {
        toast.error("Failed to update bookmark.");
      }
    } catch (err) {
      toast.error("Server error!");
    }
  };

  if (loading) return <div className="text-center mt-20 text-2xl font-bold text-gray-500">Loading Temple Details... ⏳</div>;
  if (!temple) return <div className="text-center mt-20 text-2xl text-red-500">Temple not found!</div>;

  return (
    <div className="min-h-screen bg-orange-50 py-10 px-5">
      <div className="max-w-5xl mx-auto">
        
        {/* Top Action Buttons */}
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <Link to="/" className="px-4 py-2 bg-white text-orange-600 font-semibold rounded-lg shadow hover:bg-orange-600 hover:text-white transition-colors">
            ← Back to Home
          </Link>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={handleBookmark}
              className="px-5 py-2.5 bg-orange-100 text-orange-600 font-bold rounded-xl hover:bg-orange-600 hover:text-white transition-all shadow-sm border border-orange-200"
            >
              🔖 Save Temple
            </button>

            {user && user.role === 'admin' && (
              <>
                <Link 
                  to={`/edit/${temple._id}`} 
                  className="px-4 py-2.5 bg-blue-100 text-blue-600 font-semibold rounded-xl shadow hover:bg-blue-600 hover:text-white border border-blue-200 transition-colors"
                >
                  ✏️ Edit
                </Link>
                
                <button 
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className={`px-4 py-2.5 font-semibold rounded-xl shadow transition-colors ${
                    isDeleting ? "bg-gray-400 text-white cursor-not-allowed" : "bg-red-100 text-red-600 hover:bg-red-600 hover:text-white border border-red-200"
                  }`}
                >
                  {isDeleting ? 'Deleting...' : '🗑️ Delete'}
                </button>
              </>
            )}
          </div>
        </div>

        
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 mb-10">
          
          
          {temple.imageUrl ? (
            <div className="w-full h-64 md:h-96 bg-gray-200 relative">
              <img src={temple.imageUrl} alt={temple.name} className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="w-full h-48 bg-gray-100 flex items-center justify-center border-b border-gray-200">
              <span className="text-gray-400 font-medium text-lg">📸 No Image Available</span>
            </div>
          )}

          <div className="p-8 md:p-12">
            <div className="border-b pb-6 mb-6">
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-2">{temple.name}</h1>
              <p className="text-xl text-orange-600 font-semibold mb-4">Dedicated to: {temple.deity}</p>
              <div className="flex items-center text-gray-600 text-lg">
                <span>📍</span>
                <span className="ml-2">{temple.location.city}, {temple.location.state}</span>
              </div>
            </div>

            <div className="mb-10">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 border-l-4 border-orange-500 pl-3">Historical Significance</h2>
              <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-line">
                {temple.historicalBackground}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="bg-orange-50 p-6 rounded-2xl">
                <h2 className="text-2xl font-bold text-orange-800 mb-4">🙏 Darshan & Aarti Timings</h2>
                <ul className="space-y-4">
                  {temple.darshanTimings && temple.darshanTimings.map((timing, idx) => (
                    <li key={idx} className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm">
                      <span className="font-semibold text-gray-800">{timing.sessionName}</span>
                      <span className="text-orange-600 font-bold">{timing.startTime} - {timing.endTime}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-gray-50 p-6 rounded-2xl">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">🛡️ Visitor Guidelines</h2>
                {temple.visitorGuidelines && temple.visitorGuidelines.dressCode && (
                  <div className="mb-4 bg-white p-4 rounded-xl shadow-sm border-l-4 border-blue-500">
                    <p className="font-semibold text-gray-700">👕 Dress Code:</p>
                    <p className="text-gray-600">{temple.visitorGuidelines.dressCode}</p>
                  </div>
                )}
                {temple.visitorGuidelines && temple.visitorGuidelines.rules && temple.visitorGuidelines.rules.length > 0 && (
                  <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-red-500">
                    <p className="font-semibold text-gray-700 mb-2">⚠️ Rules:</p>
                    <ul className="list-disc pl-5 text-gray-600 space-y-1">
                      {temple.visitorGuidelines.rules.map((rule, idx) => (
                        <li key={idx}>{rule}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}