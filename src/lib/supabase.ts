import { createClient } from "@supabase/supabase-js";

export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://esrjlxkijpplvpugchin.supabase.co";
export const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVzcmpseGtpanBwbHZwdWdjaGluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk4MjYyMTcsImV4cCI6MjEwNTQwMjIxN30.NFsumPm2Nd4vWowg2BwwMq4mPHMVl_xFcQT6wFhGsnE";

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
