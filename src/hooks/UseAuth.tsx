/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useCallback } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../services/supabaseService';
import type { UserProfile } from '../services/supabaseService';
export const useSupabaseAuth = () => {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Sign up function
    const signUp = async (email: string, password: string) => {
        if (!supabase) throw new Error('Supabase not configured');

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            if (error.message.includes('already registered')) {
                throw new Error('An account with this email already exists. Please sign in instead.');
            }
            throw new Error(error.message);
        }

        if (data.user && !data.session) {
            throw new Error('Please check your email and click the confirmation link to complete your registration.');
        }

        return data;
    };

    // Sign in function
    const signIn = async (email: string, password: string) => {
        if (!supabase) throw new Error('Supabase not configured');

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            if (error.message.includes('email not confirmed')) {
                throw new Error('Please check your email and click the confirmation link before signing in.');
            }
            if (error.message.includes('Invalid login credentials')) {
                throw new Error('Invalid email or password. Please check your credentials and try again.');
            }
            if (error.message.includes('Email not confirmed')) {
                throw new Error('Please confirm your email address before signing in. Check your inbox for a confirmation email.');
            }
            throw new Error(error.message);
        }

        return data;
    };

    // Sign out function
    const signOut = async () => {
        if (!supabase) throw new Error('Supabase not configured');

        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    };

    // Get user profile
    const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
        if (!supabase) return null;

        const { data, error } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) {
            if (error.code === 'PGRST116') return null;
            throw error;
        }

        return data;
    };

    // Update user profile
    const updateUserProfile = async (userId: string, updates: Partial<UserProfile>) => {
        if (!supabase) throw new Error('Supabase not configured');

        const { data, error } = await supabase
            .from('user_profiles')
            .upsert({
                id: userId,
                ...updates,
                updated_at: new Date().toISOString(),
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    };

    // Add favorite city
    const addFavoriteCity = async (userId: string, city: string) => {
        if (!supabase) throw new Error('Supabase not configured');

        const profile = await getUserProfile(userId);
        const currentFavorites = profile?.favorite_cities || [];

        if (!currentFavorites.includes(city)) {
            const updatedFavorites = [...currentFavorites, city];
            const updatedProfile = await updateUserProfile(userId, {
                favorite_cities: updatedFavorites
            });
            setProfile(updatedProfile);
            return updatedProfile;
        }
        return profile;
    };

    // Remove favorite city
    const removeFavoriteCity = async (userId: string, city: string) => {
        if (!supabase) throw new Error('Supabase not configured');

        const profile = await getUserProfile(userId);
        const currentFavorites = profile?.favorite_cities || [];

        const updatedFavorites = currentFavorites.filter(c => c !== city);
        const updatedProfile = await updateUserProfile(userId, {
            favorite_cities: updatedFavorites
        });
        setProfile(updatedProfile);
        return updatedProfile;
    };

    // Resend confirmation
    const resendConfirmation = async (email: string) => {
        if (!supabase) throw new Error('Supabase not configured');

        const { error } = await supabase.auth.resend({
            type: 'signup',
            email: email,
        });

        if (error) throw error;
    };

    // Load user profile
    const loadUserProfile = useCallback(async (userId: string) => {
        try {
            const userProfile = await getUserProfile(userId);
            setProfile(userProfile);
        } catch (error) {
            console.error('Error loading user profile:', error);
        } finally {
            setIsLoading(false);
        }
    }, [getUserProfile]);

    // Auth state listener
    useEffect(() => {
        if (!supabase) {
            setIsLoading(false);
            return;
        }

        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            if (session?.user) {
                loadUserProfile(session.user.id);
            } else {
                setIsLoading(false);
            }
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                console.log('Auth state changed:', event, session?.user?.email);
                setUser(session?.user ?? null);
                if (session?.user) {
                    await loadUserProfile(session.user.id);
                } else {
                    setProfile(null);
                    setIsLoading(false);
                }
            }
        );

        return () => subscription.unsubscribe();
    }, [loadUserProfile]);

    return {
        user,
        profile,
        isLoading,
        signUp,
        signIn,
        signOut,
        updateUserProfile: async (updates: Partial<UserProfile>) => {
            if (!user) throw new Error('No user logged in');
            const updatedProfile = await updateUserProfile(user.id, updates);
            setProfile(updatedProfile);
            return updatedProfile;
        },
        addFavoriteCity: async (city: string) => {
            if (!user) throw new Error('No user logged in');
            return await addFavoriteCity(user.id, city);
        },
        removeFavoriteCity: async (city: string) => {
            if (!user) throw new Error('No user logged in');
            return await removeFavoriteCity(user.id, city);
        },
        resendConfirmation,
        refreshProfile: () => {
            if (user) {
                loadUserProfile(user.id);
            }
        }
    };
};
