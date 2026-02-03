import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from './supabase/client';
import { UserProfile, UserRole, UserTier } from './uiPolicy';
import { toast } from 'sonner';

import { projectId, publicAnonKey } from './supabase/info';

interface UserContextType {
  profile: UserProfile | null;
  isLoading: boolean;
  assignRole: (role: UserRole, tier: UserTier) => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  refreshProfile: () => Promise<void>;
  logout: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    try {
      // 1. Get Auth User Metadata (Source of Truth for Tier if DB column missing)
      const { data: { user } } = await supabase.auth.getUser();
      const metadata = user?.user_metadata || {};

      // 2. Get DB Profile (Source of Truth for Role)
      const { data: dbProfile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        // PGRST116 is "Row not found" - acceptable for new users
        console.warn('Error fetching profile from DB:', error.message);
      }

      // 3. Merge Data
      // Priority: DB Profile > User Metadata > Defaults
      const mergedProfile: UserProfile = {
        id: userId,
        email: user?.email || '',
        full_name: dbProfile?.full_name || metadata.full_name || user?.email?.split('@')[0] || 'User',
        role: (dbProfile?.role || metadata.role || 'client') as UserRole,
        // Since 'tier' column might be missing in DB, we rely on metadata
        tier: (metadata.tier || dbProfile?.plan || 'free') as UserTier,
        is_verified: dbProfile?.is_verified ?? metadata.is_verified ?? false,
        // Add other fields as necessary based on UserProfile interface
        ...dbProfile
      };
      
      setProfile(mergedProfile);
    } catch (err) {
      console.error('Profile load failed', err);
    }
  };

  useEffect(() => {
    // 1. Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
      }
      setIsLoading(false);
    });

    // 2. Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const updateProfile = async (updates: Partial<UserProfile>) => {
    try {
        let { data: { user } } = await supabase.auth.getUser();
        
        // Fallback to session user if getUser fails (e.g. network latency after login)
        if (!user) {
             const { data: { session } } = await supabase.auth.getSession();
             user = session?.user || null;
        }

        if (!user) throw new Error("No user logged in");

        // Split updates between Metadata and DB
        const metadataUpdates: any = {};
        const dbUpdates: any = {};

        if (updates.tier) metadataUpdates.tier = updates.tier;
        if (updates.role) {
            metadataUpdates.role = updates.role;
            dbUpdates.role = updates.role;
        }
        if (updates.full_name) {
            metadataUpdates.full_name = updates.full_name;
            dbUpdates.full_name = updates.full_name;
        }
        if (updates.is_verified !== undefined) {
            metadataUpdates.is_verified = updates.is_verified;
            dbUpdates.is_verified = updates.is_verified;
        }

        // 1. Update Auth Metadata
        if (Object.keys(metadataUpdates).length > 0) {
            const { error: metaError } = await supabase.auth.updateUser({
                data: metadataUpdates
            });
            if (metaError) throw metaError;
        }

        // 2. Update DB Profile
        // We catch errors here because 'tier' column might be missing
        if (Object.keys(dbUpdates).length > 0) {
            const { error: dbError } = await supabase
                .from('profiles')
                .upsert({
                    id: user.id,
                    updated_at: new Date().toISOString(),
                    ...dbUpdates
                });
            
            if (dbError) {
                console.warn("DB Update Warning (non-fatal):", dbError.message);
                // If DB fails (e.g. missing column), we still have metadata
            }
        }

        // 3. Refresh Local State
        await fetchProfile(user.id);
        
    } catch (err: any) {
        console.error("Update Profile Failed:", err);
        toast.error("Failed to update profile");
    }
  };

  const assignRole = async (role: UserRole, tier: UserTier) => {
    setIsLoading(true);
    try {
      // Check if we are logged in anonymously or as a user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        // Attempt Anonymous Login First
        const { error: anonError } = await supabase.auth.signInAnonymously();
        
        if (anonError) {
             console.log("Anonymous login failed, trying static test user:", anonError.message);
             
             const testEmail = 'dev.test.user@bietalreef.com';
             const testPassword = 'Password123!';

             // Try Sign In First
             const { error: signInError } = await supabase.auth.signInWithPassword({
                email: testEmail,
                password: testPassword
             });

             if (signInError) {
                 console.warn("Test user sign in failed:", signInError.message);
                 
                 // Try to create user via SERVER (bypasses rate limit)
                 try {
                     const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-ad34c09a/signup`, {
                         method: 'POST',
                         headers: {
                             'Content-Type': 'application/json',
                             'Authorization': `Bearer ${publicAnonKey}`
                         },
                         body: JSON.stringify({
                             email: testEmail,
                             password: testPassword,
                             name: 'Test User'
                         })
                     });

                     // If successful or user already exists, try signing in again
                     // (The server returns 400 if user exists, but that's fine, we just retry login)
                     
                     const { error: finalSignInError } = await supabase.auth.signInWithPassword({
                        email: testEmail,
                        password: testPassword
                     });
                     
                     if (finalSignInError) throw finalSignInError;
                     
                 } catch (err) {
                     console.error("Test user fallback failed:", err);
                     throw signInError; // Throw original error if fallback fails
                 }
             }
        }
      }

      // Use the new updateProfile method which handles both DB and Metadata safely
      await updateProfile({ role, tier });

      toast.success(`Role Assigned: ${role.toUpperCase()} / ${tier.toUpperCase()}`);
      
    } catch (error: any) {
      console.error('Role assignment failed:', error);
      toast.error(`Failed to assign role: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) await fetchProfile(user.id);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setProfile(null);
    toast.info('Logged out');
  };

  return (
    <UserContext.Provider value={{ profile, isLoading, assignRole, updateProfile, refreshProfile, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
