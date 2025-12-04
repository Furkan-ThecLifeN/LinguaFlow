
import React, { useState } from 'react';
import AudioPlayer from '../components/AudioPlayer';
import { Song, LyricLine } from '../types';
import { PlayCircle, Clock, Music, Plus, X, UploadCloud } from 'lucide-react';
import { useData } from '../context/DataContext';

const Listening: React.FC = () => {
  const { songs, addSong, updateStats, user } = useData();
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  
  // Add Song Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newSongData, setNewSongData] = useState({
    title: '',
    artist: '',
    coverUrl: '',
    audioUrl: '',
    lyricsText: '' // Raw text input for lyrics
  });

  const handleSongStart = (song: Song) => {
    setCurrentSong(song);
    updateStats('songsListened', user.stats.songsListened + 1);
  };

  const handleAddSong = (e: React.FormEvent) => {
    e.preventDefault();

    // Parse Lyrics
    // Expected format: [00:12] Lyric text here
    const lyrics: LyricLine[] = newSongData.lyricsText.split('\n').map((line, index, array) => {
      const timeMatch = line.match(/\[(\d{2}):(\d{2})\](.*)/);
      if (timeMatch) {
        const minutes = parseInt(timeMatch[1]);
        const seconds = parseInt(timeMatch[2]);
        const text = timeMatch[3].trim();
        const startSec = minutes * 60 + seconds;
        
        // Try to estimate endSec based on next line or +4 seconds default
        let endSec = startSec + 4;
        
        return {
          id: `l-${Date.now()}-${index}`,
          startSec,
          endSec,
          text
        };
      }
      return null;
    }).filter(l => l !== null) as LyricLine[];

    // Fix end times based on next start times
    for(let i=0; i<lyrics.length - 1; i++) {
        lyrics[i].endSec = lyrics[i+1].startSec;
    }

    const songToAdd: Song = {
      id: Date.now().toString(),
      title: newSongData.title,
      artist: newSongData.artist,
      coverUrl: newSongData.coverUrl || 'https://picsum.photos/200/200',
      audioUrl: newSongData.audioUrl,
      lyrics: lyrics
    };

    addSong(songToAdd);
    setIsAddModalOpen(false);
    setNewSongData({ title: '', artist: '', coverUrl: '', audioUrl: '', lyricsText: '' });
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
        {/* Passed empty function for onWordClick as per user request to remove translation */}
        <AudioPlayer song={currentSong} onWordClick={() => {}} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-end mb-4">
           <div>
               <h2 className="text-3xl font-bold text-gray-800">Listening Practice</h2>
               <p className="text-gray-500">Master pronunciation with synchronized lyrics</p>
           </div>
           <button 
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 shadow-md transition"
            >
                <Plus size={20} />
                <span>Add Song</span>
            </button>
       </div>

       <div className="bg-gradient-to-r from-pink-500 to-rose-500 rounded-3xl p-8 text-white shadow-xl mb-8 relative overflow-hidden">
           <div className="relative z-10">
                <h2 className="text-2xl font-bold mb-2">Karaoke Mode</h2>
                <p className="opacity-90 max-w-lg">
                    Sing along and improve your flow. Upload your own songs and lyrics to customize your learning journey.
                </p>
           </div>
           <Music className="absolute right-[-20px] bottom-[-40px] text-white opacity-20" size={200} />
       </div>

       <h3 className="font-bold text-xl text-gray-800 mb-4 flex items-center gap-2">
           <Music size={24} className="text-indigo-500" />
           Your Library
       </h3>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {songs.map(song => (
            <div 
                key={song.id} 
                onClick={() => handleSongStart(song)}
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
                        <span className="flex items-center gap-1"><Clock size={14} /> --:--</span>
                        <span className="px-2 py-0.5 bg-gray-100 rounded text-gray-500 font-medium">{song.lyrics.length > 0 ? 'Synced' : 'Audio Only'}</span>
                    </div>
                </div>
            </div>
          ))}
       </div>

       {/* Add Song Modal */}
       {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setIsAddModalOpen(false)}>
            <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-fade-in" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-800">Add New Song</h2>
                    <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                        <X size={24} />
                    </button>
                </div>
                <form onSubmit={handleAddSong} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Song Title</label>
                        <input 
                            required
                            type="text" 
                            value={newSongData.title}
                            onChange={e => setNewSongData({...newSongData, title: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                            placeholder="e.g. Shape of You"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Artist</label>
                        <input 
                            required
                            type="text" 
                            value={newSongData.artist}
                            onChange={e => setNewSongData({...newSongData, artist: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                            placeholder="e.g. Ed Sheeran"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Audio URL (MP3)</label>
                        <input 
                            required
                            type="url" 
                            value={newSongData.audioUrl}
                            onChange={e => setNewSongData({...newSongData, audioUrl: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                            placeholder="https://example.com/song.mp3"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image URL</label>
                        <input 
                            type="url" 
                            value={newSongData.coverUrl}
                            onChange={e => setNewSongData({...newSongData, coverUrl: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                            placeholder="https://example.com/image.jpg"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Lyrics with Timestamps 
                            <span className="text-gray-400 font-normal ml-2 text-xs">(Format: [mm:ss] Lyrics)</span>
                        </label>
                        <textarea 
                            required
                            value={newSongData.lyricsText}
                            onChange={e => setNewSongData({...newSongData, lyricsText: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none font-mono text-sm h-32"
                            placeholder={'[00:10] First line of lyrics\n[00:15] Second line of lyrics'}
                        />
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <button 
                            type="button" 
                            onClick={() => setIsAddModalOpen(false)}
                            className="px-5 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit"
                            className="px-5 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 shadow-md flex items-center gap-2"
                        >
                            <UploadCloud size={18} />
                            Save Song
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};

export default Listening;
