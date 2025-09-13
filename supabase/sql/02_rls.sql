alter table public.profiles enable row level security;
alter table public.posts enable row level security;
alter table public.comments enable row level security;
alter table public.playlists enable row level security;
alter table public.gigs enable row level security;

-- Authenticated users can select all public data
create policy "Read all public data" on public.profiles for select using (true);
create policy "Read all posts" on public.posts for select using (true);
create policy "Read all comments" on public.comments for select using (true);
create policy "Read all playlists" on public.playlists for select using (true);
create policy "Read all gigs" on public.gigs for select using (true);

-- Insert/update own profile
create policy "Insert own profile" on public.profiles for insert with check (auth.uid() = user_id);
create policy "Update own profile" on public.profiles for update using (auth.uid() = user_id);

-- Write rules
create policy "Insert posts if authed" on public.posts for insert with check (auth.uid() is not null);
create policy "Insert comments if authed" on public.comments for insert with check (auth.uid() is not null);
