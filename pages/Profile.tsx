import React, { useState } from 'react';
import { User, Mail, Lock, Camera, Check, Save } from 'lucide-react';
import { useData } from '../context/DataContext';

const Profile: React.FC = () => {
  const { user, updateUser } = useData();
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    password: '',
    confirmPassword: ''
  });
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password && formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    
    updateUser({
      name: formData.name,
      email: formData.email
    });
    
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-8 items-center md:items-start">
        {/* Avatar Section */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative group cursor-pointer">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-indigo-50 shadow-lg">
              <img src={user.avatarUrl} alt="Profile" className="w-full h-full object-cover" />
            </div>
            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
               <Camera className="text-white" size={32} />
            </div>
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
            <p className="text-gray-500">Free Account</p>
          </div>
        </div>

        {/* Form Section */}
        <div className="flex-1 w-full">
          <div className="flex justify-between items-center mb-6">
             <h3 className="text-xl font-bold text-gray-800">Account Settings</h3>
             <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase">Active</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                   <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <User size={16} /> Full Name
                   </label>
                   <input 
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
                   />
                </div>
                <div className="space-y-2">
                   <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Mail size={16} /> Email Address
                   </label>
                   <input 
                      type="email" 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
                   />
                </div>
             </div>

             <div className="border-t border-gray-100 pt-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Security</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <Lock size={16} /> New Password
                      </label>
                      <input 
                          type="password" 
                          placeholder="••••••••"
                          value={formData.password}
                          onChange={(e) => setFormData({...formData, password: e.target.value})}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <Lock size={16} /> Confirm Password
                      </label>
                      <input 
                          type="password" 
                          placeholder="••••••••"
                          value={formData.confirmPassword}
                          onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
                      />
                    </div>
                </div>
             </div>

             <div className="flex justify-end pt-4">
                <button 
                  type="submit" 
                  className={`flex items-center gap-2 px-8 py-3 rounded-xl text-white font-bold transition-all shadow-lg hover:shadow-xl ${
                    isSaved ? 'bg-green-600 hover:bg-green-700' : 'bg-indigo-600 hover:bg-indigo-700'
                  }`}
                >
                    {isSaved ? <Check size={20} /> : <Save size={20} />}
                    {isSaved ? 'Changes Saved' : 'Save Changes'}
                </button>
             </div>
          </form>
        </div>
      </div>
      
      {/* Danger Zone */}
      <div className="bg-red-50 rounded-3xl p-8 border border-red-100 opacity-80 hover:opacity-100 transition">
          <h3 className="text-lg font-bold text-red-700 mb-2">Danger Zone</h3>
          <div className="flex justify-between items-center">
              <p className="text-red-600/80 text-sm">Once you delete your account, there is no going back. Please be certain.</p>
              <button className="px-4 py-2 bg-white border border-red-200 text-red-600 font-medium rounded-lg hover:bg-red-100 transition">
                  Delete Account
              </button>
          </div>
      </div>
    </div>
  );
};

export default Profile;