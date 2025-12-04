import React, { createContext, useContext, useState, useEffect } from 'react';
import { Word, UserProfile } from '../types';
import { MOCK_WORDS } from '../constants';

interface DataContextType {
  words: Word[];
  addWord: (word: Word) => void;
  user: UserProfile;
  updateUser: (user: Partial<UserProfile>) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize words from localStorage or use Mock data
  const [words, setWords] = useState<Word[]>(() => {
    try {
      const saved = localStorage.getItem('lingua_words');
      return saved ? JSON.parse(saved) : MOCK_WORDS;
    } catch (e) {
      console.error("Failed to load words from storage", e);
      return MOCK_WORDS;
    }
  });

  // Initialize user from localStorage or default
  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('lingua_user');
      return saved ? JSON.parse(saved) : {
        name: 'Student',
        email: 'student@example.com',
        avatarUrl: 'https://picsum.photos/100/100'
      };
    } catch (e) {
      return {
        name: 'Student',
        email: 'student@example.com',
        avatarUrl: 'https://picsum.photos/100/100'
      };
    }
  });

  // Persist words on change
  useEffect(() => {
    localStorage.setItem('lingua_words', JSON.stringify(words));
  }, [words]);

  // Persist user on change
  useEffect(() => {
    localStorage.setItem('lingua_user', JSON.stringify(user));
  }, [user]);

  const addWord = (newWord: Word) => {
    setWords(prev => [newWord, ...prev]);
  };

  const updateUser = (updates: Partial<UserProfile>) => {
    setUser(prev => ({ ...prev, ...updates }));
  };

  return (
    <DataContext.Provider value={{ words, addWord, user, updateUser }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within DataProvider');
  return context;
};