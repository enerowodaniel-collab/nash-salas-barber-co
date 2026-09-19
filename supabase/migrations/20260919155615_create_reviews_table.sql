/*
# Create reviews table and seed initial reviews

1. New Tables
- `reviews`
  - `id` (uuid, primary key)
  - `author_name` (text, not null) — name of the reviewer
  - `rating` (integer, not null, 1-5) — star rating
  - `comment` (text, not null) — review text
  - `service` (text) — which service they got
  - `created_at` (timestamptz, default now())
2. Security
- Enable RLS on `reviews`.
- Allow anon + authenticated SELECT (public reviews visible to all visitors).
3. Seed Data
- 6 realistic reviews with varied ratings and authors.
*/

CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_name text NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text NOT NULL,
  service text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_reviews" ON reviews;
CREATE POLICY "anon_select_reviews"
ON reviews FOR SELECT
TO anon, authenticated USING (true);

INSERT INTO reviews (author_name, rating, comment, service) VALUES
  ('Marcus T.', 5, 'Best cut of my life. Nash took his time and nailed the fade perfectly. Already booked my next one.', 'Skin Fade'),
  ('Diego R.', 5, 'Dude is an artist with the clippers. Walked in looking rough, walked out feeling like a million bucks.', 'Cut & Beard Combo'),
  ('James L.', 4, 'Solid haircut, great conversation. Only wish the wait was a little shorter but worth it.', 'Classic Cut'),
  ('Andre W.', 5, 'My go-to barber now. The hot towel shave is unreal — never had a smoother one.', 'Hot Towel Shave'),
  ('Chris M.', 5, 'Brought my son in for his first real haircut and Nash made it fun for him. Kid loved it.', 'Kids Cut'),
  ('Tyler B.', 4, 'Clean cut, fair price. The beard sculpt was on point. Will be back for sure.', 'Beard Sculpt')
ON CONFLICT DO NOTHING;
