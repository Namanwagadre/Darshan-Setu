import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function EditTemple() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [imageUrl, setImageUrl] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: '', state: '', city: '', deity: '', historicalBackground: '', dressCode: ''
  });

  const [timings, setTimings] = useState([]);

  useEffect(() => {
    fetch(`https://darshan-setu-backend.onrender.com/api/temples/${id}`)
      .then(res => res.json())
      .then(data => {
        setFormData({
          name: data.name,
          state: data.location?.state || '',
          city: data.location?.city || '',
          deity: data.deity,
          historicalBackground: data.historicalBackground,
          dressCode: data.visitorGuidelines?.dressCode || ''
        });
        setImageUrl(data.imageUrl || ''); 
        
        
        const fetchedTimings = data.darshanTimings && data.darshanTimings.length > 0 
          ? data.darshanTimings 
          : [
              { sessionName: 'Morning Darshan', startTime: '', endTime: '' },
              { sessionName: 'Evening Darshan', startTime: '', endTime: '' }
            ];
        setTimings(fetchedTimings);
        
        setLoading(false);
      })
      .catch(err => {
        console.error("Error:", err);
        setStatus('❌ Error loading temple data');
        setLoading(false);
      });
  }, [id]);

  const handleTimingChange = (index, field, value) => {
    const newTimings = [...timings];
    newTimings[index][field] = value;
    setTimings(newTimings);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append('image', file);

    setUploadingImage(true);
    setStatus('Uploading new image to Cloudinary... ⏳');

    try {
      const res = await fetch('https://darshan-setu-backend.onrender.com/api/temples/upload-image', {
        method: 'POST',
        body: uploadData
      });
      const data = await res.json();
      
      if (res.ok) {
        setImageUrl(data.imageUrl); 
        setStatus('✅ New Image uploaded!');
      } else {
        setStatus(`❌ Failed: ${data.message || 'Upload failed'}`);
      }
    } catch (err) {
      setStatus('❌ Server error during image upload.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Updating... ⏳');

    const updatedTemple = {
      name: formData.name,
      imageUrl: imageUrl, 
      location: {
        state: formData.state,
        city: formData.city,
      },
      deity: formData.deity,
      historicalBackground: formData.historicalBackground,
      visitorGuidelines: {
        dressCode: formData.dressCode,
        rules: []
      },
      darshanTimings: timings.filter(t => t.startTime !== '' && t.endTime !== '')
    };

    try {
      const response = await fetch(`https://darshan-setu-backend.onrender.com/api/temples/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTemple)
      });

      if (response.ok) {
        toast.success('Temple Updated Successfully!'); 
        navigate(`/temple/${id}`); 
      } else {
        setStatus('❌ Failed to update temple.');
        toast.error('Failed to update temple.');
      }
    } catch (error) {
      console.error("Error:", error);
      setStatus('❌ Server error!');
      toast.error('Server error!');
    }
  };

  if (loading) return <div className="text-center mt-20 text-2xl font-bold text-gray-500">Loading Temple Details... ⏳</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-5">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h2 className="text-3xl font-bold text-gray-800">✏️ Edit Temple</h2>
          <Link to={`/temple/${id}`} className="px-4 py-2 bg-gray-100 text-gray-600 font-semibold rounded-lg hover:bg-gray-200 transition-colors">
            Cancel
          </Link>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Temple Name</label>
              <input type="text" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <label className="block text-gray-700 font-semibold mb-2">Update Temple Photo</label>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageUpload}
                disabled={uploadingImage}
                className="w-full text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
              />
              {imageUrl && (
                <div className="mt-3">
                  <p className="text-green-600 text-sm font-semibold mb-1">Current Image:</p>
                  <img src={imageUrl} alt="Preview" className="h-32 w-auto rounded-lg shadow-md" />
                </div>
              )}
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Main Deity</label>
              <input type="text" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.deity} onChange={(e) => setFormData({...formData, deity: e.target.value})} />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">City</label>
              <input type="text" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">State</label>
              <input type="text" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.state} onChange={(e) => setFormData({...formData, state: e.target.value})} />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Historical Background</label>
            <textarea required rows="3" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.historicalBackground} onChange={(e) => setFormData({...formData, historicalBackground: e.target.value})}></textarea>
          </div>

          <div className="bg-blue-50 p-5 rounded-xl border border-blue-100">
            <h3 className="text-xl font-bold text-blue-800 mb-4">🙏 Darshan Timings</h3>
            {timings.map((timing, index) => (
              <div key={index} className="flex gap-4 mb-3 items-end">
                <div className="flex-1">
                  <label className="block text-sm text-gray-700 font-semibold mb-1">Session Name</label>
                  <input type="text" className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                    value={timing.sessionName} onChange={(e) => handleTimingChange(index, 'sessionName', e.target.value)} />
                </div>
                <div className="flex-1">
                  <label className="block text-sm text-gray-700 font-semibold mb-1">Start Time</label>
                  <input type="text" className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                    value={timing.startTime} onChange={(e) => handleTimingChange(index, 'startTime', e.target.value)} />
                </div>
                <div className="flex-1">
                  <label className="block text-sm text-gray-700 font-semibold mb-1">End Time</label>
                  <input type="text" className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                    value={timing.endTime} onChange={(e) => handleTimingChange(index, 'endTime', e.target.value)} />
                </div>
              </div>
            ))}
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Dress Code / Visitor Guidelines</label>
            <input type="text" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.dressCode} onChange={(e) => setFormData({...formData, dressCode: e.target.value})} />
          </div>

          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors text-lg mt-4">
            Save Changes
          </button>

          {status && <p className="text-center font-semibold mt-4 text-lg text-gray-800">{status}</p>}
        </form>
      </div>
    </div>
  );
}