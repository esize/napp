import { hash, verify } from 'argon2';
import { redirect } from 'next/navigation';
import { verifyToken, createAccessToken, getTokens, setTokens, createRefreshToken } from './jwt';
import { getUserById, getUserByUsername } from '@/data';
import { TokenPayload } from '@/types/auth';

export async function hashPassword(password: string): Promise<string> {
  return await hash(password);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await verify(password, hashedPassword);
}

export async function getAuthenticatedUser(): Promise<TokenPayload | null> {
  // Get tokens from cookies
  const { accessToken, refreshToken } = await getTokens();
  
  // Check if access token exists and is valid
  if (accessToken) {
    const payload = await verifyToken<TokenPayload>(accessToken);
    if (payload) {
      return payload;
    }
  }
  
  // If no valid access token, try refresh token
  if (refreshToken) {
    const refreshPayload = await verifyToken<{ sub: string; type: string }>(refreshToken);
    
    // If refresh token is valid, create a new access token
    if (refreshPayload?.type === 'refresh') {
      try {
        // Get user data to create a new access token
        const user = await getUserById(refreshPayload.sub);
        
        if (user) {
          // Create a new access token
          const newPayload: Omit<TokenPayload, 'exp'> = {
            sub: user.id,
            username: user.username,
            isActive: user.isActive,
            isLocked: user.isLocked
          };
          
          const newAccessToken = await createAccessToken(newPayload);
          
          // Set the new access token in cookies
          await setTokens(newAccessToken, refreshToken, {
            maxAge: { 
              access: 15 * 60,  // 15 minutes
              refresh: 7 * 24 * 60 * 60  // 7 days
            }
          });
          
          return newPayload;
        }
      } catch (error) {
        console.error('Error refreshing token:', error);
      }
    }
  }
  
  return null;
}

export async function requireAuth(): Promise<TokenPayload> {
  const user = await getAuthenticatedUser();
  
  if (!user) {
    redirect('/login');
  }
  
  return user;
}

export async function authenticateUser(email: string, password: string): Promise<{ 
  success: boolean;
  user?: TokenPayload;
  message?: string;
}> {
  try {
    // This function would need to be implemented based on your user repository
    // It should fetch a user by email including the password hash
    const user = await getUserByUsername(email);
    
    if (!user) {
      return { 
        success: false,
        message: 'Invalid credentials'
      };
    }
    
    // Verify the password
    const isValidPassword = await verifyPassword(password, user.passwordHash);
    
    if (!isValidPassword) {
      return { 
        success: false,
        message: 'Invalid credentials'
      };
    }
    
    // Create tokens
    const payload: Omit<TokenPayload, 'exp'> = {
        sub: user.id,
        username: user.username,
        isActive: user.isActive,
        isLocked: user.isLocked
    };
    
    const accessToken = await createAccessToken(payload);
    const refreshToken = await createRefreshToken(user.id);
    
    // Set cookies
    await setTokens(accessToken, refreshToken);
    
    return {
      success: true,
      user: payload
    };
  } catch (error) {
    console.error('Authentication error:', error);
    return {
      success: false,
      message: 'An error occurred during authentication'
    };
  }
}
