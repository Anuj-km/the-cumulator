"use client";

import { useState } from "react";

type Show = {
  id: number;
  name: string;
  first_air_date?: string;
  poster_path?: string | null;
  overview?: string;
};

export default function AddShow() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Show[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedShow, setSelectedShow] = useState<Show | null>(null);

  const [rating, setRating] = useState(0);
  const [status, setStatus] = useState("WATCHED");
  const [dateWatched, setDateWatched] = useState("");
  const [review, setReview] = useState("");
  const [favorite, setFavorite] = useState(false);

  async function searchShows() {
    if (!query.trim()) return;

    setLoading(true);

    try {
      const response = await fetch(
        `/api/shows/search?query=${encodeURIComponent(query)}`
      );

      const data = await response.json();

      setResults(data.results || []);
    } catch (error) {
      console.error("Show search failed:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  function selectShow(show: Show) {
    setSelectedShow(show);
    setResults([]);
    setQuery(show.name);
  }

  function addShow() {
    if (!selectedShow) return;

    const show = {
      id: Date.now(),
      tmdbId: selectedShow.id,
      title: selectedShow.name,
      year: selectedShow.first_air_date
        ? selectedShow.first_air_date.slice(0, 4)
        : "Unknown",
      poster: selectedShow.poster_path
        ? `https://image.tmdb.org/t/p/w500${selectedShow.poster_path}`
        : null,
      rating,
      status,
      dateWatched,
      review,
      favorite,
    };

    const existingShows = JSON.parse(
      localStorage.getItem("cumulator_shows") || "[]"
    );

    localStorage.setItem(
      "cumulator_shows",
      JSON.stringify([...existingShows, show])
    );

    window.location.href = "/shows";
  }

  return (
    <main className="min-h-screen px-8 py-8">

      {/* Header */}
      <header className="flex items-center justify-between">
        <a
          href="/shows"
          className="text-sm text-gray-500 transition hover:text-white"
        >
          ← Back to Shows
        </a>

        <h1
          className="text-3xl"
          style={{ fontFamily: "var(--font-bungee)" }}
        >
          Add Show
        </h1>

        <div className="w-24" />
      </header>

      <section className="mx-auto mt-16 max-w-4xl">

        {/* Search */}
        {!selectedShow && (
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-gray-500">
              Find a show
            </p>

            <div className="mt-4 flex gap-3">
              <input
                type="text"
                placeholder="Search for a show..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    searchShows();
                  }
                }}
                className="flex-1 rounded-xl border border-white/10 bg-white/[0.04] px-5 py-4 text-white outline-none placeholder:text-gray-600 focus:border-white/30"
              />

              <button
                onClick={searchShows}
                disabled={loading}
                className="rounded-xl bg-white px-6 py-4 text-sm font-medium text-black transition hover:bg-gray-200 disabled:opacity-50"
              >
                {loading ? "Searching..." : "Search"}
              </button>
            </div>
          </div>
        )}

        {/* Search Results */}
        {results.length > 0 && (
          <section className="mt-10">
            <p className="mb-5 text-sm text-gray-500">
              Search results
            </p>

            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4">
              {results.map((show) => {
                const year = show.first_air_date
                  ? show.first_air_date.slice(0, 4)
                  : "Unknown";

                return (
                  <button
                    key={show.id}
                    onClick={() => selectShow(show)}
                    className="group text-left"
                  >
                    <div className="aspect-[2/3] overflow-hidden rounded-xl border border-white/10 bg-white/[0.04] transition group-hover:border-white/30">
                      {show.poster_path ? (
                        <img
                          src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
                          alt={show.name}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-sm text-gray-600">
                          No poster
                        </div>
                      )}
                    </div>

                    <h3 className="mt-3 truncate text-sm font-medium">
                      {show.name}
                    </h3>

                    <p className="mt-1 text-xs text-gray-500">
                      {year}
                    </p>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* Selected Show */}
        {selectedShow && (
          <section className="mt-4">

            <button
              onClick={() => setSelectedShow(null)}
              className="mb-8 text-sm text-gray-500 transition hover:text-white"
            >
              ← Choose another show
            </button>

            <div className="flex gap-6">

              {/* Poster */}
              <div className="w-40 shrink-0 overflow-hidden rounded-xl border border-white/10">
                {selectedShow.poster_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w500${selectedShow.poster_path}`}
                    alt={selectedShow.name}
                    className="w-full"
                  />
                ) : (
                  <div className="flex aspect-[2/3] items-center justify-center text-xs text-gray-600">
                    No poster
                  </div>
                )}
              </div>

              {/* Info */}
              <div>
                <h2 className="text-3xl font-medium">
                  {selectedShow.name}
                </h2>

                <p className="mt-2 text-gray-500">
                  {selectedShow.first_air_date?.slice(0, 4) || "Unknown"}
                </p>

                {selectedShow.overview && (
                  <p className="mt-5 max-w-xl text-sm leading-6 text-gray-500">
                    {selectedShow.overview}
                  </p>
                )}
              </div>

            </div>

            {/* Form */}
            <div className="mt-12 space-y-8 border-t border-white/10 pt-10">

              {/* Rating */}
              <div>
                <label className="text-sm text-gray-400">
                  Your rating
                </label>

                <div className="mt-3 flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className={`text-3xl transition ${
                        star <= rating
                          ? "text-white"
                          : "text-gray-700 hover:text-gray-400"
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="text-sm text-gray-400">
                  Status
                </label>

                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="mt-3 block w-full rounded-xl border border-white/10 bg-[#121212] px-4 py-3 text-white outline-none focus:border-white/30"
                >
                  <option value="WATCHED">Watched</option>
                  <option value="WANT_TO_WATCH">Want to Watch</option>
                  <option value="CURRENTLY_WATCHING">
                    Currently Watching
                  </option>
                </select>
              </div>

              {/* Date */}
              <div>
                <label className="text-sm text-gray-400">
                  Date watched
                </label>

                <input
                  type="date"
                  value={dateWatched}
                  onChange={(e) => setDateWatched(e.target.value)}
                  className="mt-3 block w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none focus:border-white/30"
                />
              </div>

              {/* Review */}
              <div>
                <label className="text-sm text-gray-400">
                  Review
                </label>

                <textarea
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  placeholder="What did you think?"
                  rows={5}
                  className="mt-3 block w-full resize-none rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none placeholder:text-gray-600 focus:border-white/30"
                />
              </div>

              {/* Favorite */}
              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={favorite}
                  onChange={(e) => setFavorite(e.target.checked)}
                  className="h-4 w-4"
                />

                <span className="text-sm text-gray-400">
                  Add to favorites
                </span>
              </label>

              {/* Add */}
              <button
                onClick={addShow}
                className="w-full rounded-xl bg-white px-6 py-4 font-medium text-black transition hover:bg-gray-200"
              >
                Add Show to Cumulator
              </button>

            </div>
          </section>
        )}

      </section>
    </main>
  );
}