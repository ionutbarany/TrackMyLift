-- TrackMyLift: per-user tables for routines, sessions, and progress (PR2).
-- Apply with Supabase CLI (`supabase db push`) or SQL editor on a hosted project.
-- Depends on: auth.users (Supabase Auth). No app code changes in this migration.

-- ---------------------------------------------------------------------------
-- Profiles (1:1 with auth.users; optional display name for later PRs)
-- ---------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  updated_at timestamptz not null default now()
);

comment on table public.profiles is 'App profile row created on signup; RLS: own row only.';

-- ---------------------------------------------------------------------------
-- Trigger: provision profile on new auth user
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id)
  values (new.id);
  return new;
end;
$$;

comment on function public.handle_new_user() is 'Fires after auth.users insert; creates public.profiles row.';

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute procedure public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Routines (mirrors src/types Routine; exercises stored as JSON array)
-- ---------------------------------------------------------------------------
create table public.routines (
  id text primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  description text,
  exercises jsonb not null default '[]'::jsonb,
  is_public boolean not null default false,
  created_at timestamptz not null default now()
);

create index routines_user_id_idx on public.routines (user_id);

comment on table public.routines is 'User-owned routines; exercises JSON matches Exercise[] in the app.';

-- ---------------------------------------------------------------------------
-- Sessions (mirrors Session; id may be non-UUID from legacy server builder)
-- ---------------------------------------------------------------------------
create table public.sessions (
  id text primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  routine_id text not null,
  routine_name text not null,
  workout_at timestamptz not null,
  notes text
);

create index sessions_user_id_workout_at_idx
  on public.sessions (user_id, workout_at desc);

comment on table public.sessions is 'Logged workouts; workout_at from ISO date string in the API.';

-- ---------------------------------------------------------------------------
-- Progress entries (mirrors ProgressEntry)
-- ---------------------------------------------------------------------------
create table public.progress_entries (
  id text primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  exercise_name text not null,
  weight double precision not null,
  reps integer not null,
  entry_at timestamptz not null
);

create index progress_entries_user_id_idx on public.progress_entries (user_id);
create index progress_entries_user_exercise_idx
  on public.progress_entries (user_id, lower(exercise_name));

comment on table public.progress_entries is 'Per-user strength log lines; entry_at from ISO date in the app.';

-- ---------------------------------------------------------------------------
-- Row level security
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.routines enable row level security;
alter table public.sessions enable row level security;
alter table public.progress_entries enable row level security;

-- profiles: read/update own row (insert handled by trigger)
create policy profiles_select_own
  on public.profiles for select
  to authenticated
  using (id = auth.uid());

create policy profiles_update_own
  on public.profiles for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

create policy profiles_insert_own
  on public.profiles for insert
  to authenticated
  with check (id = auth.uid());

-- routines
create policy routines_select_own
  on public.routines for select
  to authenticated
  using (user_id = auth.uid());

create policy routines_insert_own
  on public.routines for insert
  to authenticated
  with check (user_id = auth.uid());

create policy routines_update_own
  on public.routines for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy routines_delete_own
  on public.routines for delete
  to authenticated
  using (user_id = auth.uid());

-- sessions
create policy sessions_select_own
  on public.sessions for select
  to authenticated
  using (user_id = auth.uid());

create policy sessions_insert_own
  on public.sessions for insert
  to authenticated
  with check (user_id = auth.uid());

create policy sessions_update_own
  on public.sessions for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy sessions_delete_own
  on public.sessions for delete
  to authenticated
  using (user_id = auth.uid());

-- progress_entries
create policy progress_entries_select_own
  on public.progress_entries for select
  to authenticated
  using (user_id = auth.uid());

create policy progress_entries_insert_own
  on public.progress_entries for insert
  to authenticated
  with check (user_id = auth.uid());

create policy progress_entries_update_own
  on public.progress_entries for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy progress_entries_delete_own
  on public.progress_entries for delete
  to authenticated
  using (user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- Grants (authenticated client with anon key + JWT)
-- ---------------------------------------------------------------------------
grant select, insert, update, delete on public.routines to authenticated;
grant select, insert, update, delete on public.sessions to authenticated;
grant select, insert, update, delete on public.progress_entries to authenticated;
grant select, insert, update on public.profiles to authenticated;

-- Existing auth users (e.g. project already in use) get a profile row once.
insert into public.profiles (id)
select u.id
from auth.users u
where not exists (select 1 from public.profiles p where p.id = u.id);
