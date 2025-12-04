
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Word, UserProfile, Song, UserStats } from '../types';

interface DataContextType {
  isAuthenticated: boolean;
  login: (email: string, pass: string) => boolean;
  register: (name: string, email: string, pass: string) => boolean;
  logout: () => void;
  
  words: Word[];
  addWord: (word: Word) => void;
  songs: Song[];
  addSong: (song: Song) => void;
  user: UserProfile;
  updateUser: (user: Partial<UserProfile>) => void;
  updateStats: (stat: keyof UserStats, value: number) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Helper to get initial user state
const getInitialUser = (): UserProfile => ({
  id: '',
  name: '',
  email: '',
  avatarUrl: 'https://picsum.photos/100/100',
  stats: {
    totalStudyTimeMinutes: 0,
    wordsLearned: 0,
    songsListened: 0,
    lastLoginDate: new Date().toISOString()
  }
});

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserProfile>(getInitialUser());
  const [words, setWords] = useState<Word[]>([]);
  const [songs, setSongs] = useState<Song[]>([]);

  // Check for active session on mount
  useEffect(() => {
    const sessionUserId = localStorage.getItem('lingua_session_user');
    if (sessionUserId) {
      loadUserData(sessionUserId);
    }
  }, []);

  // --- DATA LOADING LOGIC ---
  const loadUserData = (userId: string) => {
    try {
      // 1. Load User Profile JSON
      const usersJson = localStorage.getItem('lingua_users');
      const users: UserProfile[] = usersJson ? JSON.parse(usersJson) : [];
      const foundUser = users.find(u => u.id === userId);

      if (foundUser) {
        setUser(foundUser);
        setIsAuthenticated(true);
        localStorage.setItem('lingua_session_user', userId);

        // 2. Load Content JSON specific to this user
        const userDataJson = localStorage.getItem(`lingua_data_${userId}`);
        if (userDataJson) {
          const data = JSON.parse(userDataJson);
          setWords(data.words || []);
          setSongs(data.songs || []);
        } else {
          setWords([]);
          setSongs([]);
        }
      }
    } catch (e) {
      console.error("Failed to load user data", e);
      logout();
    }
  };

  // --- PERSISTENCE LOGIC ---
  // Save content (words/songs) whenever they change, specifically for the current user
  useEffect(() => {
    if (isAuthenticated && user.id) {
      const dataToSave = { words, songs };
      localStorage.setItem(`lingua_data_${user.id}`, JSON.stringify(dataToSave));
    }
  }, [words, songs, isAuthenticated, user.id]);

  // Save user profile changes (stats, name, etc)
  useEffect(() => {
    if (isAuthenticated && user.id) {
      const usersJson = localStorage.getItem('lingua_users');
      let users: UserProfile[] = usersJson ? JSON.parse(usersJson) : [];
      
      const index = users.findIndex(u => u.id === user.id);
      if (index !== -1) {
        users[index] = user;
        localStorage.setItem('lingua_users', JSON.stringify(users));
      }
    }
  }, [user, isAuthenticated]);

  // --- AUTH ACTIONS ---

  const login = (email: string, pass: string): boolean => {
    const usersJson = localStorage.getItem('lingua_users');
    const users: UserProfile[] = usersJson ? JSON.parse(usersJson) : [];
    
    const foundUser = users.find(u => u.email === email && u.password === pass);
    
    if (foundUser) {
      // Update last login
      const updatedUser = {
        ...foundUser,
        stats: { ...foundUser.stats, lastLoginDate: new Date().toISOString() }
      };
      // Save the login date update immediately
      const userIndex = users.findIndex(u => u.id === foundUser.id);
      users[userIndex] = updatedUser;
      localStorage.setItem('lingua_users', JSON.stringify(users));

      loadUserData(foundUser.id);
      return true;
    }
    return false;
  };

  const register = (name: string, email: string, pass: string): boolean => {
    const usersJson = localStorage.getItem('lingua_users');
    const users: UserProfile[] = usersJson ? JSON.parse(usersJson) : [];

    if (users.find(u => u.email === email)) {
      return false; // Email exists
    }

    const newUser: UserProfile = {
      id: Date.now().toString(),
      name,
      email,
      password: pass,
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`, // Generate random avatar based on name
      stats: {
        totalStudyTimeMinutes: 0,
        wordsLearned: 0,
        songsListened: 0,
        lastLoginDate: new Date().toISOString()
      }
    };

    users.push(newUser);
    localStorage.setItem('lingua_users', JSON.stringify(users));
    
    // Auto login after register
    loadUserData(newUser.id);
    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(getInitialUser());
    setWords([]);
    setSongs([]);
    localStorage.removeItem('lingua_session_user');
  };

  // --- CONTENT ACTIONS ---

  const addWord = (newWord: Word) => {
    setWords(prev => [newWord, ...prev]);
    updateStats('wordsLearned', user.stats.wordsLearned + 1);
  };

  const addSong = (newSong: Song) => {
    setSongs(prev => [newSong, ...prev]);
  };

  const updateUser = (updates: Partial<UserProfile>) => {
    setUser(prev => ({ ...prev, ...updates }));
  };

  const updateStats = (stat: keyof UserStats, value: number) => {
    setUser(prev => ({
      ...prev,
      stats: {
        ...prev.stats,
        [stat]: value
      }
    }));
  };

  return (
    <DataContext.Provider value={{ 
      isAuthenticated, login, register, logout,
      words, addWord, 
      songs, addSong, 
      user, updateUser, updateStats 
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within DataProvider');
  return context;
};
