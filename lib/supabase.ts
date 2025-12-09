import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database Types
export interface Registration {
  id: string;
  full_name: string;
  guest_name: string;
  email: string;
  staff_email: string;
  qr_code_data: string;
  created_at: string;
}

export type RegistrationInsert = Omit<Registration, 'id' | 'created_at'>;

// Helper functions
export const createRegistration = async (
  data: RegistrationInsert
): Promise<{ data: Registration | null; error: Error | null }> => {
  try {
    const { data: registration, error } = await supabase
      .from('registrations')
      .insert([data])
      .select()
      .single();

    if (error) throw error;

    return { data: registration, error: null };
  } catch (error) {
    console.error('Error creating registration:', error);
    return { data: null, error: error as Error };
  }
};

export const getRegistrationById = async (
  id: string
): Promise<{ data: Registration | null; error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('registrations')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('Error fetching registration:', error);
    return { data: null, error: error as Error };
  }
};

export const getRegistrationByEmail = async (
  email: string
): Promise<{ data: Registration | null; error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('registrations')
      .select('*')
      .eq('email', email)
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('Error fetching registration:', error);
    return { data: null, error: error as Error };
  }
};