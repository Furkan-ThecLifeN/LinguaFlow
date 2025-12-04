import React, { useState } from 'react';
import Flashcard from '../components/Flashcard';
import { MOCK_PROGRESS } from '../constants';
import { calculateSM2 } from '../services/srsService';
import { Layers, Check, Edit3 } from 'lucide-react';
import { useData } from '../context/DataContext';

const Games: React.FC = () => {
  const { words } = useData();
  const [activeTab, setActiveTab] = useState<'flashcard' | 'sentence'>('flashcard');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [complete, setComplete] = useState(false);
  
  // Sentence Practice State
  const [sentenceInput, setSentenceInput] = useState('');
  const [feedback, setFeedback] = useState<{status: 'success'|'error'|null, msg: string}>({status: null, msg: ''});

  // Filter words that are due or new (mock logic: essentially pick first few for demo)
  // In a real app, this would filter based on 'nextReviewDate' from progress data joined with 'words'
  const dueWords = words.length > 0 ? words.slice(0, 5) : [];

  const handleRate = (quality: number) => {
    // In a real app, update DB via API
    const word = dueWords[currentIndex];
    const existingProgress = MOCK_PROGRESS.find(p => p.wordId === word.id);
    const newProgress = calculateSM2(existingProgress, quality);
    console.log('New SRS Stats:', newProgress);

    if (currentIndex < dueWords.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setComplete(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setComplete(false);
  };

  const checkSentence = () => {
     // Simple mock validation logic
     if (sentenceInput.length < 5) {
        setFeedback({status: 'error', msg: 'Sentence is too short.'});
        return;
     }
     // Case insensitive check
     if (dueWords.length > 0 && !sentenceInput.toLowerCase().includes(dueWords[0].text.toLowerCase())) { 
         setFeedback({status: 'error', msg: `Try to include the word "${dueWords[0].text}"`});
         return;
     }
     setFeedback({status: 'success', msg: 'Great job! Grammatically correct.'});
  };

  return (
    <div className="max-w-3xl mx-auto">
       <div className="flex justify-center mb-8 bg-gray-100 p-1 rounded-xl inline-flex w-full md:w-auto">
           <button 
             onClick={() => setActiveTab('flashcard')}
             className={`flex items-center gap-2 px-6 py-2 rounded-lg transition-all ${activeTab === 'flashcard' ? 'bg-white shadow text-indigo-600 font-bold' : 'text-gray-500 hover:text-gray-700'}`}
           >
               <Layers size={18} /> Flashcards
           </button>
           <button 
             onClick={() => setActiveTab('sentence')}
             className={`flex items-center gap-2 px-6 py-2 rounded-lg transition-all ${activeTab === 'sentence' ? 'bg-white shadow text-indigo-600 font-bold' : 'text-gray-500 hover:text-gray-700'}`}
           >
               <Edit3 size={18} /> Sentence Builder
           </button>
       </div>

       <div className="min-h-[500px]">
           {activeTab === 'flashcard' && (
             <>
                {!complete && dueWords.length > 0 ? (
                    <div className="space-y-4">
                        <div className="text-center text-gray-400 mb-4">
                            Card {currentIndex + 1} of {dueWords.length}
                        </div>
                        <Flashcard word={dueWords[currentIndex]} onRate={handleRate} />
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Check size={40} className="text-green-600" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">All Done!</h2>
                        <p className="text-gray-500">You've reviewed all your cards for today.</p>
                        <button onClick={handleRestart} className="mt-8 text-indigo-600 font-semibold hover:underline">
                            Review Again (Demo)
                        </button>
                    </div>
                )}
             </>
           )}

           {activeTab === 'sentence' && (
               <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                   <h3 className="text-xl font-bold text-gray-800 mb-6">Write a Sentence</h3>
                   {dueWords.length > 0 ? (
                    <>
                       <div className="mb-6">
                           <span className="text-gray-500 text-sm">Target Word:</span>
                           <div className="text-2xl font-bold text-indigo-600">{dueWords[0]?.text || 'Ephemeral'}</div>
                           <p className="text-gray-400 italic text-sm mt-1">{dueWords[0]?.definition || 'Lasting for a very short time.'}</p>
                       </div>

                       <textarea 
                          value={sentenceInput}
                          onChange={(e) => setSentenceInput(e.target.value)}
                          placeholder="Type a sentence using the target word..."
                          className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none h-32 resize-none text-lg"
                       />
                       
                       {feedback.status && (
                           <div className={`mt-4 p-4 rounded-xl flex items-center gap-3 ${feedback.status === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                               {feedback.status === 'success' ? <Check size={20} /> : <div className="font-bold">!</div>}
                               {feedback.msg}
                           </div>
                       )}

                       <div className="mt-6 flex justify-end">
                           <button 
                             onClick={checkSentence}
                             className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition"
                           >
                               Check Sentence
                           </button>
                       </div>
                    </>
                   ) : (
                     <p className="text-gray-500 text-center py-10">No words found in your vocabulary. Add some words first!</p>
                   )}
               </div>
           )}
       </div>
    </div>
  );
};

export default Games;