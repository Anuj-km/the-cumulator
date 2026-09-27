"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type GameResult = {
  id: number;
  name: string;
  released: string | null;
  background_image: string | null;
};

export default function AddGame() {
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GameResult[]>([]);
  const [selectedGame, setSelectedGame] = useState<GameResult | null>(null);

  const [rating, setRating] = useState(0);
  const [status, setStatus] = useState("PLAYED");
  const [datePlayed, setDatePlayed] = useState("");
  const [review, setReview] = useState("");
  const [favorite, setFavorite] = useState(false);

  const [loading, setLoading] = useState(false);

  async function searchGames() {
    if (!query.trim()) return;

    setLoading(true);

    try {
      const response = await fetch(
        `/api/games/search?query=${encodeURIComponent(query)}`
      );

      const data = await response.json();

      setResults(data.results || []);
    } catch {
      setResults([]);
    }

    setLoading(false);
  }

  function selectGame(game: GameResult) {
    setSelectedGame(game);
    setResults([]);
  }

  function saveGame() {
    if (!selectedGame) return;

    const existingGames = JSON.parse(
      localStorage.getItem("cumulator_games") || "[]"
    );

    const newGame = {
      id: Date.now(),
      rawgId: selectedGame.id,
      title: selectedGame.name,
      year: selectedGame.released
        ? selectedGame.released.slice(0, 4)
        : "Unknown",
      poster: selectedGame.background_image || null,
      rating,
      status,
      datePlayed,
      review,
      favorite,
    };

    localStorage.setItem(
      "cumulator_games",
      JSON.stringify([...existingGames, newGame])
    );

    router.push("/games");
  }

  return (
    <main className="min-h-screen px-8 py-8">

      {/* Header */}
      <header className="flex items-center justify-between">
        <a
          href="/games"
          className="text-sm text-gray-500 transition hover:text-white"
        >
          ← Games
        </a>

        <h1
          className="text-4xl"
          style={{ fontFamily: "var(--font-bungee)" }}
        >
          Add Game
        </h1>

        <div />
      </header>

      <section className="mx-auto mt-16 max-w-3xl">

        {/* Search */}
        {!selectedGame && (
          <>
            <div className="flex gap-3">

              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    searchGames();
                  }
                }}
                placeholder="Search for a game..."
                className="flex-1 rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-white outline-none placeholder:text-gray-600 focus:border-white/25"
              />

              <button
                onClick={searchGames}
                disabled={loading}
                className="rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition hover:bg-gray-200 disabled:opacity-50"
              >
                {loading ? "Searching..." : "Search"}
              </button>

            </div>

            {/* Results */}
            {results.length > 0 && (
              <div className="mt-8 space-y-3">

                {results.map((game) => (
                  <button
                    key={game.id}
                    onClick={() => selectGame(game)}
                    className="flex w-full items-center gap-5 rounded-xl border border-white/10 bg-white/[0.03] p-4 text-left transition hover:border-white/25 hover:bg-white/[0.06]"
                  >

                    {game.background_image ? (
                      <img
                        src={game.background_image}
                        alt={game.name}
                        className="h-24 w-16 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="flex h-24 w-16 items-center justify-center rounded-lg bg-white/[0.05] text-xs text-gray-600">
                        No image
                      </div>
                    )}

                    <div>
                      <h2 className="font-medium">
                        {game.name}
                      </h2>

                      <p className="mt-1 text-sm text-gray-500">
                        {game.released
                          ? game.released.slice(0, 4)
                          : "Release year unknown"}
                      </p>
                    </div>

                  </button>
                ))}

              </div>
            )}

            {query && !loading && results.length === 0 && (
              <p className="mt-8 text-center text-gray-600">
                No games found.
              </p>
            )}
          </>
        )}

        {/* Selected Game */}
        {selectedGame && (
          <div>

            <div className="flex gap-6 border-b border-white/10 pb-8">

              {selectedGame.background_image && (
                <img
                  src={selectedGame.background_image}
                  alt={selectedGame.name}
                  className="h-56 w-40 rounded-xl object-cover"
                />
              )}

              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-gray-600">
                  Selected Game
                </p>

                <h2 className="mt-3 text-3xl font-medium">
                  {selectedGame.name}
                </h2>

                <p className="mt-2 text-gray-500">
                  {selectedGame.released
                    ? selectedGame.released.slice(0, 4)
                    : "Release year unknown"}
                </p>

                <button
                  onClick={() => setSelectedGame(null)}
                  className="mt-6 text-sm text-gray-500 transition hover:text-white"
                >
                  ← Choose another game
                </button>
              </div>

            </div>

            {/* Rating */}
            <div className="mt-8">

              <label className="text-sm text-gray-500">
                Rating
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
            <div className="mt-8">

              <label className="text-sm text-gray-500">
                Status
              </label>

              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="mt-3 w-full rounded-xl border border-white/10 bg-[#121212] px-4 py-3 text-white outline-none"
              >
                <option value="PLAYED">Played</option>
                <option value="WANT_TO_PLAY">Want to Play</option>
                <option value="CURRENTLY_PLAYING">
                  Currently Playing
                </option>
              </select>

            </div>

            {/* Date */}
            <div className="mt-8">

              <label className="text-sm text-gray-500">
                Date Played
              </label>

              <input
                type="date"
                value={datePlayed}
                onChange={(e) => setDatePlayed(e.target.value)}
                className="mt-3 w-full rounded-xl border border-white/10 bg-[#121212] px-4 py-3 text-white outline-none"
              />

            </div>

            {/* Review */}
            <div className="mt-8">

              <label className="text-sm text-gray-500">
                Review
              </label>

              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="What did you think?"
                rows={5}
                className="mt-3 w-full resize-none rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none placeholder:text-gray-600 focus:border-white/25"
              />

            </div>

            {/* Favorite */}
            <label className="mt-8 flex cursor-pointer items-center gap-3 text-sm text-gray-400">

              <input
                type="checkbox"
                checked={favorite}
                onChange={(e) => setFavorite(e.target.checked)}
                className="h-4 w-4"
              />

              Add to favorites

            </label>

            {/* Save */}
            <button
              onClick={saveGame}
              className="mt-10 w-full rounded-full bg-white py-4 font-medium text-black transition hover:bg-gray-200"
            >
              Save Game
            </button>

          </div>
        )}

      </section>
    </main>
  );
}