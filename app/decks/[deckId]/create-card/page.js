'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateCard({ params }) {
  const { deckId } = React.use(params);
  const router = useRouter();

  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [loading, setLoading] = useState(false);

  async function addCard() {
    setLoading(true);
    const response = await fetch('/api/decks', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ deckId, front, back }),
    });
    setLoading(false);

    if (!response.ok) {
      console.error('Failed to add card');
      return;
    }
    router.push(`/decks/${deckId}`);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    await addCard();
  }

  return (
    <div className="min-h-screen w-full bg-gray-900 flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-gray-800 rounded-lg shadow-lg p-8 space-y-6 text-white"
      >
        <h1 className="text-center text-teal-400 font-semibold text-3xl">
          Create Card
        </h1>
        <input
          type="text"
          value={front}
          onChange={(e) => setFront(e.target.value)}
          placeholder="Front of card"
          required
          disabled={loading}
          className="w-full rounded-md border border-gray-700 bg-gray-700 px-4 py-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
        />
        <input
          type="text"
          value={back}
          onChange={(e) => setBack(e.target.value)}
          placeholder="Back of card"
          required
          disabled={loading}
          className="w-full rounded-md border border-gray-700 bg-gray-700 px-4 py-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
        />
        <button
          type="submit"
          disabled={loading}
          className={`w-full rounded-md py-3 font-semibold transition-colors duration-300 ${
            loading ? 'bg-teal-600/50 cursor-not-allowed' : 'bg-teal-600 hover:bg-teal-700'
          }`}
        >
          {loading ? 'Creating...' : 'Create Card'}
        </button>
      </form>
    </div>
  );
}
