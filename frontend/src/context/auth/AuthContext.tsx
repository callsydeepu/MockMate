import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { authService, type AuthUser } from '../../services/authService';

export type User = AuthUser;

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  socialSignIn: (provider: 'google' | 'github' | 'linkedin') => Promise<boolean>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<boolean>;
  resetPassword: (password: string) => Promise<boolean>;
  updateProfile: (updatedUser: Partial<User>) => void;
  loginWithToken: (token: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check persistent login on mount
  useEffect(() => {
    const checkPersistedAuth = async () => {
      try {
        const token = localStorage.getItem('mockmate_token') || sessionStorage.getItem('mockmate_token');

        if (!token) {
          setUser(null);
          return;
        }

        const profile = await authService.getCurrentUser();
        if (profile) {
          setUser(profile);

          const useLocalStorage = !!localStorage.getItem('mockmate_token');
          const storage = useLocalStorage ? localStorage : sessionStorage;
          storage.setItem('mockmate_user', JSON.stringify(profile));
        } else {
          localStorage.removeItem('mockmate_token');
          localStorage.removeItem('mockmate_user');
          localStorage.removeItem('mockmate_active_interview_id');
          localStorage.removeItem('mockmate_active_interview_session');
          sessionStorage.removeItem('mockmate_token');
          sessionStorage.removeItem('mockmate_user');
          setUser(null);
        }
      } catch (err) {
        console.error('Error reading localStorage auth', err);
      } finally {
        setIsLoading(false);
      }
    };
    checkPersistedAuth();
  }, []);

  const login = async (email: string, password: string, rememberMe = false): Promise<boolean> => {
    setIsLoading(true);

    try {
      const data = await authService.login(email, password);
      const loggedUser = data.user;

      setUser(loggedUser);

      if (rememberMe) {
        sessionStorage.removeItem('mockmate_user');
        sessionStorage.removeItem('mockmate_token');
        localStorage.setItem('mockmate_user', JSON.stringify(loggedUser));
        localStorage.setItem('mockmate_token', data.token);
      } else {
        localStorage.removeItem('mockmate_user');
        localStorage.removeItem('mockmate_token');
        sessionStorage.setItem('mockmate_user', JSON.stringify(loggedUser));
        sessionStorage.setItem('mockmate_token', data.token);
      }

      toast.success(`Welcome back, ${loggedUser.name}!`);
      return true;
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Login failed. Check your credentials.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);

    try {
      const data = await authService.signup(name, email, password);
      setUser(data.user);
      localStorage.setItem('mockmate_user', JSON.stringify(data.user));
      localStorage.setItem('mockmate_token', data.token);
      sessionStorage.removeItem('mockmate_user');
      sessionStorage.removeItem('mockmate_token');
      toast.success('Account created successfully! Welcome to MockMate X AI.');
      return true;
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Signup failed. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const socialSignIn = async (provider: 'google' | 'github' | 'linkedin'): Promise<boolean> => {
    setIsLoading(true);
    // Simulate OAuth handshake delay
    await new Promise((resolve) => setTimeout(resolve, 900));

    const socialUser: User = {
      id: `usr_${provider}_${Math.random().toString(36).substring(2, 9)}`,
      name: provider === 'google' ? 'Google User' : provider === 'github' ? 'GitHub User' : 'LinkedIn User',
      email: provider === 'google' ? 'you@google.com' : `${provider}@example.com`,
      avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${provider}-${Date.now()}`,
      headline: `${provider.charAt(0).toUpperCase() + provider.slice(1)} OAuth Member`,
      joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    };

    setUser(socialUser);
    sessionStorage.setItem('mockmate_user', JSON.stringify(socialUser));
    sessionStorage.setItem('mockmate_token', 'mock_jwt_token_oauth');
    toast.success(`Signed in with ${provider.charAt(0).toUpperCase() + provider.slice(1)}.`);
    setIsLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('mockmate_user');
    localStorage.removeItem('mockmate_token');
    localStorage.removeItem('mockmate_active_interview_id');
    localStorage.removeItem('mockmate_active_interview_session');
    sessionStorage.removeItem('mockmate_user');
    sessionStorage.removeItem('mockmate_token');
    toast.success('Logged out successfully.');
  };

  const forgotPassword = async (email: string): Promise<boolean> => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    toast.success(`Password reset instructions sent to ${email}`);
    setIsLoading(false);
    return true;
  };

  const resetPassword = async (_password: string): Promise<boolean> => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    toast.success('Your password has been reset successfully. Please log in.');
    setIsLoading(false);
    return true;
  };

  const updateProfile = (updatedUser: Partial<User>) => {
    if (user) {
      const newUser = { ...user, ...updatedUser };
      setUser(newUser);
      localStorage.setItem('mockmate_user', JSON.stringify(newUser));
      toast.success('Profile updated successfully!');
    }
  };

  const loginWithToken = async (token: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      console.log('[DEBUG] loginWithToken - saving token to localStorage:', token);
      localStorage.setItem('mockmate_token', token);
      
      const profile = await authService.getCurrentUser();
      if (profile) {
        console.log('[DEBUG] loginWithToken - fetched user profile:', profile);
        setUser(profile);
        localStorage.setItem('mockmate_user', JSON.stringify(profile));
        toast.success(`Welcome back, ${profile.name}!`);
        return true;
      } else {
        console.error('[DEBUG] loginWithToken - failed to retrieve user profile after setting token');
        localStorage.removeItem('mockmate_token');
        setUser(null);
        return false;
      }
    } catch (err) {
      console.error('[DEBUG] loginWithToken - exception occurred:', err);
      localStorage.removeItem('mockmate_token');
      localStorage.removeItem('mockmate_user');
      setUser(null);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        socialSignIn,
        logout,
        forgotPassword,
        resetPassword,
        updateProfile,
        loginWithToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
