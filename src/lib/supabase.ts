import { createClient } from "@supabase/supabase-js";

export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://yjkswkeuwzbrlfmrzxob.supabase.co";
export const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlqa3N3a2V1d3picmxmbXJ6eG9iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk4NDc1MjMsImV4cCI6MjEwNTQyMzUyM30.Y_sIYNYzwO7hn2APSKyfg0cDQmZY_uedI_HQhpr17FA";

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
