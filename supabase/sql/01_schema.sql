-- Users/Profile
create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  created_at timestamptz default now()
);

-- Posts (example – align with your UI data fetches)
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid references public.profiles(id) on delete set null,
  title text,
  body text,
  created_at timestamptz default now()
);

-- Comments
create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references public.posts(id) on delete cascade,
  author_id uuid references public.profiles(id) on delete set null,
  body text,
  created_at timestamptz default now()
);

-- Playlists / Gigs (skeleton)
create table if not exists public.playlists (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  url text,
  created_at timestamptz default now()
);

create table if not exists public.gigs (
  id uuid primary key default gen_random_uuid(),
  artist text,
  venue text,
  city text,
  date date,
  created_at timestamptz default now()
);
