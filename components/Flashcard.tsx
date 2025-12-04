import React, { useState } from 'react';
import { RefreshCw, CheckCircle, HelpCircle } from 'lucide-react';
import { Word } from '../types';

interface FlashcardProps {
  word: Word;
  onRate: (quality: number) => void;
}

const Flashcard: React.FC<FlashcardProps> = ({ word, onRate }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  // Reset flip state when word changes
  React.useEffect(() => {
    setIsFlipped(false);
  }, [word]);

  return (
    <div className="w-full max-w-md mx-auto perspective-1000">
      <div 
        className={`relative w-full h-96 transition-transform duration-700 transform-style-3d cursor-pointer ${isFlipped ? 'rotate-y-180' : ''}`}
        onClick={() => !isFlipped && setIsFlipped(true)}
      >
        {/* Front */}
        <div className="absolute inset-0 backface-hidden bg-white rounded-3xl shadow-xl border border-gray-100 flex flex-col items-center justify-center p-8 text-center hover:shadow-2xl transition-shadow">
          <span className="text-sm text-indigo-500 font-bold uppercase tracking-wider mb-4">English</span>
          <h2 className="text-5xl font-bold text-slate-800 mb-4">{word.text}</h2>
          <span className="italic text-gray-400 text-lg font-serif">{word.pos}</span>
          <span className="text-gray-400 mt-2">{word.pronunciation}</span>
          
          <div className="absolute bottom-6 text-gray-400 text-sm flex items-center gap-2 animate-bounce">
             Tap to reveal <HelpCircle size={16} />
          </div>
        </div>

        {/* Back */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 bg-slate-900 rounded-3xl shadow-xl flex flex-col items-center justify-between p-8 text-center text-white">
          <div className="flex-1 flex flex-col items-center justify-center w-full">
            <span className="text-sm text-indigo-300 font-bold uppercase tracking-wider mb-2">Meaning</span>
            <h3 className="text-3xl font-bold mb-6 text-indigo-100">{word.translations.tr}</h3>
            
            <div className="bg-slate-800 p-4 rounded-xl w-full">
              <p className="text-sm text-slate-400 mb-2 font-mono text-left">Example:</p>
              <p className="text-lg italic">"{word.examples[0].en}"</p>
              <p className="text-sm text-slate-400 mt-1">{word.examples[0].tr}</p>
            </div>
          </div>

          <div className="w-full grid grid-cols-4 gap-2 mt-4">
             <button 
                onClick={(e) => { e.stopPropagation(); onRate(0); }}
                className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-red-500/20 text-red-400 transition"
             >
                <span className="font-bold">Again</span>
                <span className="text-xs opacity-70">&lt; 1 min</span>
             </button>
             <button 
                onClick={(e) => { e.stopPropagation(); onRate(3); }}
                className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-orange-500/20 text-orange-400 transition"
             >
                <span className="font-bold">Hard</span>
                <span className="text-xs opacity-70">2 days</span>
             </button>
             <button 
                onClick={(e) => { e.stopPropagation(); onRate(4); }}
                className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-green-500/20 text-green-400 transition"
             >
                <span className="font-bold">Good</span>
                <span className="text-xs opacity-70">4 days</span>
             </button>
             <button 
                onClick={(e) => { e.stopPropagation(); onRate(5); }}
                className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-blue-500/20 text-blue-400 transition"
             >
                <span className="font-bold">Easy</span>
                <span className="text-xs opacity-70">7 days</span>
             </button>
          </div>
        </div>
      </div>
      
      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .transform-style-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}</style>
    </div>
  );
};

export default Flashcard;
