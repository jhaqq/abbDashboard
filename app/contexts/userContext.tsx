// userContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth, db } from '@/firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';

interface User {
    // Firebase Auth fields
    uid: string;
    email: string | null;
    displayName: string | null;
    
    // Your custom Firestore fields
    userName: string;
    userType: string;
    firstName: string;
    lastName: string;
    location: string;
    userID: string;
}

interface UserContextType {
    user: User | null;
    loading: boolean;
    isLoggedIn: boolean;
}

interface UserProviderProps {
    children: ReactNode;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = (): UserContextType => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
            try {
                if (firebaseUser) {
                    // Query Firestore using the same method as your auth hook
                    const usersRef = collection(db, 'users');
                    const q = query(usersRef, where('uID', '==', firebaseUser.uid));
                    const querySnapshot = await getDocs(q);
                    
                    if (!querySnapshot.empty) {
                        const userDoc = querySnapshot.docs[0];
                        const firestoreData = userDoc.data();
                        
                        const completeUser: User = {
                            // Firebase Auth data
                            uid: firebaseUser.uid,
                            email: firebaseUser.email,
                            displayName: firebaseUser.displayName,
                            
                            // Firestore data
                            userName: firestoreData.userName || '',
                            userType: firestoreData.userType || '',
                            firstName: firestoreData.firstName || '',
                            lastName: firestoreData.lastName || '',
                            location: firestoreData.location || '',
                            userID: firestoreData.userID || '',
                        };
                        
                        setUser(completeUser);
                    } else {
                        console.error('No user profile found in Firestore');
                        setUser(null);
                    }
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    const contextValue: UserContextType = {
        user,
        loading,
        isLoggedIn: !!user,
    };

    return (
        <UserContext.Provider value={contextValue}>
            {children}
        </UserContext.Provider>
    );
};

export type { User };