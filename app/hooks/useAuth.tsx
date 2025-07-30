// hooks/useAuth.ts
"use client";

import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth, db } from '@/firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { FirebaseError } from 'firebase/app';

export const useAuth = () => {
  const login = async (username: string, password: string) => {
    if (!username || !password) {
      throw new Error('Username and password are required');
    }

    const userEmail = username.trim() + '@americanbubbleboy.com';

    try {
      const userCredential = await signInWithEmailAndPassword(auth, userEmail, password);
      const user = userCredential.user;
      
      // Verify user exists in Firestore
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('uID', '==', user.uid));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        await signOut(auth); // Sign out if no profile found
        throw new Error('User profile not found. Please contact administrator.');
      }

      // Return the user data for routing purposes
      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();
      
      return { 
        success: true,
        user: {
          userName: userData.userName,
          userType: userData.userType,
          uID: userData.userID
        }
      };
      
    } catch (error) {
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case 'auth/user-not-found':
            throw new Error('No account found with this email address');
          case 'auth/wrong-password':
            throw new Error('Incorrect password');
          case 'auth/invalid-email':
            throw new Error('Invalid email address');
          case 'auth/user-disabled':
            throw new Error('This account has been disabled');
          case 'auth/too-many-requests':
            throw new Error('Too many failed attempts. Please try again later');
          case 'auth/network-request-failed':
            throw new Error('Network error. Please check your connection');
          default:
            throw new Error('Login failed. Please try again');
        }
      }
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
      throw new Error('Logout failed');
    }
  };

  return { login, logout };
};