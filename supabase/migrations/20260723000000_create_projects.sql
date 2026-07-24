-- Phase 1: persistence for saved email projects/templates.
-- org_id is left nullable here; Phase 4 backfills it and makes it required
-- once the orgs/org_members tables exist, to avoid a second migration today.

create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) on delete cascade,
  org_id uuid,
  name text not null default 'Untitled project',
  html text not null default '',
  css text not null default '',
  target_client text not null default 'gmail',
  is_template boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists projects_owner_id_idx on projects (owner_id);

create table if not exists project_versions (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects (id) on delete cascade,
  html text not null,
  css text not null,
  created_at timestamptz not null default now()
);

create index if not exists project_versions_project_id_idx on project_versions (project_id);

-- Keep updated_at current on every write.
create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists projects_set_updated_at on projects;
create trigger projects_set_updated_at
  before update on projects
  for each row
  execute function set_updated_at();

alter table projects enable row level security;
alter table project_versions enable row level security;

create policy "Owners can select their projects"
  on projects for select
  using (auth.uid() = owner_id);

create policy "Owners can insert their projects"
  on projects for insert
  with check (auth.uid() = owner_id);

create policy "Owners can update their projects"
  on projects for update
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

create policy "Owners can delete their projects"
  on projects for delete
  using (auth.uid() = owner_id);

create policy "Owners can select versions of their projects"
  on project_versions for select
  using (
    exists (
      select 1 from projects
      where projects.id = project_versions.project_id
        and projects.owner_id = auth.uid()
    )
  );

create policy "Owners can insert versions of their projects"
  on project_versions for insert
  with check (
    exists (
      select 1 from projects
      where projects.id = project_versions.project_id
        and projects.owner_id = auth.uid()
    )
  );
