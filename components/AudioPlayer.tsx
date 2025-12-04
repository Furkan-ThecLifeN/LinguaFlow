
import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Repeat, Volume2 } from 'lucide-react';
import { Song } from '../types';

interface AudioPlayerProps {
  song: Song;
  onWordClick: (word: string) => void;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ song, onWordClick }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [activeLineId, setActiveLineId] = useState<string | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const onEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', onEnded);
    };
  }, [song]);

  // Sync lyrics
  useEffect(() => {
    const currentLine = song.lyrics.find(
      (line) => currentTime >= line.startSec && currentTime < line.endSec
    );
    if (currentLine && currentLine.id !== activeLineId) {
      setActiveLineId(currentLine.id);
      const el = document.getElementById(`lyric-${currentLine.id}`);
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [currentTime, song.lyrics, activeLineId]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row max-h-[600px]">
      <audio ref={audioRef} src={song.audioUrl} autoPlay />

      {/* Left Panel: Cover & Controls */}
      <div className="md:w-1/3 bg-slate-900 text-white p-6 flex flex-col justify-between relative">
        <div className="absolute top-0 right-0 p-6 opacity-20">
          <HeadphonesIcon size={120} />
        </div>
        
        <div className="z-10 text-center md:text-left">
          <div className="w-48 h-48 mx-auto md:mx-0 rounded-xl overflow-hidden shadow-2xl mb-6 border-4 border-slate-700">
             <img src={song.coverUrl} alt={song.title} className="w-full h-full object-cover" />
          </div>
          <h2 className="text-2xl font-bold mb-1">{song.title}</h2>
          <p className="text-slate-400 text-lg">{song.artist}</p>
        </div>

        <div className="z-10 mt-8 space-y-4">
          <div className="w-full">
            <input
              type="range"
              min={0}
              max={duration || 0}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          <div className="flex items-center justify-between md:justify-start gap-6">
            <button className="text-slate-400 hover:text-white transition"><Repeat size={20} /></button>
            <button className="text-slate-400 hover:text-white transition"><SkipBack size={24} /></button>
            <button 
              onClick={togglePlay}
              className="w-14 h-14 bg-indigo-500 hover:bg-indigo-600 rounded-full flex items-center justify-center shadow-lg shadow-indigo-500/30 transition transform hover:scale-105"
            >
              {isPlaying ? <Pause fill="white" size={24} /> : <Play fill="white" className="ml-1" size={24} />}
            </button>
            <button className="text-slate-400 hover:text-white transition"><SkipForward size={24} /></button>
            <button className="text-slate-400 hover:text-white transition"><Volume2 size={20} /></button>
          </div>
        </div>
      </div>

      {/* Right Panel: Lyrics */}
      <div className="md:w-2/3 bg-gray-50 flex flex-col">
        <div className="p-4 border-b bg-white flex justify-between items-center shadow-sm z-10">
          <h3 className="font-semibold text-gray-700 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Sync Lyrics
          </h3>
          {/* Removed translation hint as requested */}
        </div>
        
        <div className="flex-1 overflow-y-auto p-8 space-y-6 text-center md:text-left scroll-smooth">
          {song.lyrics.length > 0 ? (
            song.lyrics.map((line) => (
              <div
                key={line.id}
                id={`lyric-${line.id}`}
                className={`transition-all duration-500 p-4 rounded-xl cursor-pointer ${
                  activeLineId === line.id
                    ? 'bg-white shadow-lg scale-105 border-l-4 border-indigo-500'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
                onClick={() => {
                  if(audioRef.current) {
                     audioRef.current.currentTime = line.startSec;
                     setCurrentTime(line.startSec);
                  }
                }}
              >
                <p className={`text-lg md:text-xl font-medium leading-relaxed ${activeLineId === line.id ? 'text-gray-800' : ''}`}>
                  {line.text}
                </p>
              </div>
            ))
          ) : (
             <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <p>No synced lyrics available.</p>
                <p className="text-sm">Enjoy the music!</p>
             </div>
          )}
          <div className="h-24"></div> {/* Bottom spacer */}
        </div>
      </div>
    </div>
  );
};

const HeadphonesIcon: React.FC<{size: number}> = ({size}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-headphones"><path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"/></svg>
)

export default AudioPlayer;
