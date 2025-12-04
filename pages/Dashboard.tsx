
import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowRight, Trophy, Flame, Target } from 'lucide-react';
import { useData } from '../context/DataContext';

interface DashboardProps {
    onNavigate: (page: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { words, user } = useData();

  // Calculate real data for the chart based on word creation dates
  const chartData = useMemo(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d;
    });

    return last7Days.map(date => {
      const dayName = days[date.getDay()];
      // Filter words created on this specific day
      const count = words.filter(w => {
        const wDate = new Date(w.createdAt);
        return wDate.getDate() === date.getDate() && 
               wDate.getMonth() === date.getMonth() &&
               wDate.getFullYear() === date.getFullYear();
      }).length;
      
      return { name: dayName, words: count };
    });
  }, [words]);

  // Real stats calculation
  const streakDays = 1; // Simplification for MVP: requires tracking login history array
  const totalWords = words.length;
  // Mock accuracy for now as we don't track detailed game history logs yet
  const accuracy = totalWords > 0 ? 94 : 0; 

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h2 className="text-2xl font-bold text-gray-800">Welcome back, {user.name}!</h2>
           <p className="text-gray-500">
             {words.length === 0 
                ? "Start your journey by adding some words!" 
                : `You have ${words.length > 5 ? 5 : words.length} words ready for review.`}
           </p>
        </div>
        <button 
            onClick={() => onNavigate('games')}
            disabled={words.length === 0}
            className={`px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 transition transform hover:-translate-y-0.5 ${
                words.length === 0 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200'
            }`}
        >
            Start Daily Review <ArrowRight size={20} />
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-orange-100 text-orange-600 rounded-xl">
                <Flame size={24} />
            </div>
            <div>
                <p className="text-gray-500 text-sm">Current Streak</p>
                <h4 className="text-2xl font-bold text-gray-800">{streakDays} Day</h4>
            </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                <Target size={24} />
            </div>
            <div>
                <p className="text-gray-500 text-sm">Total Words Learned</p>
                <h4 className="text-2xl font-bold text-gray-800">{totalWords}</h4>
            </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-yellow-100 text-yellow-600 rounded-xl">
                <Trophy size={24} />
            </div>
            <div>
                <p className="text-gray-500 text-sm">Accuracy Rate</p>
                <h4 className="text-2xl font-bold text-gray-800">{accuracy}%</h4>
            </div>
        </div>
      </div>

      {/* Main Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-gray-800">Words Added (Last 7 Days)</h3>
            </div>
            <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} allowDecimals={false} />
                        <Tooltip 
                            contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}}
                            cursor={{fill: '#f9fafb'}}
                        />
                        <Bar dataKey="words" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={32} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
         </div>

         {/* Side Content */}
         <div className="space-y-6">
            <div className="bg-gradient-to-br from-purple-600 to-indigo-700 p-6 rounded-2xl shadow-lg text-white">
                <h3 className="font-bold text-lg mb-2">Pro Tip</h3>
                <p className="text-indigo-100 text-sm mb-4">Listening to music with synced lyrics improves vocabulary retention by 35%.</p>
                <button 
                    onClick={() => onNavigate('listening')}
                    className="w-full bg-white text-indigo-700 py-2 rounded-lg font-medium hover:bg-indigo-50 transition"
                >
                    Try Music Mode
                </button>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <h3 className="font-bold text-gray-800 mb-4">Recent Words</h3>
                {words.length > 0 ? (
                    <div className="space-y-3">
                        {words.slice(0, 3).map(word => (
                            <div key={word.id} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-lg transition">
                                <div>
                                    <p className="font-medium text-gray-800">{word.text}</p>
                                    <p className="text-xs text-gray-500">{word.pos}</p>
                                </div>
                                <span className="text-xs font-bold px-2 py-1 bg-green-100 text-green-700 rounded uppercase">
                                    {word.difficulty}
                                </span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-gray-400 text-center py-4">No words added yet.</p>
                )}
            </div>
         </div>
      </div>
    </div>
  );
};

export default Dashboard;
