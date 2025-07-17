import Link from 'next/link';

export default async function DeckPage(props) {
  const params = await props.params;
  const res = await fetch(`http://localhost:3000/api/decks/${params.deckId}`, { cache: 'no-store' });
  const deck = await res.json();

  if (!deck) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">Deck not found.</div>;
  }

  return (
    <div className="min-h-screen w-full bg-gray-900 text-white flex flex-col items-center justify-center p-6">
      <div className="max-w-3xl w-full flex flex-col flex-grow">
        <h1 className="text-3xl font-bold mb-6 text-center">{deck.name}</h1>

        {deck.cards.length === 0 ? (
          <p className="text-gray-400 mb-6 text-center">This deck has no cards yet.</p>
        ) : (
          <ul className="space-y-4 mb-8 overflow-y-auto flex-grow px-2">
            {deck.cards.map((card, index) => (
              <li
                key={index}
                className="border border-gray-700 rounded-lg p-4 shadow-md bg-gray-800"
              >
                <strong className="block text-gray-200 mb-1">{card.front}</strong>
                <span className="text-gray-400">{card.back}</span>
              </li>
            ))}
          </ul>
        )}

        <div className="flex flex-wrap justify-center gap-6 mb-8">
          <Link
            href={`/decks/${deck.id}/create-card`}
            className="px-5 py-2 bg-gray-700 hover:bg-gray-600 rounded-md text-white transition"
          >
            + Add Card
          </Link>

          <Link
            href="/decks"
            className="px-5 py-2 bg-gray-700 hover:bg-gray-600 rounded-md text-white transition"
          >
            ← Back to Decks
          </Link>
        </div>
      </div>

      {/* Study Button fixed at bottom with margin */}
      <div className="w-full max-w-3xl flex justify-center">
        <Link
          href={`/decks/${deck.id}/study`}
          className="w-full max-w-md text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg px-6 py-4 transition shadow-lg"
          aria-label={`Study deck ${deck.name}`}
        >
          📚 Study Deck
        </Link>
      </div>
    </div>
  );
}
