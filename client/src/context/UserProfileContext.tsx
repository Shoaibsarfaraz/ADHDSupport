import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react'; 
import { IUser } from '../types/index.js';
import { api } from '../services/api.js';

// --- Context Type Definition ---
interface UserProfileContextType {
  userProfile: IUser | null;
  isProfileLoading: boolean;
  error: string | null;
  // Function to refresh the profile data from the server
  refreshProfile: () => Promise<void>;
  // Function to update local state and potentially send updates to the server
  updateProfile: (updates: Partial<IUser>) => Promise<IUser | undefined>;
}

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

// --- Provider Component ---
export const UserProfileProvider = ({ children }: { children: ReactNode }) => {
  const { user, isLoaded } = useUser(); // Get the authenticated user object from Clerk
  const { userId, isSignedIn } = useAuth(); // Get the clerkId/status from Clerk

  const [userProfile, setUserProfile] = useState<IUser | null>(null);
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch or create the user profile on the backend
  const fetchOrCreateProfile = useCallback(async (clerkId: string) => {
    setIsProfileLoading(true);
    setError(null);
    try {
      // 1. Try to fetch existing user profile
      const response = await api.users.getByClerkId(clerkId);
      setUserProfile(response.data);
      console.log("Existing user profile fetched.");

    } catch (e: any) {
      if (e.response && e.response.status === 404 && user) {
        // 2. If 404 (User not found), create the profile
        console.log("User not found on backend. Creating new profile...");
        const newUserProfile = {
          clerkId: clerkId,
          userFirstName: user.firstName || '',
          userLastName: user.lastName || '',
          userEmail: user.emailAddresses[0].emailAddress || 'N/A',
        };
        const createResponse = await api.users.create(newUserProfile);
        setUserProfile(createResponse.data);
        console.log("New user profile created successfully.");
      } else {
        console.error("Failed to fetch or create user profile:", e);
        setError("Failed to load user profile data.");
      }
    } finally {
      setIsProfileLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (isLoaded && isSignedIn && userId) {
      fetchOrCreateProfile(userId);
    } else if (isLoaded && !isSignedIn) {
      // Clear profile state if user signs out
      setUserProfile(null);
      setIsProfileLoading(false);
      setError(null);
    }
  }, [isLoaded, isSignedIn, userId, fetchOrCreateProfile]);


  // Public function to manually refresh profile data
  const refreshProfile = async () => {
    if (userId) {
      await fetchOrCreateProfile(userId);
    }
  };

  // Public function to update profile and send change to server
  const updateProfile = async (updates: Partial<IUser>) => {
    if (!userId || !userProfile) return;
    
    try {
        const response = await api.users.update(userId, updates);
        
        // Update local state with the server's response
        setUserProfile(response.data);
        return response.data;
    } catch (e) {
        console.error("Failed to update user profile:", e);
        setError("Failed to save changes to profile.");
    }
  };

  return (
    <UserProfileContext.Provider
      value={{
        userProfile,
        isProfileLoading,
        error,
        refreshProfile,
        updateProfile,
      }}
    >
      {children}
    </UserProfileContext.Provider>
  );
};

// --- Hook to use the Context ---
export const useUserProfile = () => {
  const context = useContext(UserProfileContext);
  if (context === undefined) {
    throw new Error('useUserProfile must be used within a UserProfileProvider');
  }
  return context;
};