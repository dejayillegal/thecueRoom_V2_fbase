-- Buckets for assets and user content
insert into storage.buckets (id, name, public) values
  ('public-assets', 'public-assets', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public) values
  ('user-content', 'user-content', false)
on conflict (id) do nothing;
