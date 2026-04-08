-- Add new columns to profiles
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS phone text,
  ADD COLUMN IF NOT EXISTS approved boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS must_change_password boolean NOT NULL DEFAULT true;

-- Admin users are always approved
UPDATE profiles SET approved = true, must_change_password = false WHERE role = 'admin';

-- Requests table (pedir música / feedback / atendimento)
CREATE TABLE IF NOT EXISTS requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  user_email text,
  user_name text,
  type text NOT NULL CHECK (type IN ('music','feedback','atendimento')),
  message text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','done')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can insert their own requests" ON requests FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view their own requests" ON requests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all requests" ON requests FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Song edits table
CREATE TABLE IF NOT EXISTS song_edits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  song_idx integer NOT NULL,
  song_title text,
  edited_cifra text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, song_idx)
);

ALTER TABLE song_edits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage their own edits" ON song_edits FOR ALL USING (auth.uid() = user_id);
