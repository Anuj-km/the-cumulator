"use client";

import { useEffect, useState } from "react";

type Artist = {
  id: number;
  name: string;
  image: string;
};

type Album = {
  id: number;
  name: string;
  artist: string;
  cover: string;
};

type Song = {
  id: number;
  name: string;
  artist: string;
  album: string;
  cover: string;
};

type MusicData = {
  artists: Artist[];
  albums: Album[];
  songs: Song[];
};

type ArtistResult = {
  artistId: string;
  artistName: string;
  artworkUrl100?: string;
};

type AlbumResult = {
  collectionId: number;
  collectionName: string;
  artistName: string;
  artworkUrl100?: string;
};

type SongResult = {
  trackId: number;
  trackName: string;
  artistName: string;
  collectionName?: string;
  artworkUrl100?: string;
};

export default function Music() {
  const [music, setMusic] = useState<MusicData>({
    artists: [],
    albums: [],
    songs: [],
  });

  const [showArtistSearch, setShowArtistSearch] = useState(false);
  const [showAlbumSearch, setShowAlbumSearch] = useState(false);
  const [showSongSearch, setShowSongSearch] = useState(false);

  const [artistQuery, setArtistQuery] = useState("");
  const [albumQuery, setAlbumQuery] = useState("");
  const [songQuery, setSongQuery] = useState("");

  const [artistResults, setArtistResults] = useState<ArtistResult[]>([]);
  const [albumResults, setAlbumResults] = useState<AlbumResult[]>([]);
  const [songResults, setSongResults] = useState<SongResult[]>([]);

  const [searchingArtists, setSearchingArtists] = useState(false);
  const [searchingAlbums, setSearchingAlbums] = useState(false);
  const [searchingSongs, setSearchingSongs] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("cumulator_music");

    if (saved) {
      setMusic(JSON.parse(saved));
    }
  }, []);

  function saveMusic(updated: MusicData) {
    setMusic(updated);
    localStorage.setItem("cumulator_music", JSON.stringify(updated));
  }

  // -------------------------
  // ARTISTS
  // -------------------------

  async function searchArtists() {
    if (!artistQuery.trim()) return;

    setSearchingArtists(true);

    try {
      const response = await fetch(
        `/api/music/search?query=${encodeURIComponent(artistQuery)}`
      );

      const data = await response.json();

      const uniqueArtists: ArtistResult[] = [];
      const seen = new Set<string>();

      for (const result of data.results || []) {
        if (
          result.artistId &&
          result.artistName &&
          !seen.has(result.artistId)
        ) {
          seen.add(result.artistId);

          uniqueArtists.push({
            artistId: result.artistId,
            artistName: result.artistName,
            artworkUrl100: result.artworkUrl100,
          });
        }
      }

      setArtistResults(uniqueArtists);
    } catch {
      setArtistResults([]);
    }

    setSearchingArtists(false);
  }

  function addArtist(artist: ArtistResult) {
    const alreadyExists = music.artists.some(
      (item) =>
        item.name.toLowerCase() === artist.artistName.toLowerCase()
    );

    if (alreadyExists) {
      closeArtistSearch();
      return;
    }

    const newArtist: Artist = {
      id: Date.now(),
      name: artist.artistName,
      image: artist.artworkUrl100
        ? artist.artworkUrl100.replace("100x100", "600x600")
        : "",
    };

    saveMusic({
      ...music,
      artists: [...music.artists, newArtist],
    });

    closeArtistSearch();
  }

  function removeArtist(id: number) {
    saveMusic({
      ...music,
      artists: music.artists.filter((artist) => artist.id !== id),
    });
  }

  function closeArtistSearch() {
    setShowArtistSearch(false);
    setArtistQuery("");
    setArtistResults([]);
  }

  // -------------------------
  // ALBUMS
  // -------------------------

  async function searchAlbums() {
    if (!albumQuery.trim()) return;

    setSearchingAlbums(true);

    try {
      const response = await fetch(
        `/api/music/search?query=${encodeURIComponent(albumQuery)}`
      );

      const data = await response.json();

      const uniqueAlbums: AlbumResult[] = [];
      const seen = new Set<number>();

      for (const result of data.results || []) {
        if (
          result.collectionId &&
          result.collectionName &&
          !seen.has(result.collectionId)
        ) {
          seen.add(result.collectionId);

          uniqueAlbums.push({
            collectionId: result.collectionId,
            collectionName: result.collectionName,
            artistName: result.artistName,
            artworkUrl100: result.artworkUrl100,
          });
        }
      }

      setAlbumResults(uniqueAlbums);
    } catch {
      setAlbumResults([]);
    }

    setSearchingAlbums(false);
  }

  function addAlbum(album: AlbumResult) {
    const alreadyExists = music.albums.some(
      (item) =>
        item.name.toLowerCase() ===
        album.collectionName.toLowerCase()
    );

    if (alreadyExists) {
      closeAlbumSearch();
      return;
    }

    const newAlbum: Album = {
      id: Date.now(),
      name: album.collectionName,
      artist: album.artistName,
      cover: album.artworkUrl100
        ? album.artworkUrl100.replace("100x100", "600x600")
        : "",
    };

    saveMusic({
      ...music,
      albums: [...music.albums, newAlbum],
    });

    closeAlbumSearch();
  }

  function removeAlbum(id: number) {
    saveMusic({
      ...music,
      albums: music.albums.filter((album) => album.id !== id),
    });
  }

  function closeAlbumSearch() {
    setShowAlbumSearch(false);
    setAlbumQuery("");
    setAlbumResults([]);
  }

  // -------------------------
  // SONGS
  // -------------------------

  async function searchSongs() {
    if (!songQuery.trim()) return;

    setSearchingSongs(true);

    try {
      const response = await fetch(
        `/api/music/search?query=${encodeURIComponent(songQuery)}`
      );

      const data = await response.json();

      const uniqueSongs: SongResult[] = [];
      const seen = new Set<number>();

      for (const result of data.results || []) {
        if (
          result.trackId &&
          result.trackName &&
          !seen.has(result.trackId)
        ) {
          seen.add(result.trackId);

          uniqueSongs.push({
            trackId: result.trackId,
            trackName: result.trackName,
            artistName: result.artistName,
            collectionName: result.collectionName,
            artworkUrl100: result.artworkUrl100,
          });
        }
      }

      setSongResults(uniqueSongs);
    } catch {
      setSongResults([]);
    }

    setSearchingSongs(false);
  }

  function addSong(song: SongResult) {
    const alreadyExists = music.songs.some(
      (item) =>
        item.name.toLowerCase() === song.trackName.toLowerCase() &&
        item.artist.toLowerCase() === song.artistName.toLowerCase()
    );

    if (alreadyExists) {
      closeSongSearch();
      return;
    }

    const newSong: Song = {
      id: Date.now(),
      name: song.trackName,
      artist: song.artistName,
      album: song.collectionName || "",
      cover: song.artworkUrl100
        ? song.artworkUrl100.replace("100x100", "600x600")
        : "",
    };

    saveMusic({
      ...music,
      songs: [...music.songs, newSong],
    });

    closeSongSearch();
  }

  function removeSong(id: number) {
    saveMusic({
      ...music,
      songs: music.songs.filter((song) => song.id !== id),
    });
  }

  function closeSongSearch() {
    setShowSongSearch(false);
    setSongQuery("");
    setSongResults([]);
  }

  return (
    <main className="min-h-screen px-8 py-8">

      {/* HEADER */}

      <header className="flex items-center justify-between">

        <a
          href="/"
          className="text-sm text-gray-500 transition hover:text-white"
        >
          ← Home
        </a>

        <h1
          className="text-4xl"
          style={{ fontFamily: "var(--font-bungee)" }}
        >
          Music
        </h1>

        <div />

      </header>

      {/* INTRO */}

      <section className="mx-auto mt-20 max-w-6xl">

        <p className="text-sm uppercase tracking-[0.3em] text-gray-600">
          My Taste
        </p>

        <h2 className="mt-4 text-5xl font-medium">
          What I listen to.
        </h2>

        <p className="mt-4 max-w-xl text-gray-500">
          The artists, albums, and songs that make up my taste.
        </p>

      </section>

      {/* ARTISTS */}

      <section className="mx-auto mt-20 max-w-6xl">

        <div className="flex items-center justify-between">

          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-gray-600">
              Artists
            </p>

            <h2 className="mt-2 text-2xl font-medium">
              Artists I Like
            </h2>
          </div>

          <button
            onClick={() => setShowArtistSearch(true)}
            className="rounded-full border border-white/10 px-5 py-2 text-sm text-gray-400 transition hover:bg-white hover:text-black"
          >
            + Add Artist
          </button>

        </div>

        {music.artists.length > 0 ? (

          <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">

            {music.artists.map((artist) => (

              <div
                key={artist.id}
                className="group"
              >

                <div className="relative aspect-square overflow-hidden rounded-full border border-white/10 bg-white/[0.04]">

                  {artist.image ? (
                    <img
                      src={artist.image}
                      alt={artist.name}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-gray-700">
                      ♪
                    </div>
                  )}

                  <button
                    onClick={() => removeArtist(artist.id)}
                    className="absolute right-2 top-2 rounded-full bg-black/80 px-2 py-1 text-sm text-gray-400 opacity-0 transition group-hover:opacity-100 hover:text-red-400"
                  >
                    ×
                  </button>

                </div>

                <h3 className="mt-3 truncate text-center font-medium">
                  {artist.name}
                </h3>

              </div>

            ))}

          </div>

        ) : (

          <p className="mt-8 text-gray-600">
            No artists added yet.
          </p>

        )}

      </section>

      {/* ALBUMS */}

      <section className="mx-auto mt-24 max-w-6xl">

        <div className="flex items-center justify-between">

          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-gray-600">
              Albums
            </p>

            <h2 className="mt-2 text-2xl font-medium">
              Albums I Love
            </h2>
          </div>

          <button
            onClick={() => setShowAlbumSearch(true)}
            className="rounded-full border border-white/10 px-5 py-2 text-sm text-gray-400 transition hover:bg-white hover:text-black"
          >
            + Add Album
          </button>

        </div>

        {music.albums.length > 0 ? (

          <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">

            {music.albums.map((album) => (

              <div
                key={album.id}
                className="group"
              >

                <div className="relative aspect-square overflow-hidden rounded-xl border border-white/10 bg-white/[0.04]">

                  {album.cover ? (
                    <img
                      src={album.cover}
                      alt={album.name}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-gray-700">
                      Album
                    </div>
                  )}

                  <button
                    onClick={() => removeAlbum(album.id)}
                    className="absolute right-3 top-3 rounded-full bg-black/80 px-2 py-1 text-sm text-gray-400 opacity-0 transition group-hover:opacity-100 hover:text-red-400"
                  >
                    ×
                  </button>

                </div>

                <h3 className="mt-3 truncate font-medium">
                  {album.name}
                </h3>

                <p className="mt-1 truncate text-sm text-gray-500">
                  {album.artist}
                </p>

              </div>

            ))}

          </div>

        ) : (

          <p className="mt-8 text-gray-600">
            No albums added yet.
          </p>

        )}

      </section>

      {/* SONGS */}

      <section className="mx-auto mt-24 max-w-6xl pb-20">

        <div className="flex items-center justify-between">

          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-gray-600">
              Songs
            </p>

            <h2 className="mt-2 text-2xl font-medium">
              Songs I Like
            </h2>
          </div>

          <button
            onClick={() => setShowSongSearch(true)}
            className="rounded-full border border-white/10 px-5 py-2 text-sm text-gray-400 transition hover:bg-white hover:text-black"
          >
            + Add Song
          </button>

        </div>

        {music.songs.length > 0 ? (

          <div className="mt-8 divide-y divide-white/10 border-y border-white/10">

            {music.songs.map((song) => (

              <div
                key={song.id}
                className="group flex items-center gap-5 py-4"
              >

                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-white/[0.04]">

                  {song.cover ? (
                    <img
                      src={song.cover}
                      alt={song.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-gray-700">
                      ♪
                    </div>
                  )}

                </div>

                <div className="min-w-0 flex-1">

                  <h3 className="truncate font-medium">
                    {song.name}
                  </h3>

                  <p className="truncate text-sm text-gray-500">
                    {song.artist}
                    {song.album && ` • ${song.album}`}
                  </p>

                </div>

                <button
                  onClick={() => removeSong(song.id)}
                  className="text-gray-700 opacity-0 transition group-hover:opacity-100 hover:text-red-400"
                >
                  ×
                </button>

              </div>

            ))}

          </div>

        ) : (

          <p className="mt-8 text-gray-600">
            No songs added yet.
          </p>

        )}

      </section>

      {/* ARTIST MODAL */}

      {showArtistSearch && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-6">

          <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-[#121212] p-6 shadow-2xl">

            <div className="flex items-center justify-between">

              <h2 className="text-2xl font-medium">
                Add Artist
              </h2>

              <button
                onClick={closeArtistSearch}
                className="text-2xl text-gray-600 transition hover:text-white"
              >
                ×
              </button>

            </div>

            <div className="mt-6 flex gap-3">

              <input
                autoFocus
                value={artistQuery}
                onChange={(e) => setArtistQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") searchArtists();
                }}
                placeholder="Search for an artist..."
                className="flex-1 rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-white outline-none placeholder:text-gray-600 focus:border-white/25"
              />

              <button
                onClick={searchArtists}
                disabled={searchingArtists}
                className="rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition hover:bg-gray-200 disabled:opacity-50"
              >
                {searchingArtists ? "..." : "Search"}
              </button>

            </div>

            <div className="mt-6 max-h-[50vh] space-y-2 overflow-y-auto">

              {artistResults.map((artist) => (

                <button
                  key={artist.artistId}
                  onClick={() => addArtist(artist)}
                  className="flex w-full items-center gap-4 rounded-xl p-3 text-left transition hover:bg-white/[0.06]"
                >

                  {artist.artworkUrl100 ? (
                    <img
                      src={artist.artworkUrl100}
                      alt={artist.artistName}
                      className="h-14 w-14 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/[0.05] text-gray-600">
                      ♪
                    </div>
                  )}

                  <div className="flex-1">
                    <p className="font-medium">
                      {artist.artistName}
                    </p>
                  </div>

                  <span className="text-gray-600">
                    +
                  </span>

                </button>

              ))}

              {!searchingArtists &&
                artistQuery &&
                artistResults.length === 0 && (
                  <p className="py-8 text-center text-sm text-gray-600">
                    No artists found.
                  </p>
                )}

            </div>

          </div>

        </div>

      )}

      {/* ALBUM MODAL */}

      {showAlbumSearch && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-6">

          <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-[#121212] p-6 shadow-2xl">

            <div className="flex items-center justify-between">

              <h2 className="text-2xl font-medium">
                Add Album
              </h2>

              <button
                onClick={closeAlbumSearch}
                className="text-2xl text-gray-600 transition hover:text-white"
              >
                ×
              </button>

            </div>

            <div className="mt-6 flex gap-3">

              <input
                autoFocus
                value={albumQuery}
                onChange={(e) => setAlbumQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") searchAlbums();
                }}
                placeholder="Search for an album..."
                className="flex-1 rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-white outline-none placeholder:text-gray-600 focus:border-white/25"
              />

              <button
                onClick={searchAlbums}
                disabled={searchingAlbums}
                className="rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition hover:bg-gray-200 disabled:opacity-50"
              >
                {searchingAlbums ? "..." : "Search"}
              </button>

            </div>

            <div className="mt-6 max-h-[50vh] space-y-2 overflow-y-auto">

              {albumResults.map((album) => (

                <button
                  key={album.collectionId}
                  onClick={() => addAlbum(album)}
                  className="flex w-full items-center gap-4 rounded-xl p-3 text-left transition hover:bg-white/[0.06]"
                >

                  {album.artworkUrl100 ? (
                    <img
                      src={album.artworkUrl100}
                      alt={album.collectionName}
                      className="h-16 w-16 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-white/[0.05] text-gray-600">
                      ♪
                    </div>
                  )}

                  <div className="min-w-0 flex-1">

                    <p className="truncate font-medium">
                      {album.collectionName}
                    </p>

                    <p className="mt-1 truncate text-sm text-gray-500">
                      {album.artistName}
                    </p>

                  </div>

                  <span className="text-gray-600">
                    +
                  </span>

                </button>

              ))}

              {!searchingAlbums &&
                albumQuery &&
                albumResults.length === 0 && (
                  <p className="py-8 text-center text-sm text-gray-600">
                    No albums found.
                  </p>
                )}

            </div>

          </div>

        </div>

      )}

      {/* SONG MODAL */}

      {showSongSearch && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-6">

          <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-[#121212] p-6 shadow-2xl">

            <div className="flex items-center justify-between">

              <h2 className="text-2xl font-medium">
                Add Song
              </h2>

              <button
                onClick={closeSongSearch}
                className="text-2xl text-gray-600 transition hover:text-white"
              >
                ×
              </button>

            </div>

            <div className="mt-6 flex gap-3">

              <input
                autoFocus
                value={songQuery}
                onChange={(e) => setSongQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") searchSongs();
                }}
                placeholder="Search for a song..."
                className="flex-1 rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-white outline-none placeholder:text-gray-600 focus:border-white/25"
              />

              <button
                onClick={searchSongs}
                disabled={searchingSongs}
                className="rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition hover:bg-gray-200 disabled:opacity-50"
              >
                {searchingSongs ? "..." : "Search"}
              </button>

            </div>

            <div className="mt-6 max-h-[50vh] space-y-2 overflow-y-auto">

              {songResults.map((song) => (

                <button
                  key={song.trackId}
                  onClick={() => addSong(song)}
                  className="flex w-full items-center gap-4 rounded-xl p-3 text-left transition hover:bg-white/[0.06]"
                >

                  {song.artworkUrl100 ? (
                    <img
                      src={song.artworkUrl100}
                      alt={song.trackName}
                      className="h-16 w-16 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-white/[0.05] text-gray-600">
                      ♪
                    </div>
                  )}

                  <div className="min-w-0 flex-1">

                    <p className="truncate font-medium">
                      {song.trackName}
                    </p>

                    <p className="mt-1 truncate text-sm text-gray-500">
                      {song.artistName}
                      {song.collectionName &&
                        ` • ${song.collectionName}`}
                    </p>

                  </div>

                  <span className="text-gray-600">
                    +
                  </span>

                </button>

              ))}

              {!searchingSongs &&
                songQuery &&
                songResults.length === 0 && (
                  <p className="py-8 text-center text-sm text-gray-600">
                    No songs found.
                  </p>
                )}

            </div>

          </div>

        </div>

      )}

    </main>
  );
}