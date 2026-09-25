create table public.bardsinexile_songs (
  id uuid not null default gen_random_uuid (),
  song_catalog_id integer not null,
  song_status integer not null default 0,
  song_title text not null,
  song_track_number integer null,
  song_duration_sec integer null,
  song_bie_comments text null,
  song_origin_legacy text null,
  song_type_legacy text null,
  song_author_legacy text null,
  song_date_info text null,
  song_youtube_link text null,
  song_musicsheet_link text null,
  song_sources jsonb null default '[]'::jsonb,
  song_image_gallery text[] not null default '{}'::text[],
  song_artist text null,
  author_id uuid null,
  created_at timestamp with time zone not null default now(),
  edited_at timestamp with time zone not null default now(),
  song_collection_legacy text null,
  constraint bardsinexile_songs_pkey primary key (id),
  constraint bardsinexile_songs_song_catalog_id_key unique (song_catalog_id),
  constraint bardsinexile_songs_author_id_fkey foreign KEY (author_id) references auth.users (id) on delete set null,
  constraint bardsinexile_songs_song_sources_check check ((jsonb_typeof(song_sources) = 'array'::text)),
  constraint bardsinexile_songs_status_check check ((song_status = any (array[0, 1, 2, 3, 4])))
) TABLESPACE pg_default;

create trigger bardsinexile_songs_edited_at_trigger BEFORE
update on bardsinexile_songs for EACH row
execute FUNCTION bardsinexile_songs_set_edited_at ();
