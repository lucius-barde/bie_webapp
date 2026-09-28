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


create table public.bardsinexile_lyrics (
  id uuid not null default gen_random_uuid (),
  main_lyrics text not null,
  main_lyrics_language character varying(8) not null,
  translation_one text null,
  translation_one_language character varying(8) null,
  translation_two text null,
  translation_two_language character varying(8) null,
  translation_three text null,
  translation_three_language character varying(8) null,
  created_at timestamp with time zone not null default now(),
  constraint bardsinexile_lyrics_pkey primary key (id),
  constraint translation_one_pair check (
    (
      (translation_one is null) = (translation_one_language is null)
    )
  ),
  constraint translation_three_pair check (
    (
      (translation_three is null) = (translation_three_language is null)
    )
  ),
  constraint translation_two_pair check (
    (
      (translation_two is null) = (translation_two_language is null)
    )
  )
) TABLESPACE pg_default;

create table public.bardsinexile_songs_have_lyrics (
  song_catalog_id integer not null,
  lyrics_id uuid not null,
  constraint bardsinexile_songs_have_lyrics_pkey primary key (song_catalog_id, lyrics_id),
  constraint one_lyrics_set_per_song unique (song_catalog_id),
  constraint songs_have_lyrics_lyrics_fk foreign KEY (lyrics_id) references bardsinexile_lyrics (id) on delete CASCADE,
  constraint songs_have_lyrics_song_fk foreign KEY (song_catalog_id) references bardsinexile_songs (song_catalog_id) on delete CASCADE
) TABLESPACE pg_default;

create index IF not exists bardsinexile_songs_have_lyrics_lyrics_id_idx on public.bardsinexile_songs_have_lyrics using btree (lyrics_id) TABLESPACE pg_default;
