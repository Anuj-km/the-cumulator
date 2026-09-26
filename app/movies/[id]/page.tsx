"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type SavedMovie = {
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

export default function MovieDetails() {
  const params = useParams();

  const [movie, setMovie] = useState<SavedMovie | null>(null);
  const [editing, setEditing] = useState(false);

  const [rating, setRating] = useState(0);
  const [status, setStatus] = useState("");
  const [dateWatched, setDateWatched] = useState("");
  const [review, setReview] = useState("");
  const [favorite, setFavorite] = useState(false);

  useEffect(() => {
    const savedMovies: SavedMovie[] = JSON.parse(
      localStorage.getItem("cumulator_movies") || "[]"
    );

    const foundMovie = savedMovies.find(
      (item) => item.id.toString() === params.id
    );

    if (foundMovie) {
      setMovie(foundMovie);
      setRating(foundMovie.rating);
      setStatus(foundMovie.status);
      setDateWatched(foundMovie.dateWatched);
      setReview(foundMovie.review);
      setFavorite(foundMovie.favorite);
    }
  }, [params.id]);

  if (!movie) {
    return (
      <main className="min-h-screen px-8 py-8">
        <a
          href="/movies"
          className="text-sm text-gray-500 transition hover:text-white"
        >
          ← Back to Movies
        </a>

        <div className="mt-32 text-center">
          <h1 className="text-3xl font-medium">
            Movie not found
          </h1>

          <p className="mt-3 text-gray-500">
            This movie doesn't exist in your library.
          </p>
        </div>
      </main>
    );
  }

  function saveChanges() {
    const savedMovies: SavedMovie[] = JSON.parse(
      localStorage.getItem("cumulator_movies") || "[]"
    );

    const updatedMovies = savedMovies.map((item) =>
      item.id === movie.id
        ? {
            ...item,
            rating,
            status,
            dateWatched,
            review,
            favorite,
          }
        : item
    );

    localStorage.setItem(
      "cumulator_movies",
      JSON.stringify(updatedMovies)
    );

    setMovie({
      ...movie,
      rating,
      status,
      dateWatched,
      review,
      favorite,
    });

    setEditing(false);
  }

  function deleteMovie() {
    const savedMovies: SavedMovie[] = JSON.parse(
      localStorage.getItem("cumulator_movies") || "[]"
    );

    const updatedMovies = savedMovies.filter(
      (item) => item.id !== movie.id
    );

    localStorage.setItem(
      "cumulator_movies",
      JSON.stringify(updatedMovies)
    );

    window.location.href = "/movies";
  }

  const statusLabels: Record<string, string> = {
    WATCHED: "Watched",
    WANT_TO_WATCH: "Want to Watch",
    CURRENTLY_WATCHING: "Currently Watching",
  };

  return (
    <main className="min-h-screen px-8 py-8">

      {/* Header */}
      <header className="flex items-center justify-between">
        <a
          href="/movies"
          className="text-sm text-gray-500 transition hover:text-white"
        >
          ← Back to Movies
        </a>

        <h1
          className="text-3xl"
          style={{ fontFamily: "var(--font-bungee)" }}
        >
          Movie
        </h1>

        <div className="flex gap-4">
          <button
            onClick={() => setEditing(!editing)}
            className="text-sm text-gray-400 transition hover:text-white"
          >
            {editing ? "Cancel" : "Edit"}
          </button>

          <button
            onClick={deleteMovie}
            className="text-sm text-gray-600 transition hover:text-red-400"
          >
            Delete
          </button>
        </div>
      </header>

      {/* Movie */}
      <section className="mx-auto mt-20 max-w-5xl">

        <div className="flex flex-col gap-10 md:flex-row">

          {/* Poster */}
          <div className="w-full shrink-0 md:w-72">
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]">
              {movie.poster ? (
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="w-full"
                />
              ) : (
                <div className="flex aspect-[2/3] items-center justify-center text-gray-600">
                  No poster
                </div>
              )}
            </div>
          </div>

          {/* Information */}
          <div className="flex-1">

            <div className="flex items-start justify-between gap-6">
              <div>
                <h2 className="text-5xl font-semibold tracking-tight">
                  {movie.title}
                </h2>

                <p className="mt-3 text-gray-500">
                  {movie.year}
                </p>
              </div>

              {movie.favorite && !editing && (
                <span className="rounded-full border border-white/10 px-4 py-2 text-sm text-gray-400">
                  ♥ Favorite
                </span>
              )}
            </div>

            {editing ? (
              /* EDIT MODE */
              <div className="mt-10 space-y-8">

                {/* Rating */}
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-gray-600">
                    Your Rating
                  </p>

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
                  <label className="text-xs uppercase tracking-[0.25em] text-gray-600">
                    Status
                  </label>

                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="mt-3 block w-full rounded-xl border border-white/10 bg-[#121212] px-4 py-3 text-white outline-none"
                  >
                    <option value="WATCHED">Watched</option>
                    <option value="WANT_TO_WATCH">
                      Want to Watch
                    </option>
                    <option value="CURRENTLY_WATCHING">
                      Currently Watching
                    </option>
                  </select>
                </div>

                {/* Date */}
                <div>
                  <label className="text-xs uppercase tracking-[0.25em] text-gray-600">
                    Date Watched
                  </label>

                  <input
                    type="date"
                    value={dateWatched}
                    onChange={(e) => setDateWatched(e.target.value)}
                    className="mt-3 block w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none"
                  />
                </div>

                {/* Review */}
                <div>
                  <label className="text-xs uppercase tracking-[0.25em] text-gray-600">
                    Your Review
                  </label>

                  <textarea
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    rows={5}
                    className="mt-3 block w-full resize-none rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none"
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
                    Favorite
                  </span>
                </label>

                {/* Save */}
                <button
                  onClick={saveChanges}
                  className="w-full rounded-xl bg-white px-6 py-4 font-medium text-black transition hover:bg-gray-200"
                >
                  Save Changes
                </button>
              </div>
            ) : (
              /* VIEW MODE */
              <>
                {/* Rating */}
                <div className="mt-10">
                  <p className="text-xs uppercase tracking-[0.25em] text-gray-600">
                    Your Rating
                  </p>

                  <p className="mt-3 text-3xl">
                    {movie.rating > 0
                      ? `★ ${movie.rating}/5`
                      : "Not rated"}
                  </p>
                </div>

                {/* Status */}
                <div className="mt-8">
                  <p className="text-xs uppercase tracking-[0.25em] text-gray-600">
                    Status
                  </p>

                  <p className="mt-3 text-lg text-gray-300">
                    {statusLabels[movie.status] || movie.status}
                  </p>
                </div>

                {/* Date */}
                {movie.dateWatched && (
                  <div className="mt-8">
                    <p className="text-xs uppercase tracking-[0.25em] text-gray-600">
                      Watched
                    </p>

                    <p className="mt-3 text-lg text-gray-300">
                      {movie.dateWatched}
                    </p>
                  </div>
                )}

                {/* Review */}
                {movie.review && (
                  <div className="mt-10 border-t border-white/10 pt-8">
                    <p className="text-xs uppercase tracking-[0.25em] text-gray-600">
                      Your Review
                    </p>

                    <p className="mt-4 max-w-2xl whitespace-pre-wrap text-lg leading-8 text-gray-400">
                      {movie.review}
                    </p>
                  </div>
                )}
              </>
            )}

          </div>
        </div>
      </section>
    </main>
  );
}