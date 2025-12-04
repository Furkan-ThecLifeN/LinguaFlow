import React, { useState } from 'react';
import { Search, Filter, Plus, Volume2, X } from 'lucide-react';
import { Word } from '../types';
import { useData } from '../context/DataContext';

const Vocabulary: React.FC = () => {
  const { words, addWord } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWord, setSelectedWord] = useState<Word | null>(null);
  
  // Filtering state
  const [showFilters, setShowFilters] = useState(false);
  const [filterLevel, setFilterLevel] = useState<string>('All');
  const [filterPos, setFilterPos] = useState<string>('All');

  // Add Word Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newWord, setNewWord] = useState<Partial<Word>>({
    text: '',
    pos: 'noun',
    pronunciation: '',
    definition: '',
    difficulty: 'A1',
    translations: { tr: '' },
    examples: [{ id: '1', en: '', tr: '' }]
  });

  const filteredWords = words.filter(w => {
    const matchesSearch = w.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          w.translations.tr.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = filterLevel === 'All' || w.difficulty === filterLevel;
    const matchesPos = filterPos === 'All' || w.pos === filterPos;
    return matchesSearch && matchesLevel && matchesPos;
  });

  const handleAddWord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWord.text || !newWord.translations?.tr) return;

    const wordToAdd: Word = {
      id: Date.now().toString(),
      text: newWord.text || '',
      pos: (newWord.pos as any) || 'noun',
      pronunciation: newWord.pronunciation || '',
      definition: newWord.definition || '',
      difficulty: (newWord.difficulty as any) || 'A1',
      translations: { tr: newWord.translations?.tr || '' },
      examples: newWord.examples?.map(ex => ({ ...ex, id: Date.now().toString() + Math.random() })) || [],
      forms: { past: '', pastParticiple: '' }
    };

    addWord(wordToAdd);
    setIsAddModalOpen(false);
    // Reset form
    setNewWord({
      text: '',
      pos: 'noun',
      pronunciation: '',
      definition: '',
      difficulty: 'A1',
      translations: { tr: '' },
      examples: [{ id: '1', en: '', tr: '' }]
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
                type="text" 
                placeholder="Search words..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            </div>
            <div className="flex gap-2">
                <button 
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center gap-2 px-4 py-3 border border-gray-200 rounded-xl transition ${showFilters ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                >
                    <Filter size={20} />
                    <span>Filters</span>
                </button>
                <button 
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 shadow-md transition transform active:scale-95"
                >
                    <Plus size={20} />
                    <span>Add Word</span>
                </button>
            </div>
        </div>
        
        {/* Filter Panel */}
        {showFilters && (
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-wrap gap-4 animate-fade-in">
                <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">Difficulty</label>
                    <select 
                        value={filterLevel} 
                        onChange={e => setFilterLevel(e.target.value)}
                        className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="All">All Levels</option>
                        <option value="A1">A1 Beginner</option>
                        <option value="A2">A2 Elementary</option>
                        <option value="B1">B1 Intermediate</option>
                        <option value="B2">B2 Upper Int.</option>
                        <option value="C1">C1 Advanced</option>
                        <option value="C2">C2 Proficiency</option>
                    </select>
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">Part of Speech</label>
                    <select 
                        value={filterPos} 
                        onChange={e => setFilterPos(e.target.value)}
                        className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="All">All Types</option>
                        <option value="noun">Noun</option>
                        <option value="verb">Verb</option>
                        <option value="adjective">Adjective</option>
                        <option value="adverb">Adverb</option>
                        <option value="preposition">Preposition</option>
                    </select>
                </div>
                <button 
                    onClick={() => { setFilterLevel('All'); setFilterPos('All'); }}
                    className="self-end px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg"
                >
                    Reset
                </button>
            </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredWords.length > 0 ? (
            filteredWords.map(word => (
            <div 
                key={word.id} 
                onClick={() => setSelectedWord(word)}
                className="group bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg hover:border-indigo-100 transition-all cursor-pointer relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-indigo-50 p-2 rounded-full text-indigo-600">
                        <Volume2 size={18} />
                    </div>
                </div>
                <div className="mb-2">
                    <h3 className="text-2xl font-bold text-gray-800 group-hover:text-indigo-600 transition-colors">{word.text}</h3>
                    <span className="text-sm text-gray-400 italic font-serif">{word.pos} • {word.pronunciation}</span>
                </div>
                <p className="text-gray-600 mb-4 line-clamp-2">{word.definition}</p>
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                    <span className="text-sm font-medium text-gray-500">{word.translations.tr}</span>
                    <span className={`text-xs font-bold px-2 py-1 rounded uppercase ${
                        word.difficulty === 'C1' || word.difficulty === 'C2' ? 'bg-red-100 text-red-700' :
                        word.difficulty === 'B1' || word.difficulty === 'B2' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                    }`}>
                        {word.difficulty}
                    </span>
                </div>
            </div>
            ))
        ) : (
            <div className="col-span-full py-12 text-center text-gray-400">
                <p className="text-lg">No words found matching your filters.</p>
                <button onClick={() => { setFilterLevel('All'); setFilterPos('All'); setSearchTerm(''); }} className="mt-2 text-indigo-600 hover:underline">Clear Filters</button>
            </div>
        )}
      </div>

      {/* Add Word Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setIsAddModalOpen(false)}>
            <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-fade-in" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-800">Add New Word</h2>
                    <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                        <X size={24} />
                    </button>
                </div>
                <form onSubmit={handleAddWord} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">English Word *</label>
                            <input 
                                required
                                type="text" 
                                value={newWord.text}
                                onChange={e => setNewWord({...newWord, text: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                placeholder="e.g. Serendipity"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Turkish Translation *</label>
                            <input 
                                required
                                type="text" 
                                value={newWord.translations?.tr}
                                onChange={e => setNewWord({...newWord, translations: { tr: e.target.value }})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                placeholder="e.g. Tesadüf"
                            />
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Part of Speech</label>
                            <select 
                                value={newWord.pos}
                                onChange={e => setNewWord({...newWord, pos: e.target.value as any})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                            >
                                <option value="noun">Noun</option>
                                <option value="verb">Verb</option>
                                <option value="adjective">Adjective</option>
                                <option value="adverb">Adverb</option>
                                <option value="preposition">Preposition</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                            <select 
                                value={newWord.difficulty}
                                onChange={e => setNewWord({...newWord, difficulty: e.target.value as any})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                            >
                                <option value="A1">A1</option>
                                <option value="A2">A2</option>
                                <option value="B1">B1</option>
                                <option value="B2">B2</option>
                                <option value="C1">C1</option>
                                <option value="C2">C2</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Definition</label>
                        <textarea 
                            value={newWord.definition}
                            onChange={e => setNewWord({...newWord, definition: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none h-20"
                            placeholder="English definition..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Pronunciation</label>
                        <input 
                            type="text" 
                            value={newWord.pronunciation}
                            onChange={e => setNewWord({...newWord, pronunciation: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                            placeholder="/.../"
                        />
                    </div>

                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                        <h4 className="text-sm font-bold text-gray-600 mb-2">Example Sentence</h4>
                        <input 
                            type="text" 
                            placeholder="English sentence"
                            value={newWord.examples?.[0]?.en || ''}
                            onChange={e => {
                                const newEx = [...(newWord.examples || [])];
                                newEx[0] = { ...newEx[0], en: e.target.value };
                                setNewWord({...newWord, examples: newEx});
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none mb-2 text-sm"
                        />
                        <input 
                            type="text" 
                            placeholder="Turkish translation"
                            value={newWord.examples?.[0]?.tr || ''}
                            onChange={e => {
                                const newEx = [...(newWord.examples || [])];
                                newEx[0] = { ...newEx[0], tr: e.target.value };
                                setNewWord({...newWord, examples: newEx});
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
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
                            className="px-5 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 shadow-md"
                        >
                            Save Word
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}

      {/* Word Detail Modal */}
      {selectedWord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={() => setSelectedWord(null)}>
           <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 shadow-2xl animate-fade-in" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-4xl font-bold text-gray-900 mb-2">{selectedWord.text}</h2>
                    <div className="flex items-center gap-3">
                        <span className="bg-gray-100 px-2 py-1 rounded text-sm font-medium text-gray-600">{selectedWord.pos}</span>
                        <span className="text-gray-500">{selectedWord.pronunciation}</span>
                        <button className="text-indigo-600 hover:bg-indigo-50 p-1.5 rounded-full">
                            <Volume2 size={20} />
                        </button>
                    </div>
                  </div>
                  <button onClick={() => setSelectedWord(null)} className="text-gray-400 hover:bg-gray-100 p-2 rounded-full">
                      <Plus className="rotate-45" size={24} />
                  </button>
              </div>

              <div className="space-y-6">
                 <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                    <h4 className="text-sm font-bold text-indigo-900 uppercase mb-1">Translation</h4>
                    <p className="text-xl text-indigo-700 font-medium">{selectedWord.translations.tr}</p>
                 </div>

                 <div>
                    <h4 className="text-gray-900 font-bold mb-2">Definition</h4>
                    <p className="text-gray-600 leading-relaxed">{selectedWord.definition}</p>
                 </div>

                 {selectedWord.forms && (selectedWord.forms.past || selectedWord.forms.pastParticiple) && (
                     <div className="grid grid-cols-2 gap-4">
                        {selectedWord.forms.past && (
                            <div className="bg-gray-50 p-3 rounded-lg">
                                <span className="text-xs text-gray-500 uppercase">Past</span>
                                <p className="font-medium">{selectedWord.forms.past}</p>
                            </div>
                        )}
                        {selectedWord.forms.pastParticiple && (
                            <div className="bg-gray-50 p-3 rounded-lg">
                                <span className="text-xs text-gray-500 uppercase">Participle</span>
                                <p className="font-medium">{selectedWord.forms.pastParticiple}</p>
                            </div>
                        )}
                     </div>
                 )}

                 <div>
                    <h4 className="text-gray-900 font-bold mb-3">Examples</h4>
                    <ul className="space-y-3">
                        {selectedWord.examples.map(ex => (
                            <li key={ex.id} className="border-l-2 border-indigo-200 pl-4">
                                <p className="text-gray-800 mb-1">{ex.en}</p>
                                <p className="text-gray-500 text-sm">{ex.tr}</p>
                            </li>
                        ))}
                    </ul>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Vocabulary;