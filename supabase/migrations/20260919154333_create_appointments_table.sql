/*
# Create appointments table

1. New Tables
- `appointments`
  - `id` (uuid, primary key)
  - `name` (text, not null) — customer's full name
  - `email` (text, not null) — customer's email
  - `phone` (text, not null) — customer's phone number
  - `service` (text, not null) — type of haircut/service requested
  - `appointment_date` (date, not null) — requested date
  - `appointment_time` (text, not null) — requested time slot
  - `notes` (text) — optional notes from customer
  - `status` (text, default 'pending') — booking status
  - `created_at` (timestamptz, default now())
2. Security
- Enable RLS on `appointments`.
- Allow anon + authenticated INSERT (customers booking without signing in).
- Allow anon + authenticated SELECT (so booking list could be shown).
*/

CREATE TABLE IF NOT EXISTS appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  service text NOT NULL,
  appointment_date date NOT NULL,
  appointment_time text NOT NULL,
  notes text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_appointments" ON appointments;
CREATE POLICY "anon_insert_appointments"
ON appointments FOR INSERT
TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_select_appointments" ON appointments;
CREATE POLICY "anon_select_appointments"
ON appointments FOR SELECT
TO anon, authenticated USING (true);
