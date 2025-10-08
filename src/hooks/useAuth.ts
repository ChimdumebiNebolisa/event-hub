import { useState, useEffect } from 'react';
import { 
  User, 
  signInWithPopup, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  linkWithPopup,
  unlink,
  fetchSignInMethodsForEmail,
  GoogleAuthProvider,
  OAuthProvider
} from 'firebase/auth';
import { auth, googleProvider, microsoftProvider } from '@/lib/firebase';
import { clearAllTokens, checkTokenStatus } from '@/lib/tokenUtils';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
      
      // Check token status when user changes
      if (user) {
        console.log('🔐 User authenticated:', user.email);
        checkTokenStatus();
      } else {
        console.log('🚪 User signed out');
        clearAllTokens();
      }
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      
      // Extract the OAuth access token from the credential
      const credential = GoogleAuthProvider.credentialFromResult(result);
      if (credential?.accessToken) {
        // Store the access token for API calls
        localStorage.setItem('google_access_token', credential.accessToken);
        console.log('Google access token stored:', credential.accessToken);
      } else {
        console.error('No access token found in Google credential');
      }
      
      return result.user;
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  };

  const signInWithMicrosoft = async () => {
    try {
      const result = await signInWithPopup(auth, microsoftProvider);
      
      // Extract the OAuth access token from the credential
      const credential = OAuthProvider.credentialFromResult(result);
      if (credential?.accessToken) {
        // Store the access token for API calls
        localStorage.setItem('microsoft_access_token', credential.accessToken);
        console.log('Microsoft access token stored:', credential.accessToken);
      } else {
        console.error('No access token found in Microsoft credential');
      }
      
      return result.user;
    } catch (error: any) {
      console.error('Error signing in with Microsoft:', error);
      
      // Handle account exists with different credential
      if (error.code === 'auth/account-exists-with-different-credential') {
        // Try to get the email from the error
        const email = error.customData?.email;
        if (email) {
          // Check what providers are available for this email
          const providers = await fetchSignInMethodsForEmail(auth, email);
          console.log('Available providers for this email:', providers);
          
          // If Google is available, suggest linking accounts
          if (providers.includes('google.com')) {
            throw new Error(`An account with this email already exists using Google sign-in. Please sign in with Google first, then link your Microsoft account.`);
          }
        }
        throw new Error('An account with this email already exists using a different sign-in method. Please use the original sign-in method or use a different email.');
      }
      
      throw error;
    }
  };

  // Helper function to check if an email is already linked to another account
  const checkAccountAvailability = async (email: string) => {
    try {
      const providers = await fetchSignInMethodsForEmail(auth, email);
      return {
        isAvailable: !providers.includes('microsoft.com'),
        existingProviders: providers,
        hasGoogle: providers.includes('google.com'),
        hasMicrosoft: providers.includes('microsoft.com'),
        hasPassword: providers.includes('password')
      };
    } catch (error) {
      console.error('Error checking account availability:', error);
      return { 
        isAvailable: true, 
        existingProviders: [], 
        hasGoogle: false, 
        hasMicrosoft: false, 
        hasPassword: false 
      };
    }
  };

  const linkMicrosoftAccount = async () => {
    if (!user) {
      throw new Error('No user signed in. Please sign in first.');
    }
    
    // Pre-check: See if Microsoft is already linked to current user
    const hasMicrosoft = user.providerData.some(provider => provider.providerId === 'microsoft.com');
    if (hasMicrosoft) {
      console.log('Microsoft account already linked, refreshing token...');
      // Instead of throwing an error, refresh the Microsoft token
      try {
        const result = await linkWithPopup(user, microsoftProvider);
        const credential = OAuthProvider.credentialFromResult(result);
        if (credential?.accessToken) {
          localStorage.setItem('microsoft_access_token', credential.accessToken);
          console.log('Microsoft access token refreshed successfully');
        }
        return result.user;
      } catch (refreshError) {
        console.warn('Failed to refresh Microsoft token, proceeding with existing link');
        return user;
      }
    }
    
    try {
      console.log('Attempting to link Microsoft account...');
      const result = await linkWithPopup(user, microsoftProvider);
      
      // Extract the OAuth access token from the credential
      const credential = OAuthProvider.credentialFromResult(result);
      console.log('Microsoft credential result:', {
        hasAccessToken: !!credential?.accessToken,
        hasIdToken: !!credential?.idToken,
        credential: credential
      });
      
      if (credential?.accessToken) {
        // Store the access token for API calls
        localStorage.setItem('microsoft_access_token', credential.accessToken);
        console.log('Microsoft access token stored successfully:', credential.accessToken.substring(0, 20) + '...');
      } else {
        console.warn('No access token found in Microsoft credential - calendar integration may not work');
        console.log('Available credential data:', credential);
      }
      
      console.log('Microsoft account linked successfully');
      return result.user;
    } catch (error: any) {
      console.error('Error linking Microsoft account:', error);
      
      // Handle specific Firebase errors with better user guidance
      if (error.code === 'auth/credential-already-in-use') {
        const email = error.customData?.email;
        const errorMessage = email 
          ? `This Microsoft account (${email}) is already linked to another user account. To use this Microsoft account with your current account, you have two options:\n\n1. Sign out and sign in with the account that originally linked this Microsoft account\n2. Use a different Microsoft account for calendar integration\n\nThis is a security limitation - each Microsoft account can only be linked to one user account.`
          : 'This Microsoft account is already linked to another user. Please use a different Microsoft account or sign out and sign in with the original account.';
        throw new Error(errorMessage);
      } else if (error.code === 'auth/email-already-in-use') {
        const email = error.customData?.email;
        throw new Error(`An account with this email (${email || 'Unknown'}) already exists. Please sign in with the original account first.`);
      } else if (error.code === 'auth/account-exists-with-different-credential') {
        const email = error.customData?.email;
        const providers = error.customData?.signInMethods || [];
        const providerNames = providers.map((p: string) => {
          switch(p) {
            case 'google.com': return 'Google';
            case 'microsoft.com': return 'Microsoft';
            case 'password': return 'Email/Password';
            default: return p;
          }
        }).join(', ');
        
        throw new Error(`An account with this email (${email || 'Unknown'}) already exists using: ${providerNames}. Please sign in with one of these methods first, then link your Microsoft account.`);
      } else if (error.code === 'auth/popup-closed-by-user') {
        throw new Error('Microsoft account linking was cancelled. Please try again if you want to link your Microsoft account.');
      } else if (error.code === 'auth/popup-blocked') {
        throw new Error('Popup was blocked by your browser. Please allow popups for this site and try again.');
      } else if (error.code === 'auth/network-request-failed') {
        throw new Error('Network error occurred. Please check your internet connection and try again.');
      }
      
      // Generic error fallback
      throw new Error(`Failed to link Microsoft account: ${error.message || 'Unknown error occurred'}`);
    }
  };

  const unlinkProvider = async (providerId: string) => {
    try {
      if (!user) {
        throw new Error('No user found');
      }

      // Check if user has multiple providers before unlinking
      const currentProviders = user.providerData.map(provider => provider.providerId);
      
      if (currentProviders.length <= 1) {
        throw new Error('Cannot unlink the only sign-in method. Please add another sign-in method first or sign out completely.');
      }

      // Find the provider to unlink
      const providerToUnlink = user.providerData.find(provider => provider.providerId === providerId);
      if (!providerToUnlink) {
        throw new Error(`Provider ${providerId} is not linked to this account`);
      }

      // Unlink the provider from Firebase Auth
      await unlink(user, providerId);

      // Clear the corresponding access token
      if (providerId === 'google.com') {
        localStorage.removeItem('google_access_token');
        console.log('Cleared Google access token');
      } else if (providerId === 'microsoft.com') {
        localStorage.removeItem('microsoft_access_token');
        console.log('Cleared Microsoft access token');
      }
      
      console.log(`Successfully unlinked ${providerId} provider`);
      return true;
    } catch (error: any) {
      console.error(`Error unlinking ${providerId} provider:`, error);
      
      // If unlinking fails, we can still clear the tokens as a fallback
      if (providerId === 'google.com') {
        localStorage.removeItem('google_access_token');
        console.log('Cleared Google access token as fallback');
      } else if (providerId === 'microsoft.com') {
        localStorage.removeItem('microsoft_access_token');
        console.log('Cleared Microsoft access token as fallback');
      }
      
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      // Clear any cached data or tokens
      setUser(null);
      // Clear all stored access tokens using utility
      clearAllTokens();
      console.log('✅ Successfully signed out and cleared all tokens');
    } catch (error) {
      console.error('❌ Error signing out:', error);
      throw error;
    }
  };

  return {
    user,
    loading,
    signInWithGoogle,
    signInWithMicrosoft,
    linkMicrosoftAccount,
    unlinkProvider,
    signOut,
    checkAccountAvailability
  };
};
