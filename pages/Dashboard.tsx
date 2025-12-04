import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowRight, Trophy, Flame, Target } from 'lucide-react';
import { useData } from '../context/DataContext';

const data = [
  { name: 'Mon', words: 4 },
  { name: 'Tue', words: 7 },
  { name: 'Wed', words: 5 },
  { name: 'Thu', words: 12 },
  { name: 'Fri', words: 9 },
  { name: 'Sat', words: 15 },
  { name: 'Sun', words: 8 },
];

interface DashboardProps {
    onNavigate: (page: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { words, user } = useData();

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h2 className="text-2xl font-bold text-gray-800">Welcome back, {user.name}!</h2>
           <p className="text-gray-500">You have {words.length > 5 ? 12 : 2} words to review today.</p>
        </div>
        <button 
            onClick={() => onNavigate('games')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl shadow-lg shadow-indigo-200 flex items-center gap-2 transition transform hover:-translate-y-0.5"
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
                <h4 className="text-2xl font-bold text-gray-800">12 Days</h4>
            </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                <Target size={24} />
            </div>
            <div>
                <p className="text-gray-500 text-sm">Total Words Learned</p>
                <h4 className="text-2xl font-bold text-gray-800">{words.length}</h4>
            </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-yellow-100 text-yellow-600 rounded-xl">
                <Trophy size={24} />
            </div>
            <div>
                <p className="text-gray-500 text-sm">Accuracy Rate</p>
                <h4 className="text-2xl font-bold text-gray-800">94%</h4>
            </div>
        </div>
      </div>

      {/* Main Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-gray-800">Learning Activity</h3>
                <select className="bg-gray-50 border-none text-sm text-gray-500 rounded-lg p-2 outline-none">
                    <option>Last 7 Days</option>
                    <option>Last 30 Days</option>
                </select>
            </div>
            <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
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
            </div>
         </div>
      </div>
    </div>
  );
};

export default Dashboard;