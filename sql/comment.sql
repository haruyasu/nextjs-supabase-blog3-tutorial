-- commentsテーブル作成
create table comments (
  id uuid not null default uuid_generate_v4() primary key,
  profile_id uuid references public.profiles on delete cascade not null,
  blog_id uuid references public.blogs on delete cascade not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- commentsテーブルRLS設定
alter table comments enable row level security;
create policy "誰でも参照可能" on comments for select using ( true );
create policy "認証時に追加可能" on comments for insert with check ( auth.role() = 'authenticated' );
create policy "自身のコメントを更新" on comments for update using (auth.uid() = profile_id);
create policy "自身のコメントを削除" on comments for delete using (auth.uid() = profile_id);

-- likesテーブル作成
create table likes (
  id uuid not null default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  comment_id uuid references public.comments on delete cascade not null
);

-- likesテーブルRLS設定
alter table likes enable row level security;
create policy "誰でも参照可能" on likes for select using ( true );
create policy "認証時に追加可能" on likes for insert with check ( auth.role() = 'authenticated' );
create policy "自身のいいねを更新" on likes for update using (auth.uid() = user_id);
create policy "自身のいいねを削除" on likes for delete using (auth.uid() = user_id);
