/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { SupabaseService, type UserProfile, supabase } from '../services/supabaseService';

interface AuthContextType {
    user: User | null;
    profile: UserProfile | null;
    isLoading: boolean;
    signUp: (email: string, password: string) => Promise<void>;
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
    updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
    addFavoriteCity: (city: string) => Promise<void>;
    removeFavoriteCity: (city: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);

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
            async (_event, session) => {
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
    }, []);

    const loadUserProfile = async (userId: string) => {
        try {
            const userProfile = await SupabaseService.getUserProfile(userId);
            setProfile(userProfile);
        } catch (error) {
            console.error('Error loading user profile:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const signUp = async (email: string, password: string) => {
        await SupabaseService.signUp(email, password);
    };

    const signIn = async (email: string, password: string) => {
        await SupabaseService.signIn(email, password);
    };

    const signOut = async () => {
        await SupabaseService.signOut();
    };

    const updateProfile = async (updates: Partial<UserProfile>) => {
        if (!user) throw new Error('No user logged in');

        const updatedProfile = await SupabaseService.updateUserProfile(user.id, updates);
        setProfile(updatedProfile);
    };

    const addFavoriteCity = async (city: string) => {
        if (!user) throw new Error('No user logged in');

        await SupabaseService.addFavoriteCity(user.id, city);
        await loadUserProfile(user.id);
    };

    const removeFavoriteCity = async (city: string) => {
        if (!user) throw new Error('No user logged in');

        await SupabaseService.removeFavoriteCity(user.id, city);
        await loadUserProfile(user.id);
    };

    const value: AuthContextType = {
        user,
        profile,
        isLoading,
        signUp,
        signIn,
        signOut,
        updateProfile,
        addFavoriteCity,
        removeFavoriteCity,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}