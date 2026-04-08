import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 

export default function Admin() {
  const navigate = useNavigate();
  const [imageUrl, setImageUrl] = useState(''); 
  const [uploadingImage, setUploadingImage] = useState(false); 
  const [status, setStatus] = useState('');
  const [formData, setFormData] = useState({
    name: '', state: '', city: '', deity: '', historicalBackground: '', dressCode: ''
  });
  
  const [timings, setTimings] = useState([
    { sessionName: 'Morning Darshan', startTime: '', endTime: '' },
    { sessionName: 'Evening Darshan', startTime: '', endTime: '' }
  ]);

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
    setStatus('Uploading image to Cloudinary... ⏳');

    try {
      const res = await fetch('https://darshan-setu-backend.onrender.com/api/temples/upload-image', {
        method: 'POST',
        body: uploadData
      });
      const data = await res.json();
      
      if (res.ok) {
        setImageUrl(data.imageUrl); 
        setStatus('✅ Image uploaded! Now fill other details.');
      } else {
        setStatus(`❌ Failed: ${data.message || 'Image upload failed.'}`);
      }
    } catch (err) {
      setStatus('❌ Server error during image upload.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Saving... ⏳');

    const newTemple = {
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
      const response = await fetch('https://darshan-setu-backend.onrender.com/api/temples', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTemple)
      });

      if (response.ok) {
        setStatus('✅ Temple Added Successfully! Redirecting to Home... 🚀'); 
        
       
        setFormData({ name: '', state: '', city: '', deity: '', historicalBackground: '', dressCode: '' });
        setImageUrl('');
        setTimings([
          { sessionName: 'Morning Darshan', startTime: '', endTime: '' },
          { sessionName: 'Evening Darshan', startTime: '', endTime: '' }
        ]);

        
        setTimeout(() => {
          navigate('/');
        }, 2000);

      } else {
        setStatus('❌ Failed to add temple. Check backend.');
      }
    } catch (error) {
      console.error("Error:", error);
      setStatus('❌ Server error!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-5">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
        
        
        <div className="flex justify-between items-center mb-6 border-b pb-4 flex-wrap gap-4">
          <h2 className="text-3xl font-bold text-gray-800">🛠️ Admin Panel - Add Temple</h2>
          <Link to="/" className="px-4 py-2 bg-gray-100 text-gray-600 font-semibold rounded-lg hover:bg-gray-200 transition-colors">
            ← Back to Home
          </Link>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Temple Name</label>
              <input type="text" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
            </div>

           <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
            <label className="block text-gray-700 font-semibold mb-2">Upload Temple Photo</label>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageUpload}
              disabled={uploadingImage}
              className="w-full text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-600 file:text-white hover:file:bg-orange-700"
            />
            {imageUrl && (
              <div className="mt-3">
                <p className="text-green-600 text-sm font-semibold mb-1">Image Preview:</p>
                <img src={imageUrl} alt="Preview" className="h-32 w-auto rounded-lg shadow-md" />
              </div>
            )}
           </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Main Deity</label>
              <input type="text" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                value={formData.deity} onChange={(e) => setFormData({...formData, deity: e.target.value})} />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">City</label>
              <input type="text" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">State</label>
              <input type="text" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                value={formData.state} onChange={(e) => setFormData({...formData, state: e.target.value})} />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Historical Background</label>
            <textarea required rows="3" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
              value={formData.historicalBackground} onChange={(e) => setFormData({...formData, historicalBackground: e.target.value})}></textarea>
          </div>

          <div className="bg-orange-50 p-5 rounded-xl border border-orange-100">
            <h3 className="text-xl font-bold text-orange-800 mb-4">🙏 Darshan Timings</h3>
            {timings.map((timing, index) => (
              <div key={index} className="flex gap-4 mb-3 items-end">
                <div className="flex-1">
                  <label className="block text-sm text-gray-700 font-semibold mb-1">Session Name</label>
                  <input type="text" className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-orange-500"
                    value={timing.sessionName} onChange={(e) => handleTimingChange(index, 'sessionName', e.target.value)} />
                </div>
                <div className="flex-1">
                  <label className="block text-sm text-gray-700 font-semibold mb-1">Start Time (e.g. 05:00 AM)</label>
                  <input type="text" className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-orange-500"
                    value={timing.startTime} onChange={(e) => handleTimingChange(index, 'startTime', e.target.value)} />
                </div>
                <div className="flex-1">
                  <label className="block text-sm text-gray-700 font-semibold mb-1">End Time (e.g. 12:00 PM)</label>
                  <input type="text" className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-orange-500"
                    value={timing.endTime} onChange={(e) => handleTimingChange(index, 'endTime', e.target.value)} />
                </div>
              </div>
            ))}
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Dress Code / Visitor Guidelines</label>
            <input type="text" placeholder="e.g. Traditional Indian wear required." className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
              value={formData.dressCode} onChange={(e) => setFormData({...formData, dressCode: e.target.value})} />
          </div>

          <button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-4 rounded-lg transition-colors text-lg mt-4">
            Add Temple to Database
          </button>

          {status && <p className="text-center font-semibold mt-4 text-lg text-gray-800">{status}</p>}
        </form>
      </div>
    </div>
  );
}