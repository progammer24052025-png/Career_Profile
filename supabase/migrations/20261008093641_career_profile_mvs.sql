alter table public.profiles
  add column if not exists university text,
  add column if not exists degree text,
  add column if not exists branch text,
  add column if not exists academic_achievements text,
  add column if not exists academic_year text,
  add column if not exists current_semester smallint check (current_semester between 1 and 12),
  add column if not exists graduation_year smallint,
  add column if not exists target_career text,
  add column if not exists github_profile_url text;

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

alter table public.student_skills enable row level security;
alter table public.student_projects enable row level security;

create policy "Students manage their own skills" on public.student_skills
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Students manage their own projects" on public.student_projects
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

grant select, insert, update, delete on public.student_skills to authenticated;
grant select, insert, update, delete on public.student_projects to authenticated;

create trigger set_student_skills_updated_at before update on public.student_skills
  for each row execute function public.set_updated_at();
create trigger set_student_projects_updated_at before update on public.student_projects
  for each row execute function public.set_updated_at();
