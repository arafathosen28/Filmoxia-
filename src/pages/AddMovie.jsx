import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, storage } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import toast from 'react-hot-toast';

function AddMovie() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    year: '',
    genre: '',
    banner: null,
    downloadLinks: [{ quality: '', language: '', link: '' }]
  });
  
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBannerChange = (e) => {
    if (e.target.files[0]) {
      setFormData(prev => ({
        ...prev,
        banner: e.target.files[0]
      }));
    }
  };

  const handleDownloadLinkChange = (index, field, value) => {
    const newLinks = [...formData.downloadLinks];
    newLinks[index] = { ...newLinks[index], [field]: value };
    setFormData(prev => ({
      ...prev,
      downloadLinks: newLinks
    }));
  };

  const addDownloadLink = () => {
    setFormData(prev => ({
      ...prev,
      downloadLinks: [...prev.downloadLinks, { quality: '', language: '', link: '' }]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Upload banner
      const bannerRef = ref(storage, `banners/${formData.banner.name}`);
      await uploadBytes(bannerRef, formData.banner);
      const bannerUrl = await getDownloadURL(bannerRef);

      // Add movie to Firestore
      await addDoc(collection(db, 'movies'), {
        ...formData,
        banner: bannerUrl,
        createdAt: new Date()
      });

      toast.success('Movie added successfully!');
      navigate('/admin/dashboard');
    } catch (error) {
      toast.error('Failed to add movie.');
      console.error(error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Add New Movie</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows="4"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Year</label>
            <input
              type="number"
              name="year"
              value={formData.year}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Genre</label>
            <input
              type="text"
              name="genre"
              value={formData.genre}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Banner Image</label>
          <input
            type="file"
            onChange={handleBannerChange}
            accept="image/*"
            className="mt-1 block w-full"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Download Links</label>
          {formData.downloadLinks.map((link, index) => (
            <div key={index} className="grid grid-cols-3 gap-4 mb-4">
              <input
                type="text"
                placeholder="Quality (e.g., 720p)"
                value={link.quality}
                onChange={(e) => handleDownloadLinkChange(index, 'quality', e.target.value)}
                className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
              <input
                type="text"
                placeholder="Language"
                value={link.language}
                onChange={(e) => handleDownloadLinkChange(index, 'language', e.target.value)}
                className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
              <input
                type="text"
                placeholder="Google Drive Link"
                value={link.link}
                onChange={(e) => handleDownloadLinkChange(index, 'link', e.target.value)}
                className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
          ))}
          <button
            type="button"
            onClick={addDownloadLink}
            className="mt-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
          >
            Add Another Download Link
          </button>
        </div>

        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Add Movie
        </button>
      </form>
    </div>
  );
}

export default AddMovie