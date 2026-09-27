"use client";

import { useEffect, useState } from "react";

type SavedShow = {
  id: number;
  tmdbId: number;
  title: string;
  year: string;
  poster: string | null;
  rating: number;
  status: string;
  dateWatched: string;
  review: string;
  favorite: boolean;
};

type Filter =
  | "ALL"
  | "WATCHED"
  | "WANT_TO_WATCH"
  | "CURRENTLY_WATCHING"
  | "FAVORITES";

type Sort = "RECENT" | "TITLE" | "RATING" | "YEAR";

export default function Shows() {
  const [shows, setShows] = useState<SavedShow[]>([]);
  const [filter, setFilter] = useState<Filter>("ALL");
  const [sort, setSort] = useState<Sort>("RECENT");

  useEffect(() => {
    const savedShows = JSON.parse(
      localStorage.getItem("cumulator_shows") || "[]"
    );

    setShows(savedShows);
  }, []);

  const filteredShows = shows
    .filter((show) => {
      if (filter === "ALL") return true;

      if (filter === "FAVORITES") {
        return show.favorite;
      }

      return show.status === filter;
    })
    .sort((a, b) => {
      if (sort === "TITLE") {
        return a.title.localeCompare(b.title);
      }

      if (sort === "RATING") {
        return b.rating - a.rating;
      }

      if (sort === "YEAR") {
        return Number(b.year) - Number(a.year);
      }

      return b.id - a.id;
    });

  return (
    <main className="min-h-screen px-8 py-8">

      {/* Header */}
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
          Shows
        </h1>

        <a
          href="/shows/add"
          className="rounded-full border border-white/15 px-5 py-3 text-sm transition hover:bg-white hover:text-black"
        >
          + Add Show
        </a>
      </header>

      {/* Empty State */}
      {shows.length === 0 && (
        <section className="mx-auto mt-32 max-w-xl text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-gray-600">
            Your library is empty
          </p>

          <h2 className="mt-5 text-4xl font-medium">
            Start adding shows.
          </h2>

          <p className="mt-4 text-gray-500">
            Search TMDB and build your TV history.
          </p>

          <a
            href="/shows/add"
            className="mt-8 inline-block rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition hover:bg-gray-200"
          >
            Add your first show
          </a>
        </section>
      )}

      {/* Shows Library */}
      {shows.length > 0 && (
        <section className="mx-auto mt-16 max-w-6xl">

          {/* Filters + Sort */}
          <div className="flex flex-col gap-5 border-b border-white/10 pb-6 md:flex-row md:items-center md:justify-between">

            <div className="flex flex-wrap gap-2">
              {[
                ["ALL", "All"],
                ["WATCHED", "Watched"],
                ["WANT_TO_WATCH", "Want to Watch"],
                ["CURRENTLY_WATCHING", "Currently Watching"],
                ["FAVORITES", "Favorites"],
              ].map(([value, label]) => (
                <button
                  key={value}
                  onClick={() => setFilter(value as Filter)}
                  className={`rounded-full px-4 py-2 text-sm transition ${
                    filter === value
                      ? "bg-white text-black"
                      : "border border-white/10 text-gray-500 hover:text-white"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              className="rounded-full border border-white/10 bg-[#121212] px-4 py-2 text-sm text-gray-400 outline-none"
            >
              <option value="RECENT">Recently Added</option>
              <option value="TITLE">Title</option>
              <option value="RATING">Rating</option>
              <option value="YEAR">Year</option>
            </select>
          </div>

          {/* Count */}
          <p className="mt-8 text-sm text-gray-600">
            {filteredShows.length}{" "}
            {filteredShows.length === 1 ? "show" : "shows"}
          </p>

          {/* Grid */}
          {filteredShows.length > 0 ? (
            <div className="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">

              {filteredShows.map((show) => (
                <a
                  key={show.id}
                  href={`/shows/${show.id}`}
                  className="group block"
                >
                  {/* Poster */}
                  <div className="aspect-[2/3] overflow-hidden rounded-xl border border-white/10 bg-white/[0.04] transition group-hover:border-white/25">
                    {show.poster ? (
                      <img
                        src={show.poster}
                        alt={show.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-gray-600">
                        No poster
                      </div>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="mt-3 truncate font-medium">
                    {show.title}
                  </h3>

                  {/* Year + Rating */}
                  <div className="mt-1 flex items-center justify-between text-sm text-gray-500">
                    <span>{show.year}</span>

                    {show.rating > 0 && (
                      <span>
                        ★ {show.rating}/5
                      </span>
                    )}
                  </div>

                  {/* Favorite */}
                  {show.favorite && (
                    <p className="mt-2 text-xs text-gray-500">
                      ♥ Favorite
                    </p>
                  )}
                </a>
              ))}

            </div>
          ) : (
            <div className="py-24 text-center">
              <p className="text-gray-500">
                No shows match this filter.
              </p>
            </div>
          )}
        </section>
      )}
    </main>
  );
}