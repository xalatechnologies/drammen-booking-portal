
import { SimpleRepository } from './repositories/SimpleRepository';
import { supabase } from '@/integrations/supabase/client';

interface User {
  id: string;
  email: string;
  name: string;
  locale?: string;
  created_at?: string;
  updated_at?: string;
}

export class UserRepository extends SimpleRepository {
  constructor() {
    super('app_users');
  }

  async findByEmail(email: string) {
    try {
      const { data, error } = await supabase
        .from('app_users')
        .select('*')
        .eq('email', email.toLowerCase())
        .maybeSingle();

      if (error) {
        return { data: null, error: error.message };
      }

      return { data: data as User | null, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  }
}

export const userRepository = new UserRepository();
