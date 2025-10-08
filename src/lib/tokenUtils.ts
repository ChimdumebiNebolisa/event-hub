// Token utility functions for managing authentication tokens

export interface TokenInfo {
  isValid: boolean;
  isExpired: boolean;
  expiresAt?: Date;
  scopes?: string[];
  error?: string;
}

/**
 * Validates and parses a JWT token
 */
export function validateToken(token: string): TokenInfo {
  try {
    if (!token) {
      return {
        isValid: false,
        isExpired: false,
        error: 'Token is empty'
      };
    }

    // Split the token into parts
    const parts = token.split('.');
    if (parts.length !== 3) {
      return {
        isValid: false,
        isExpired: false,
        error: 'Invalid token format'
      };
    }

    // Decode the payload (middle part)
    const payload = JSON.parse(atob(parts[1]));
    
    const currentTime = Math.floor(Date.now() / 1000);
    const isExpired = payload.exp && payload.exp < currentTime;
    
    return {
      isValid: true,
      isExpired,
      expiresAt: payload.exp ? new Date(payload.exp * 1000) : undefined,
      scopes: payload.scp || payload.scope || [],
    };
  } catch (error) {
    return {
      isValid: false,
      isExpired: false,
      error: `Token validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

/**
 * Clears all stored authentication tokens
 */
export function clearAllTokens(): void {
  localStorage.removeItem('google_access_token');
  localStorage.removeItem('microsoft_access_token');
  console.log('🧹 Cleared all authentication tokens');
}

/**
 * Checks if tokens are valid and logs their status
 */
export function checkTokenStatus(): void {
  console.log('🔍 Checking token status...');
  
  const googleToken = localStorage.getItem('google_access_token');
  const microsoftToken = localStorage.getItem('microsoft_access_token');
  
  if (googleToken) {
    const googleStatus = validateToken(googleToken);
    console.log('Google Token:', {
      valid: googleStatus.isValid,
      expired: googleStatus.isExpired,
      expiresAt: googleStatus.expiresAt,
      scopes: googleStatus.scopes,
      error: googleStatus.error
    });
  } else {
    console.log('Google Token: Not found');
  }
  
  if (microsoftToken) {
    const microsoftStatus = validateToken(microsoftToken);
    console.log('Microsoft Token:', {
      valid: microsoftStatus.isValid,
      expired: microsoftStatus.isExpired,
      expiresAt: microsoftStatus.expiresAt,
      scopes: microsoftStatus.scopes,
      error: microsoftStatus.error
    });
  } else {
    console.log('Microsoft Token: Not found');
  }
}

/**
 * Auto-refreshes expired tokens by triggering a re-authentication
 */
export function handleExpiredTokens(): {
  hasExpiredTokens: boolean;
  expiredProviders: string[];
} {
  const expiredProviders: string[] = [];
  
  const googleToken = localStorage.getItem('google_access_token');
  const microsoftToken = localStorage.getItem('microsoft_access_token');
  
  if (googleToken) {
    const status = validateToken(googleToken);
    if (status.isExpired) {
      expiredProviders.push('google');
      localStorage.removeItem('google_access_token');
    }
  }
  
  if (microsoftToken) {
    const status = validateToken(microsoftToken);
    if (status.isExpired) {
      expiredProviders.push('microsoft');
      localStorage.removeItem('microsoft_access_token');
    }
  }
  
  return {
    hasExpiredTokens: expiredProviders.length > 0,
    expiredProviders
  };
}
