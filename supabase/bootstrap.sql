-- Fresh Supabase project bootstrap for CareerProfile.
-- Paste this entire file into Supabase Dashboard > SQL Editor and run it once.

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $function$
begin
  new.updated_at := pg_catalog.now();
  return new;
end;
$function$;
revoke all on function public.set_updated_at() from public, anon, authenticated;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  university text,
  degree text,
  branch text,
  academic_achievements text,
  academic_year text,
  current_semester smallint check (current_semester between 1 and 12),
  graduation_year smallint,
  target_career text,
  github_profile_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.student_skills (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  skill_name text not null check (char_length(skill_name) between 1 and 80),
  category text not null default 'Technical' check (category in ('Technical', 'Soft')),
  proficiency smallint not null check (proficiency between 1 and 4),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.student_projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  project_name text not null check (char_length(project_name) between 1 and 160),
  description text not null default '',
  technologies text[] not null default '{}',
  academic_year text,
  semester smallint check (semester between 1 and 12),
  project_url text,
  source text not null default 'Manual' check (source in ('Manual', 'GitHub', 'Imported')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists student_skills_owner_idx on public.student_skills (user_id, skill_name);
create unique index if not exists student_skills_unique_name_idx on public.student_skills (user_id, lower(skill_name));
create index if not exists student_projects_owner_idx on public.student_projects (user_id, created_at desc);

alter table public.profiles enable row level security;
alter table public.student_skills enable row level security;
alter table public.student_projects enable row level security;

drop policy if exists "Students manage their own profile" on public.profiles;
create policy "Students manage their own profile" on public.profiles
  for all to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

drop policy if exists "Students manage their own skills" on public.student_skills;
create policy "Students manage their own skills" on public.student_skills
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "Students manage their own projects" on public.student_projects;
create policy "Students manage their own projects" on public.student_projects
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

grant select, insert, update, delete on public.profiles to authenticated;
grant select, insert, update, delete on public.student_skills to authenticated;
grant select, insert, update, delete on public.student_projects to authenticated;
revoke all on public.profiles, public.student_skills, public.student_projects from public, anon;

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

drop trigger if exists student_skills_updated_at on public.student_skills;
create trigger student_skills_updated_at
  before update on public.student_skills
  for each row execute function public.set_updated_at();

drop trigger if exists student_projects_updated_at on public.student_projects;
create trigger student_projects_updated_at
  before update on public.student_projects
  for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $function$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(
      nullif(new.raw_user_meta_data ->> 'full_name', ''),
      nullif(split_part(coalesce(new.email, ''), '@', 1), ''),
      'Student'
    )
  )
  on conflict (id) do nothing;
  return new;
end;
$function$;
revoke all on function public.handle_new_user() from public, anon, authenticated;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
