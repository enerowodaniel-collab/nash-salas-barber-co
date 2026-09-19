import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Appointment = {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  appointment_date: string;
  appointment_time: string;
  notes?: string;
  status: string;
  created_at: string;
};
