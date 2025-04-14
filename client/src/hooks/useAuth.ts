import { useState, useEffect, useCallback } from 'react';
import { User } from 'firebase/auth';
import { loginWithEmail, registerWithEmail, logoutUser, onUserChanged, getIdToken } from '@/lib/firebase';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  name: string;
  avatar?: string;
  firebaseId: string;
  availability?: string;
  studyStyle?: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<AuthUser | null>(null);
  const { toast } = useToast();

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onUserChanged((firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);

      // If user is logged in, fetch the profile
      if (firebaseUser) {
        fetchUserProfile();
      } else {
        setUserProfile(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // Fetch user profile from API
  const fetchUserProfile = useCallback(async () => {
    try {
      const token = await getIdToken();
      if (!token) return;

      const response = await apiRequest('GET', '/api/user/profile');
      const data = await response.json();
      setUserProfile(data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch user profile',
        variant: 'destructive',
      });
    }
  }, [toast]);

  // Login function
  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      await loginWithEmail(email, password);
      return true;
    } catch (error: any) {
      console.error('Login error:', error);
      
      let errorMessage = 'Failed to login';
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        errorMessage = 'Invalid email or password';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email format';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many attempts. Please try again later';
      }
      
      toast({
        title: 'Login Failed',
        description: errorMessage,
        variant: 'destructive',
      });
      
      return false;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Register function
  const register = useCallback(async (email: string, password: string, username: string, name: string) => {
    setLoading(true);
    try {
      // Register with Firebase
      const userCredential = await registerWithEmail(email, password);
      const firebaseUser = userCredential.user;
      
      // Create user in our backend
      const response = await apiRequest('POST', '/api/auth/register', {
        username,
        email,
        password,  // Will be hashed in the backend
        name,
        firebaseId: firebaseUser.uid,
      });
      
      if (!response.ok) {
        // If backend registration fails, delete the Firebase user
        await firebaseUser.delete();
        throw new Error((await response.json()).message || 'Failed to register user');
      }
      
      return true;
    } catch (error: any) {
      console.error('Registration error:', error);
      
      let errorMessage = 'Failed to register';
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Email already in use';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email format';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: 'Registration Failed',
        description: errorMessage,
        variant: 'destructive',
      });
      
      return false;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Logout function
  const logout = useCallback(async () => {
    try {
      await logoutUser();
      setUserProfile(null);
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: 'Logout Failed',
        description: 'Failed to logout',
        variant: 'destructive',
      });
      return false;
    }
  }, [toast]);

  // Update user profile
  const updateProfile = useCallback(async (data: Partial<AuthUser>) => {
    try {
      const response = await apiRequest('PATCH', '/api/user/profile', data);
      const updatedProfile = await response.json();
      setUserProfile(updatedProfile);
      return true;
    } catch (error) {
      console.error('Update profile error:', error);
      toast({
        title: 'Update Failed',
        description: 'Failed to update profile',
        variant: 'destructive',
      });
      return false;
    }
  }, [toast]);

  return {
    user,
    userProfile,
    loading,
    login,
    register,
    logout,
    updateProfile,
    fetchUserProfile,
  };
}
