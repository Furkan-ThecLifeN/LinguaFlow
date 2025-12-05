import React, { createContext, useContext, useState, useEffect } from 'react';
import { Word, UserProfile, Song, UserStats } from '../types';
import { auth, db } from '../firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser,
  updatePassword
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy 
} from 'firebase/firestore';

interface DataContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (name: string, email: string, pass: string) => Promise<void>;
  logout: () => void;
  
  words: Word[];
  addWord: (word: Word) => Promise<void>;
  songs: Song[];
  addSong: (song: Song) => Promise<void>;
  user: UserProfile;
  updateUser: (user: Partial<UserProfile>) => Promise<void>;
  updateStats: (stat: keyof UserStats, value: number) => Promise<void>;
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
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<UserProfile>(getInitialUser());
  const [words, setWords] = useState<Word[]>([]);
  const [songs, setSongs] = useState<Song[]>([]);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);

  // Monitor Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setFirebaseUser(currentUser);
      if (currentUser) {
        setIsAuthenticated(true);
        // Fetch User Profile
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userSnap = await getDoc(userDocRef);
        
        if (userSnap.exists()) {
          setUser(userSnap.data() as UserProfile);
          
          // Update Last Login
          await updateDoc(userDocRef, {
            'stats.lastLoginDate': new Date().toISOString()
          });
        }
      } else {
        setIsAuthenticated(false);
        setUser(getInitialUser());
        setWords([]);
        setSongs([]);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Monitor Data Subscriptions (Real-time updates)
  useEffect(() => {
    if (!firebaseUser) return;

    // Words Subscription
    const wordsQuery = query(collection(db, 'users', firebaseUser.uid, 'words'), orderBy('createdAt', 'desc'));
    const unsubWords = onSnapshot(wordsQuery, (snapshot) => {
      const loadedWords = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Word));
      setWords(loadedWords);
    });

    // Songs Subscription
    const songsQuery = query(collection(db, 'users', firebaseUser.uid, 'songs'));
    const unsubSongs = onSnapshot(songsQuery, (snapshot) => {
      const loadedSongs = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Song));
      setSongs(loadedSongs);
    });

    // User Profile Subscription
    const userRef = doc(db, 'users', firebaseUser.uid);
    const unsubUser = onSnapshot(userRef, (doc) => {
        if(doc.exists()) {
            setUser(doc.data() as UserProfile);
        }
    });

    return () => {
      unsubWords();
      unsubSongs();
      unsubUser();
    };
  }, [firebaseUser]);


  // --- AUTH ACTIONS ---

  const login = async (email: string, pass: string): Promise<void> => {
    await signInWithEmailAndPassword(auth, email, pass);
  };

  const register = async (name: string, email: string, pass: string): Promise<void> => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    const uid = userCredential.user.uid;

    const newUser: UserProfile = {
      id: uid,
      name,
      email,
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
      stats: {
        totalStudyTimeMinutes: 0,
        wordsLearned: 0,
        songsListened: 0,
        lastLoginDate: new Date().toISOString()
      }
    };

    // Create User Document in Firestore
    await setDoc(doc(db, 'users', uid), newUser);
  };

  const logout = () => {
    signOut(auth);
  };

  // --- DATA ACTIONS ---

  const addWord = async (newWord: Word): Promise<void> => {
    if (!firebaseUser) return;
    // Firestore creates the ID automatically if we use addDoc, 
    // but the app structure expects an ID inside the object.
    // We can use a specific ID strategy or let Firestore generate it.
    // Here we treat newWord.id as temporary or override it.
    
    // Clean undefined fields for Firestore
    const wordData = JSON.parse(JSON.stringify(newWord)); 
    delete wordData.id; // Let Firestore ID be the source of truth

    const docRef = await addDoc(collection(db, 'users', firebaseUser.uid, 'words'), wordData);
    
    // Update stats
    updateStats('wordsLearned', user.stats.wordsLearned + 1);
  };

  const addSong = async (newSong: Song): Promise<void> => {
    if (!firebaseUser) return;
    const songData = JSON.parse(JSON.stringify(newSong));
    delete songData.id;
    await addDoc(collection(db, 'users', firebaseUser.uid, 'songs'), songData);
  };

  const updateUser = async (updates: Partial<UserProfile>): Promise<void> => {
    if (!firebaseUser) return;
    
    // Handle password update separately as it interacts with Auth service
    if (updates.password && updates.password.length > 0) {
        await updatePassword(firebaseUser, updates.password);
        delete updates.password; // Don't store password in Firestore
    }

    const userRef = doc(db, 'users', firebaseUser.uid);
    await updateDoc(userRef, updates);
  };

  const updateStats = async (stat: keyof UserStats, value: number): Promise<void> => {
    if (!firebaseUser) return;
    const userRef = doc(db, 'users', firebaseUser.uid);
    await updateDoc(userRef, {
        [`stats.${stat}`]: value
    });
  };

  return (
    <DataContext.Provider value={{ 
      isAuthenticated, isLoading, login, register, logout,
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