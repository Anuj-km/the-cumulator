export default function Home() {
  return (
    <main className="min-h-screen px-8 py-8">
      {/* Header */}
      <header className="flex items-center justify-between">
        <h1
          className="text-4xl"
          style={{ fontFamily: "var(--font-bungee)" }}
        >
          The Cumulator
        </h1>

        <nav className="flex gap-6 text-sm text-gray-400">
          <button className="transition hover:text-white">Movies</button>
          <button className="transition hover:text-white">Shows</button>
          <button className="transition hover:text-white">Games</button>
          <button className="transition hover:text-white">Music</button>
        </nav>
      </header>

      {/* Hero */}
      <section className="mx-auto mt-32 max-w-5xl text-center">
        <p className="text-sm uppercase tracking-[0.4em] text-gray-500">
          Your personal media library
        </p>

        <h2 className="mt-6 text-6xl font-semibold tracking-tight">
          Your Pop Culture Identity.
        </h2>

        <p className="mx-auto mt-6 max-w-xl text-lg text-gray-500">
          Movies, shows, games and music. One place to keep track of all of it.
        </p>
      </section>

      {/* Media Categories */}
      <section className="mx-auto mt-24 grid max-w-5xl grid-cols-2 gap-5">
        <div className="group rounded-2xl border border-white/10 bg-white/[0.03] p-8 transition hover:bg-white/[0.06]">
          <p className="text-sm text-gray-500">01</p>
          <h3 className="mt-12 text-3xl font-medium">Movies</h3>
          <p className="mt-2 text-gray-500">Your cinematic history</p>
        </div>

        <div className="group rounded-2xl border border-white/10 bg-white/[0.03] p-8 transition hover:bg-white/[0.06]">
          <p className="text-sm text-gray-500">02</p>
          <h3 className="mt-12 text-3xl font-medium">Shows</h3>
          <p className="mt-2 text-gray-500">Everything you've watched</p>
        </div>

        <div className="group rounded-2xl border border-white/10 bg-white/[0.03] p-8 transition hover:bg-white/[0.06]">
          <p className="text-sm text-gray-500">03</p>
          <h3 className="mt-12 text-3xl font-medium">Games</h3>
          <p className="mt-2 text-gray-500">Your gaming history</p>
        </div>

        <div className="group rounded-2xl border border-white/10 bg-white/[0.03] p-8 transition hover:bg-white/[0.06]">
          <p className="text-sm text-gray-500">04</p>
          <h3 className="mt-12 text-3xl font-medium">Music</h3>
          <p className="mt-2 text-gray-500">Albums, artists and more</p>
        </div>
      </section>
    </main>
  );
}