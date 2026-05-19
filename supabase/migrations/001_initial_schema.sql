create extension if not exists "pgcrypto";

create type public.app_role as enum ('admin', 'room_leader', 'member');
create type public.duty_status as enum ('not_started', 'waiting_proof', 'completed');
create type public.attendance_status as enum ('present', 'absent');
create type public.notification_type as enum ('duty_reminder', 'duty_completed', 'proof_uploaded', 'attendance_updated', 'system');

create table public.rooms (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  code text not null unique,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null unique,
  role public.app_role not null default 'member',
  phone text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.room_members (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.rooms(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role public.app_role not null default 'member',
  is_active boolean not null default true,
  joined_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (room_id, user_id)
);

create table public.duty_schedules (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.rooms(id) on delete cascade,
  day_of_week smallint not null check (day_of_week between 0 and 6),
  title text not null,
  note text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.duty_schedule_members (
  id uuid primary key default gen_random_uuid(),
  schedule_id uuid not null references public.duty_schedules(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (schedule_id, user_id)
);

create table public.duty_tasks (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.rooms(id) on delete cascade,
  schedule_id uuid references public.duty_schedules(id) on delete set null,
  duty_date date not null,
  title text not null,
  note text,
  status public.duty_status not null default 'not_started',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (room_id, schedule_id, duty_date)
);

create table public.duty_task_members (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.duty_tasks(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  status public.duty_status not null default 'not_started',
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (task_id, user_id)
);

create table public.duty_proofs (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.rooms(id) on delete cascade,
  duty_task_id uuid not null references public.duty_tasks(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  storage_path text not null unique,
  public_url text not null,
  mime_type text not null,
  file_size integer not null check (file_size > 0),
  created_at timestamptz not null default now()
);

create table public.attendance (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.rooms(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  attendance_date date not null,
  status public.attendance_status not null,
  absent_address text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (room_id, user_id, attendance_date),
  constraint attendance_absent_address_required check (status = 'present' or nullif(trim(absent_address), '') is not null)
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.rooms(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  actor_id uuid references public.profiles(id) on delete set null,
  type public.notification_type not null default 'system',
  title text not null,
  message text not null,
  href text,
  metadata jsonb not null default '{}'::jsonb,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index idx_room_members_room on public.room_members(room_id) where is_active = true;
create index idx_room_members_user on public.room_members(user_id) where is_active = true;
create index idx_duty_schedules_room_day on public.duty_schedules(room_id, day_of_week) where is_active = true;
create index idx_duty_tasks_room_date on public.duty_tasks(room_id, duty_date);
create index idx_duty_task_members_task_user on public.duty_task_members(task_id, user_id);
create index idx_duty_proofs_room_created on public.duty_proofs(room_id, created_at desc);
create index idx_duty_proofs_task on public.duty_proofs(duty_task_id);
create index idx_attendance_room_date on public.attendance(room_id, attendance_date);
create index idx_notifications_room_created on public.notifications(room_id, created_at desc);
create index idx_notifications_user_read on public.notifications(user_id, read_at);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_rooms_updated_at before update on public.rooms for each row execute function public.set_updated_at();
create trigger set_profiles_updated_at before update on public.profiles for each row execute function public.set_updated_at();
create trigger set_room_members_updated_at before update on public.room_members for each row execute function public.set_updated_at();
create trigger set_duty_schedules_updated_at before update on public.duty_schedules for each row execute function public.set_updated_at();
create trigger set_duty_tasks_updated_at before update on public.duty_tasks for each row execute function public.set_updated_at();
create trigger set_duty_task_members_updated_at before update on public.duty_task_members for each row execute function public.set_updated_at();
create trigger set_attendance_updated_at before update on public.attendance for each row execute function public.set_updated_at();

create or replace function public.prevent_self_role_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if coalesce(current_setting('request.jwt.claims', true)::jsonb ->> 'role', '') = 'service_role' then
    return new;
  end if;

  if auth.uid() = old.id and old.role is distinct from new.role then
    raise exception 'Không được tự đổi vai trò của chính mình.';
  end if;

  return new;
end;
$$;

create trigger prevent_self_role_change before update on public.profiles for each row execute function public.prevent_self_role_change();

create or replace function public.is_room_member(target_room_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.room_members rm
    where rm.room_id = target_room_id
      and rm.user_id = auth.uid()
      and rm.is_active = true
  );
$$;

create or replace function public.room_role(target_room_id uuid)
returns public.app_role
language sql
security definer
set search_path = public
stable
as $$
  select rm.role
  from public.room_members rm
  where rm.room_id = target_room_id
    and rm.user_id = auth.uid()
    and rm.is_active = true
  limit 1;
$$;

create or replace function public.can_manage_room(target_room_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select public.room_role(target_room_id) in ('admin', 'room_leader');
$$;

alter table public.rooms enable row level security;
alter table public.profiles enable row level security;
alter table public.room_members enable row level security;
alter table public.duty_schedules enable row level security;
alter table public.duty_schedule_members enable row level security;
alter table public.duty_tasks enable row level security;
alter table public.duty_task_members enable row level security;
alter table public.duty_proofs enable row level security;
alter table public.attendance enable row level security;
alter table public.notifications enable row level security;

create policy "rooms_select_own" on public.rooms for select using (public.is_room_member(id));
create policy "rooms_admin_update" on public.rooms for update using (public.room_role(id) = 'admin') with check (public.room_role(id) = 'admin');

create policy "profiles_select_same_room" on public.profiles for select using (
  id = auth.uid()
  or exists (
    select 1
    from public.room_members mine
    join public.room_members other_member on other_member.room_id = mine.room_id
    where mine.user_id = auth.uid()
      and mine.is_active = true
      and other_member.user_id = profiles.id
      and other_member.is_active = true
  )
);
create policy "profiles_update_self_no_role_guard" on public.profiles for update using (id = auth.uid()) with check (id = auth.uid());

create policy "room_members_select_own_room" on public.room_members for select using (public.is_room_member(room_id));
create policy "room_members_admin_insert" on public.room_members for insert with check (public.room_role(room_id) = 'admin');
create policy "room_members_admin_update" on public.room_members for update using (public.room_role(room_id) = 'admin') with check (public.room_role(room_id) = 'admin');

create policy "duty_schedules_select_room" on public.duty_schedules for select using (public.is_room_member(room_id));
create policy "duty_schedules_admin_write" on public.duty_schedules for all using (public.room_role(room_id) = 'admin') with check (public.room_role(room_id) = 'admin');

create policy "duty_schedule_members_select_room" on public.duty_schedule_members for select using (
  exists (select 1 from public.duty_schedules ds where ds.id = duty_schedule_members.schedule_id and public.is_room_member(ds.room_id))
);
create policy "duty_schedule_members_admin_write" on public.duty_schedule_members for all using (
  exists (select 1 from public.duty_schedules ds where ds.id = duty_schedule_members.schedule_id and public.room_role(ds.room_id) = 'admin')
) with check (
  exists (select 1 from public.duty_schedules ds where ds.id = duty_schedule_members.schedule_id and public.room_role(ds.room_id) = 'admin')
);

create policy "duty_tasks_select_room" on public.duty_tasks for select using (public.is_room_member(room_id));
create policy "duty_tasks_admin_write" on public.duty_tasks for all using (public.room_role(room_id) = 'admin') with check (public.room_role(room_id) = 'admin');

create policy "duty_task_members_select_room" on public.duty_task_members for select using (
  exists (select 1 from public.duty_tasks dt where dt.id = duty_task_members.task_id and public.is_room_member(dt.room_id))
);
create policy "duty_task_members_admin_write" on public.duty_task_members for all using (
  exists (select 1 from public.duty_tasks dt where dt.id = duty_task_members.task_id and public.room_role(dt.room_id) = 'admin')
) with check (
  exists (select 1 from public.duty_tasks dt where dt.id = duty_task_members.task_id and public.room_role(dt.room_id) = 'admin')
);

create policy "duty_proofs_select_room" on public.duty_proofs for select using (public.is_room_member(room_id));
create policy "duty_proofs_insert_own" on public.duty_proofs for insert with check (user_id = auth.uid() and public.is_room_member(room_id));
create policy "duty_proofs_delete_own_or_admin" on public.duty_proofs for delete using (user_id = auth.uid() or public.room_role(room_id) = 'admin');

create policy "attendance_select_room" on public.attendance for select using (public.is_room_member(room_id));
create policy "attendance_upsert_self" on public.attendance for insert with check (user_id = auth.uid() and public.is_room_member(room_id));
create policy "attendance_update_self" on public.attendance for update using (user_id = auth.uid() and public.is_room_member(room_id)) with check (user_id = auth.uid());

create policy "notifications_select_room_target" on public.notifications for select using (
  public.is_room_member(room_id)
  and (user_id is null or user_id = auth.uid())
);
create policy "notifications_insert_member" on public.notifications for insert with check (public.is_room_member(room_id));
create policy "notifications_update_own_read" on public.notifications for update using (
  public.is_room_member(room_id)
  and (user_id is null or user_id = auth.uid())
) with check (
  public.is_room_member(room_id)
  and (user_id is null or user_id = auth.uid())
);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('duty-proofs', 'duty-proofs', false, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "storage_duty_proofs_read_room" on storage.objects for select using (
  bucket_id = 'duty-proofs'
  and public.is_room_member((storage.foldername(name))[1]::uuid)
);

create policy "storage_duty_proofs_insert_own_room" on storage.objects for insert with check (
  bucket_id = 'duty-proofs'
  and public.is_room_member((storage.foldername(name))[1]::uuid)
  and auth.uid()::text = (storage.foldername(name))[3]
);

create policy "storage_duty_proofs_delete_own_or_admin" on storage.objects for delete using (
  bucket_id = 'duty-proofs'
  and (
    auth.uid()::text = (storage.foldername(name))[3]
    or public.room_role((storage.foldername(name))[1]::uuid) = 'admin'
  )
);
