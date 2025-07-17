import Link from "next/link";

async function getDecks() {
  const res = await fetch("http://localhost:3000/api/decks", {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch decks");
  }
  return res.json();
}

export default async function Home() {
  const decks = await getDecks();

  return (
    <main className="min-h-screen bg-gray-900 text-white px-4 py-10">
      <div className="max-w-screen-lg mx-auto">
        {/* Back Button */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-block text-teal-400 hover:text-teal-500 font-semibold"
          >
            ← Back to Home
          </Link>
        </div>

        <h1 className="text-4xl font-extrabold text-center mb-10 text-blue-400">
          Your Flashcard Decks
        </h1>

        {decks.length === 0 ? (
          <p className="text-center text-gray-400 text-lg">You have no decks yet.</p>
        ) : (
          <div
            className="
              grid 
              gap-6 
              grid-cols-[repeat(auto-fit,minmax(280px,1fr))]"
          >
            {decks.map((deck) => (
              <div
                key={deck.id}
                className="bg-gray-800 shadow-md rounded-2xl p-6 hover:shadow-lg transition-shadow border border-gray-700 min-w-[280px]"
              >
                <h2 className="text-xl font-semibold text-white mb-2 truncate">{deck.name}</h2>
                <Link
                  href={`/decks/${deck.id}`}
                  className="text-sm text-teal-400 hover:underline"
                >
                  {deck.cards?.length || 0} {deck.cards?.length === 1 ? "card" : "cards"}
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
