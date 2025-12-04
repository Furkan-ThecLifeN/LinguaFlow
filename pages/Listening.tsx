import React, { useState } from 'react';
import AudioPlayer from '../components/AudioPlayer';
import { MOCK_SONGS } from '../constants';
import { Song } from '../types';
import { PlayCircle, Clock, Music } from 'lucide-react';

const Listening: React.FC = () => {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [showTranslateModal, setShowTranslateModal] = useState<string | null>(null);

  const handleWordClick = (word: string) => {
     setShowTranslateModal(word);
  };

  if (currentSong) {
    return (
      <div className="animate-fade-in">
        <button 
          onClick={() => setCurrentSong(null)} 
          className="mb-6 text-gray-500 hover:text-indigo-600 flex items-center gap-2 font-medium"
        >
          ← Back to Library
        </button>
        <AudioPlayer song={currentSong} onWordClick={handleWordClick} />
        
        {/* Mock Translation Modal */}
        {showTranslateModal && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/20" onClick={() => setShowTranslateModal(null)}>
                <div className="bg-white p-6 rounded-xl shadow-2xl max-w-sm w-full" onClick={e => e.stopPropagation()}>
                    <h3 className="text-xl font-bold text-gray-800 mb-1 capitalize">{showTranslateModal}</h3>
                    <p className="text-gray-500 italic mb-4">/pronunciation/</p>
                    <hr className="mb-4" />
                    <p className="text-gray-600 mb-6">
                        This is a simulated definition for the word <strong className="text-indigo-600">"{showTranslateModal}"</strong> fetched from the dictionary API.
                    </p>
                    <button 
                        onClick={() => setShowTranslateModal(null)}
                        className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
                    >
                        Add to Flashcards
                    </button>
                </div>
            </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
       <div className="bg-gradient-to-r from-pink-500 to-rose-500 rounded-3xl p-8 text-white shadow-xl mb-8">
           <h2 className="text-3xl font-bold mb-2">Learn with Music</h2>
           <p className="opacity-90 max-w-lg">
             Improve your listening skills by following synchronized lyrics. 
             Click on any word you don't know to instantly see its meaning.
           </p>
       </div>

       <h3 className="font-bold text-xl text-gray-800 mb-4 flex items-center gap-2">
           <Music size={24} className="text-indigo-500" />
           Recommended Songs
       </h3>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_SONGS.map(song => (
            <div 
                key={song.id} 
                onClick={() => setCurrentSong(song)}
                className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group"
            >
                <div className="relative h-48 overflow-hidden">
                    <img src={song.coverUrl} alt={song.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px]">
                        <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm border border-white/50">
                            <PlayCircle size={40} className="text-white" />
                        </div>
                    </div>
                </div>
                <div className="p-5">
                    <h4 className="font-bold text-lg text-gray-900 mb-1">{song.title}</h4>
                    <p className="text-gray-500 text-sm mb-4">{song.artist}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                        <span className="flex items-center gap-1"><Clock size={14} /> 3:42</span>
                        <span className="px-2 py-0.5 bg-gray-100 rounded text-gray-500 font-medium">B1 Intermediate</span>
                    </div>
                </div>
            </div>
          ))}
       </div>
    </div>
  );
};

export default Listening;
