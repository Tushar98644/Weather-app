import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "Supabase configuration missing. Authentication features will be disabled."
  );
}

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

export interface UserProfile {
  id: string;
  email: string;
  favorite_cities: string[];
  temperature_unit: "celsius" | "fahrenheit";
  created_at: string;
  updated_at: string;
}

export class SupabaseService {
  static async signUp(email: string, password: string) {
    if (!supabase) throw new Error("Supabase not configured");

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;
    return data;
  }

  static async signIn(email: string, password: string) {
    if (!supabase) throw new Error("Supabase not configured");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  }

  static async signOut() {
    if (!supabase) throw new Error("Supabase not configured");

    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  static async getCurrentUser() {
    if (!supabase) return null;

    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user;
  }

  static async getUserProfile(userId: string): Promise<UserProfile | null> {
    if (!supabase) return null;

    const { data, error } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      if (error.code === "PGRST116") return null; // No rows returned
      throw error;
    }

    return data;
  }

  static async updateUserProfile(
    userId: string,
    updates: Partial<UserProfile>
  ) {
    if (!supabase) throw new Error("Supabase not configured");

    const { data, error } = await supabase
      .from("user_profiles")
      .upsert({
        id: userId,
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async addFavoriteCity(userId: string, city: string) {
    if (!supabase) throw new Error("Supabase not configured");

    const profile = await this.getUserProfile(userId);
    const currentFavorites = profile?.favorite_cities || [];

    if (!currentFavorites.includes(city)) {
      const updatedFavorites = [...currentFavorites, city];
      await this.updateUserProfile(userId, {
        favorite_cities: updatedFavorites,
      });
    }
  }

  static async removeFavoriteCity(userId: string, city: string) {
    if (!supabase) throw new Error("Supabase not configured");

    const profile = await this.getUserProfile(userId);
    const currentFavorites = profile?.favorite_cities || [];

    const updatedFavorites = currentFavorites.filter((c) => c !== city);
    await this.updateUserProfile(userId, { favorite_cities: updatedFavorites });
  }
}
