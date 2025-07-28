'use client';
import { useEffect, useState } from 'react';

export default function FlashcardGenerator() {
  const [topic, setTopic] = useState('');
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deckName, setDeckName] = useState('');
  const [decks, setDecks] = useState([]);

  useEffect(() => {
    fetch('/api/decks')
      .then((res) => res.json())
      .then((data) => setDecks(data))
      .catch((err) => console.error('Failed to fetch decks:', err));
  }, []);

  const generateFlashcards = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/generate-flashcards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic }),
      });

      const data = await res.json();
      setFlashcards(data.flashcards);
    } catch (err) {
      console.error('Error generating flashcards:', err);
    } finally {
      setLoading(false);
    }
  };

  const saveDeck = async () => {
    if (!deckName.trim()) return;

    const deckToSave = {
      name: deckName,
      cards: flashcards.map((card) => ({
        front: card.question,
        back: card.answer,
      })),
    };

    try {
      const res = await fetch('/api/decks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(deckToSave),
      });

      const newDeck = await res.json();
      setDecks((prev) => [...prev, newDeck]);
      setFlashcards([]);
      setDeckName('');
      setTopic('');
    } catch (err) {
      console.error('Error saving deck:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 flex flex-col items-center">
      <div className="w-full max-w-3xl">
        <h1 className="text-3xl font-extrabold text-blue-400 mb-6 text-center">
          ⚡ Flashcard Generator
        </h1>

        <input
          type="text"
          placeholder="Enter topic..."
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4"
        />
        <button
          onClick={generateFlashcards}
          disabled={loading}
          className="w-full bg-teal-600 hover:bg-teal-700 transition text-white font-medium py-2 rounded-lg mb-8"
        >
          {loading ? 'Generating...' : '✨ Generate Flashcards'}
        </button>

        {flashcards.length > 0 && (
          <div className="mb-10">
            <input
              type="text"
              placeholder="Name this deck..."
              value={deckName}
              onChange={(e) => setDeckName(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 mb-3"
            />
            <button
              onClick={saveDeck}
              className="w-full bg-green-600 hover:bg-green-700 transition text-white font-medium py-2 rounded-lg mb-6"
            >
              💾 Save Deck
            </button>

            <div className="space-y-4">
              {flashcards.map((card, idx) => (
                <div key={idx} className="bg-gray-800 border border-gray-700 p-4 rounded-xl shadow">
                  <p className="font-semibold text-white">Q: {card.question}</p>
                  <p className="mt-2 text-gray-300">A: {card.answer}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <h2 className="text-2xl font-bold text-teal-400 mb-4">📚 Saved Decks</h2>
          {decks.map((deck) => (
            <div key={deck.id} className="mb-6 bg-gray-800 border border-gray-700 p-4 rounded-xl shadow">
              <h3 className="text-xl font-bold text-blue-300 mb-3">{deck.name}</h3>
              <div className="space-y-2">
                {deck.cards.map((card, idx) => (
                  <div key={idx} className="bg-gray-900 border border-gray-700 p-3 rounded">
                    <p className="font-semibold text-white">Q: {card.front}</p>
                    <p className="text-gray-400">A: {card.back}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
