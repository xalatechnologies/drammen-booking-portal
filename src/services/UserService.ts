
import { supabase } from "@/integrations/supabase/client";

export interface User {
  id: string;
  name: string;
  email: string;
  locale: string;
  created_at: string;
}

export class UserService {
  static async getUsers(): Promise<User[]> {
    try {
      const { data, error } = await supabase
        .from('app_users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw new Error(error.message);
      return data || [];
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  }

  static async getUserById(id: string): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from('app_users')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw new Error(error.message);
      return data;
    } catch (error) {
      console.error('Error fetching user:', error);
      return null;
    }
  }

  static async createUser(userData: Partial<User>): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from('app_users')
        .insert(userData)
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data;
    } catch (error) {
      console.error('Error creating user:', error);
      return null;
    }
  }

  static async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from('app_users')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data;
    } catch (error) {
      console.error('Error updating user:', error);
      return null;
    }
  }

  static async deleteUser(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('app_users')
        .delete()
        .eq('id', id);

      if (error) throw new Error(error.message);
      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      return false;
    }
  }
}
