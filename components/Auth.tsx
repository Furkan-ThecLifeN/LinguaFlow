
import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';

const Auth: React.FC = () => {
  const { login, register } = useData();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      const success = login(formData.email, formData.password);
      if (!success) setError('Invalid email or password.');
    } else {
      if (!formData.name || !formData.email || !formData.password) {
        setError('All fields are required.');
        return;
      }
      const success = register(formData.name, formData.email, formData.password);
      if (!success) setError('Email already exists.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 font-sans">
      <div className="bg-white rounded-3xl shadow-2xl flex overflow-hidden w-full max-w-4xl min-h-[600px] animate-fade-in">
        
        {/* Left Side - Hero */}
        <div className="hidden md:flex flex-col justify-between w-1/2 bg-indigo-600 p-12 text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
             {/* Decorative circles */}
             <div className="absolute top-[-50px] left-[-50px] w-64 h-64 rounded-full bg-white"></div>
             <div className="absolute bottom-[-50px] right-[-50px] w-80 h-80 rounded-full bg-white"></div>
          </div>

          <div className="z-10">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm mb-6">
               <span className="font-bold text-2xl">L</span>
            </div>
            <h1 className="text-4xl font-bold mb-4">LinguaFlow</h1>
            <p className="text-indigo-100 text-lg leading-relaxed">
              Master English naturally through spaced repetition, music lyrics, and interactive games.
            </p>
          </div>

          <div className="z-10">
            <div className="flex -space-x-4 mb-4">
               <img className="w-10 h-10 rounded-full border-2 border-indigo-600" src="https://i.pravatar.cc/100?img=1" alt="" />
               <img className="w-10 h-10 rounded-full border-2 border-indigo-600" src="https://i.pravatar.cc/100?img=2" alt="" />
               <img className="w-10 h-10 rounded-full border-2 border-indigo-600" src="https://i.pravatar.cc/100?img=3" alt="" />
               <div className="w-10 h-10 rounded-full border-2 border-indigo-600 bg-white text-indigo-600 flex items-center justify-center font-bold text-xs">+2k</div>
            </div>
            <p className="text-sm font-medium text-indigo-200">Join thousands of learners today.</p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 p-12 flex flex-col justify-center">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">{isLogin ? 'Welcome Back!' : 'Create Account'}</h2>
            <p className="text-gray-500">
              {isLogin ? 'Please enter your details to sign in.' : 'Start your language journey now.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 ml-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
                    placeholder="John Doe"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 ml-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input 
                  type="password" 
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                {error}
              </div>
            )}

            <button 
              type="submit" 
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-indigo-200 transition transform active:scale-95 flex items-center justify-center gap-2"
            >
              {isLogin ? 'Sign In' : 'Sign Up'} <ArrowRight size={20} />
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-500 text-sm">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button 
                onClick={() => { setIsLogin(!isLogin); setError(''); }}
                className="text-indigo-600 font-bold hover:underline"
              >
                {isLogin ? 'Register' : 'Login'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
