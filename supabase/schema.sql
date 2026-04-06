-- Create custom extension for random UUID generation if needed
-- CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  credits integer DEFAULT 10,
  is_verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Shortcuts table
CREATE TABLE IF NOT EXISTS public.shortcuts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  share_slug text UNIQUE NOT NULL,
  title text NOT NULL CHECK (char_length(title) <= 100),
  description text CHECK (char_length(description) <= 500),
  content_json jsonb NOT NULL,
  is_public boolean DEFAULT false,
  creator_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  download_count integer DEFAULT 0,
  vote_count integer DEFAULT 0,
  version integer DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ForkRequests table
CREATE TYPE fork_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

CREATE TABLE IF NOT EXISTS public.fork_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_shortcut_id uuid REFERENCES public.shortcuts(id) ON DELETE CASCADE,
  requester_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  owner_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  status fork_status DEFAULT 'PENDING',
  created_at timestamptz DEFAULT now()
);

-- Notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  type text NOT NULL,
  message text NOT NULL,
  is_read boolean DEFAULT false,
  link text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shortcuts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fork_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Profiles: User can only read/update their own profile
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Shortcuts: Everyone can read 'is_public=true'. Only owner can UPDATE/DELETE.
CREATE POLICY "Everyone can view public shortcuts" ON public.shortcuts FOR SELECT USING (is_public = true OR auth.uid() = creator_id);
CREATE POLICY "Users can insert their own shortcuts" ON public.shortcuts FOR INSERT WITH CHECK (auth.uid() = creator_id);
CREATE POLICY "Users can update own shortcuts" ON public.shortcuts FOR UPDATE USING (auth.uid() = creator_id);
CREATE POLICY "Users can delete own shortcuts" ON public.shortcuts FOR DELETE USING (auth.uid() = creator_id);

-- ForkRequests: Owners and requesters can view
CREATE POLICY "Users can view relevant fork requests" ON public.fork_requests FOR SELECT USING (auth.uid() = requester_id OR auth.uid() = owner_id);
CREATE POLICY "Users can create fork requests" ON public.fork_requests FOR INSERT WITH CHECK (auth.uid() = requester_id);
CREATE POLICY "Owners can update fork requests" ON public.fork_requests FOR UPDATE USING (auth.uid() = owner_id);

-- Notifications: Users can view/update their own notifications
CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "System can insert notifications" ON public.notifications FOR INSERT WITH CHECK (true); -- keeping it open for triggers
