"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type SavedGame = {
  id: number;
  rawgId: number;
  title: string;
  year: string;
  poster: string | null;
  rating: number;
  status: string;
  datePlayed: string;
  review: string;
  favorite: boolean;
};

const statusLabels: Record<string, string> = {
  PLAYED: "Played",
  WANT_TO_PLAY: "Want to Play",
  CURRENTLY_PLAYING: "Currently Playing",
};

export default function GameDetails() {
  const params = useParams();
  const router = useRouter();

  const [game, setGame] = useState<SavedGame | null>(null);
  const [editing, setEditing] = useState(false);

  const [rating, setRating] = useState(0);
  const [status, setStatus] = useState("PLAYED");
  const [datePlayed, setDatePlayed] = useState("");
  const [review, setReview] = useState("");
  const [favorite, setFavorite] = useState(false);

  useEffect(() => {
    const savedGames = JSON.parse(
      localStorage.getItem("cumulator_games") || "[]"
    );

    const foundGame = savedGames.find(
      (item: SavedGame) => item.id.toString() === params.id
    );

    if (foundGame) {
      setGame(foundGame);
      setRating(foundGame.rating);
      setStatus(foundGame.status);
      setDatePlayed(foundGame.datePlayed);
      setReview(foundGame.review);
      setFavorite(foundGame.favorite);
    }
  }, [params.id]);

  function saveChanges() {
    if (!game) return;

    const savedGames: SavedGame[] = JSON.parse(
      localStorage.getItem("cumulator_games") || "[]"
    );

    const updatedGames = savedGames.map((item) => {
      if (item.id === game.id) {
        return {
          ...item,
          rating,
          status,
          datePlayed,
          review,
          favorite,
        };
      }

      return item;
    });

    localStorage.setItem(
      "cumulator_games",
      JSON.stringify(updatedGames)
    );

    setGame({
      ...game,
      rating,
      status,
      datePlayed,
      review,
      favorite,
    });

    setEditing(false);
  }

  function deleteGame() {
    if (!game) return;

    const confirmed = window.confirm(
      `Delete "${game.title}" from your library?`
    );

    if (!confirmed) return;

    const savedGames: SavedGame[] = JSON.parse(
      localStorage.getItem("cumulator_games") || "[]"
    );

    const updatedGames = savedGames.filter(
      (item) => item.id !== game.id
    );

    localStorage.setItem(
      "cumulator_games",
      JSON.stringify(updatedGames)
    );

    router.push("/games");
  }

  if (!game) {
    return (
      <main className="min-h-screen px-8 py-8">
        <a
          href="/games"
          className="text-sm text-gray-500 transition hover:text-white"
        >
          ← Games
        </a>

        <section className="mx-auto mt-32 max-w-xl text-center">
          <h1 className="text-3xl font-medium">
            Game not found.
          </h1>

          <p className="mt-4 text-gray-500">
            This game may have been deleted from your library.
          </p>
        </section>
      </main>
    );
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
          {editing ? "Edit Game" : "Game"}
        </h1>

        <div />
      </header>

      <section className="mx-auto mt-16 max-w-4xl">

        {/* Main Game Info */}
        <div className="flex flex-col gap-8 md:flex-row">

          {/* Cover */}
          <div className="w-full shrink-0 md:w-64">

            <div className="aspect-[2/3] overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]">

              {game.poster ? (
                <img
                  src={game.poster}
                  alt={game.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-gray-600">
                  No cover
                </div>
              )}

            </div>

          </div>

          {/* Details */}
          <div className="flex-1">

            <p className="text-sm uppercase tracking-[0.3em] text-gray-600">
              {game.year}
            </p>

            <h2 className="mt-3 text-4xl font-medium">
              {game.title}
            </h2>

            {/* Favorite */}
            {game.favorite && !editing && (
              <p className="mt-4 text-sm text-gray-500">
                ♥ Favorite
              </p>
            )}

            {!editing ? (

              <div className="mt-10 space-y-6">

                {/* Rating */}
                <div>
                  <p className="text-sm text-gray-600">
                    Rating
                  </p>

                  <p className="mt-2 text-xl">
                    {game.rating > 0
                      ? `★ ${game.rating}/5`
                      : "Not rated"}
                  </p>
                </div>

                {/* Status */}
                <div>
                  <p className="text-sm text-gray-600">
                    Status
                  </p>

                  <p className="mt-2">
                    {statusLabels[game.status] || game.status}
                  </p>
                </div>

                {/* Date */}
                {game.datePlayed && (
                  <div>
                    <p className="text-sm text-gray-600">
                      Date Played
                    </p>

                    <p className="mt-2">
                      {game.datePlayed}
                    </p>
                  </div>
                )}

                {/* Review */}
                <div>
                  <p className="text-sm text-gray-600">
                    Review
                  </p>

                  <p className="mt-2 whitespace-pre-wrap leading-7 text-gray-300">
                    {game.review || "No review added."}
                  </p>
                </div>

              </div>

            ) : (

              <div className="mt-10 space-y-8">

                {/* Rating */}
                <div>
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
                <div>
                  <label className="text-sm text-gray-500">
                    Status
                  </label>

                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="mt-3 w-full rounded-xl border border-white/10 bg-[#121212] px-4 py-3 text-white outline-none"
                  >
                    <option value="PLAYED">
                      Played
                    </option>

                    <option value="WANT_TO_PLAY">
                      Want to Play
                    </option>

                    <option value="CURRENTLY_PLAYING">
                      Currently Playing
                    </option>
                  </select>
                </div>

                {/* Date */}
                <div>
                  <label className="text-sm text-gray-500">
                    Date Played
                  </label>

                  <input
                    type="date"
                    value={datePlayed}
                    onChange={(e) =>
                      setDatePlayed(e.target.value)
                    }
                    className="mt-3 w-full rounded-xl border border-white/10 bg-[#121212] px-4 py-3 text-white outline-none"
                  />
                </div>

                {/* Review */}
                <div>
                  <label className="text-sm text-gray-500">
                    Review
                  </label>

                  <textarea
                    value={review}
                    onChange={(e) =>
                      setReview(e.target.value)
                    }
                    rows={6}
                    className="mt-3 w-full resize-none rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none placeholder:text-gray-600 focus:border-white/25"
                    placeholder="What did you think?"
                  />
                </div>

                {/* Favorite */}
                <label className="flex cursor-pointer items-center gap-3 text-sm text-gray-400">
                  <input
                    type="checkbox"
                    checked={favorite}
                    onChange={(e) =>
                      setFavorite(e.target.checked)
                    }
                    className="h-4 w-4"
                  />

                  Favorite
                </label>

              </div>
            )}

            {/* Buttons */}
            <div className="mt-12 flex flex-wrap gap-3">

              {!editing ? (
                <>
                  <button
                    onClick={() => setEditing(true)}
                    className="rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition hover:bg-gray-200"
                  >
                    Edit
                  </button>

                  <button
                    onClick={deleteGame}
                    className="rounded-full border border-red-500/20 px-6 py-3 text-sm text-red-400 transition hover:border-red-500/40 hover:text-red-300"
                  >
                    Delete
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={saveChanges}
                    className="rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition hover:bg-gray-200"
                  >
                    Save Changes
                  </button>

                  <button
                    onClick={() => {
                      setRating(game.rating);
                      setStatus(game.status);
                      setDatePlayed(game.datePlayed);
                      setReview(game.review);
                      setFavorite(game.favorite);
                      setEditing(false);
                    }}
                    className="rounded-full border border-white/10 px-6 py-3 text-sm text-gray-400 transition hover:text-white"
                  >
                    Cancel
                  </button>
                </>
              )}

            </div>

          </div>
        </div>

      </section>
    </main>
  );
}