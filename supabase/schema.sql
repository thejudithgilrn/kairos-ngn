create table profiles (
  id uuid references auth.users primary key,
  name text not null,
  email text not null,
  program text,
  nclex_date text,
  is_paid boolean default false,
  stripe_customer_id text,
  stripe_subscription_id text,
  created_at timestamptz default now()
);

create table question_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  session_id uuid not null,
  item_type text not null,
  cjmm_domain text not null,
  lasater_domain text not null,
  score integer not null,
  is_correct boolean not null,
  question_json jsonb,
  answer_json jsonb,
  feedback_json jsonb,
  created_at timestamptz default now()
);

create table sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  session_type text not null,
  cjmm_scores jsonb,
  lasater_scores jsonb,
  overall_level text,
  study_plan jsonb,
  completed_at timestamptz default now()
);

alter table profiles enable row level security;
alter table question_attempts enable row level security;
alter table sessions enable row level security;

create policy "profiles owner" on profiles
for all using (auth.uid() = id) with check (auth.uid() = id);

create policy "attempts owner" on question_attempts
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "sessions owner" on sessions
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
