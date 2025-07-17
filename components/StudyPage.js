'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function StudyPage({ deck }) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [reviewQueue, setReviewQueue] = useState(deck.cards);

  const card = reviewQueue[index];

  // Handle spaced repetition by re-queuing missed cards
  const handleFeedback = (knewIt) => {
    if (!knewIt) {
      // Move card to end of queue
      setReviewQueue((prev) => [...prev, prev[index]]);
    }
    nextCard();
  };

  const nextCard = () => {
    setIndex((prev) => (prev < reviewQueue.length - 1 ? prev + 1 : prev));
    setFlipped(false);
  };

  const prevCard = () => {
    setIndex((prev) => (prev > 0 ? prev - 1 : prev));
    setFlipped(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === ' ' || e.key === 'Spacebar') {
      e.preventDefault();
      setFlipped((f) => !f);
    } else if (e.key === 'ArrowRight') {
      nextCard();
    } else if (e.key === 'ArrowLeft') {
      prevCard();
    } else if (e.key === '1') {
      handleFeedback(true);
    } else if (e.key === '2') {
      handleFeedback(false);
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [index, reviewQueue]);

  return (
    <div className="min-h-screen w-full bg-gray-900 text-white flex flex-col items-center justify-center p-6 font-sans">
      <div className="w-full max-w-4xl flex justify-between items-center mb-6">
        <h1 className="text-3xl sm:text-4xl font-extrabold">{deck.name}</h1>
        <Link
          href={`/decks/${deck.id}/edit`}
          className="text-sm bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded text-white"
        >
          ✏️ Edit Deck
        </Link>
      </div>

      <div
        className="w-full max-w-2xl aspect-video bg-gray-800 border border-gray-700 rounded-2xl shadow-xl flex items-center justify-center text-3xl sm:text-5xl cursor-pointer p-6 text-center hover:ring-2 hover:ring-teal-400 transition-transform duration-300 font-semibold"
        onClick={() => setFlipped(!flipped)}
      >
        <span className="text-gray-100 break-words">{flipped ? card.back : card.front}</span>
      </div>

      <div className="flex flex-wrap gap-4 mt-8 mb-4 justify-center">
        <button
          onClick={prevCard}
          className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2 rounded text-sm sm:text-base disabled:opacity-40"
          disabled={index === 0}
        >
          ← Previous
        </button>
        <button
          onClick={() => handleFeedback(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded"
        >
          ✅ I Knew This (1)
        </button>
        <button
          onClick={() => handleFeedback(false)}
          className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded"
        >
          ❌ I Forgot This (2)
        </button>
        <button
          onClick={nextCard}
          className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2 rounded text-sm sm:text-base disabled:opacity-40"
          disabled={index === reviewQueue.length - 1}
        >
          Next →
        </button>
      </div>

      <p className="text-gray-400 text-sm text-center">
        Card {index + 1} of {reviewQueue.length} &nbsp;|&nbsp; Spacebar to flip, ← → to navigate
      </p>
    </div>
  );
}
