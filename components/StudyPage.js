'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function StudyPage({ deck }) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [reviewQueue, setReviewQueue] = useState(deck.cards);
  const [done, setDone] = useState(false);
  const [startTime, setStartTime] = useState(Date.now());
  const [elapsed, setElapsed] = useState(0);
  const [isRunning, setisRunning] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const [shuffle, setShuffle] = useState(false);

  function StopTimer() {
    setisRunning(false);
  }
  useEffect(() => {
    if (shuffle) {
      const shuffled = [...deck.cards].sort(() => 0.5 - Math.random());
      setReviewQueue(shuffled);
    }
  }, [shuffle]);

  useEffect(() => {
    if (!isRunning) return;
    const timer = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [startTime, isRunning]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [index, reviewQueue, done]);

  const card = reviewQueue[index];

  const handleFeedback = (knewIt) => {
    if (!knewIt) {
      setReviewQueue((prev) => [...prev, prev[index]]);
    }
    nextCard();
  };

  const nextCard = () => {
    if (index < reviewQueue.length - 1) {
      setIndex((prev) => prev + 1);
    } else {
      setDone(true);
      setShowConfetti(true);
      StopTimer();
    }
    setFlipped(false);
  };

  const prevCard = () => {
    setIndex((prev) => (prev > 0 ? prev - 1 : 0));
    setFlipped(false);
  };

  const restart = () => {
    setIndex(0);
    setFlipped(false);
    setDone(false);
    setisRunning(true);
    setElapsed(0);
    setStartTime(Date.now());
    setReviewQueue(shuffle ? [...deck.cards].sort(() => 0.5 - Math.random()) : deck.cards);
    setShowConfetti(false);
  };

  const handleKeyDown = (e) => {
    if (done) return;
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

  return (
    <div className="min-h-screen w-full bg-gray-900 text-white flex flex-col items-center justify-center p-6 font-sans relative">
      {showConfetti && (
        <div className="absolute inset-0 z-50 pointer-events-none">
          <div className="w-full h-full animate-confetti" />
        </div>
      )}

      <div className="w-full max-w-4xl flex justify-between items-center mb-6">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-400">{deck.name}</h1>
        <Link
          href={`/decks/${deck.id}/edit`}
          className="text-sm bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded font-medium text-teal-400 hover:text-teal-300 transition"
        >
          ✏️ Edit Deck
        </Link>
      </div>

      {done ? (
        <div className="w-full max-w-xl bg-green-900 border border-green-700 text-green-300 rounded-2xl shadow-xl p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">🎉 You’re done studying!</h2>
          <p className="text-lg mb-2">Time spent: {elapsed} seconds</p>
          <button
            onClick={restart}
            className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded font-medium mt-4 transition"
          >
            🔁 Restart
          </button>
        </div>
      ) : (
        <>
          <div
            className="w-full max-w-2xl aspect-video bg-gray-800 border border-gray-700 rounded-2xl shadow-xl flex items-center justify-center text-3xl sm:text-5xl cursor-pointer p-6 text-center hover:ring-2 hover:ring-teal-400 transition-transform duration-300 font-semibold text-white break-words"
            onClick={() => setFlipped(!flipped)}
          >
            {flipped ? card.back : card.front}
          </div>

          <div className="flex flex-wrap gap-4 mt-8 mb-4 justify-center">
            <button
              onClick={prevCard}
              className="bg-gray-700 hover:bg-gray-600 text-teal-400 px-5 py-2 rounded text-sm sm:text-base disabled:opacity-40 transition"
              disabled={index === 0}
            >
              ← Previous
            </button>
            <button
              onClick={() => handleFeedback(true)}
              className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2 rounded transition"
            >
              ✅ I Knew This (1)
            </button>
            <button
              onClick={() => handleFeedback(false)}
              className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded transition"
            >
              ❌ I Forgot This (2)
            </button>
            <button
              onClick={nextCard}
              className="bg-gray-700 hover:bg-gray-600 text-teal-400 px-5 py-2 rounded text-sm sm:text-base disabled:opacity-40 transition"
              disabled={index === reviewQueue.length - 1}
            >
              Next →
            </button>
          </div>

          <p className="text-gray-400 text-sm text-center mb-2">
            Card {index + 1} of {reviewQueue.length} &nbsp;|&nbsp; Spacebar to flip, ← → to navigate
          </p>
          <p className="text-gray-500 text-xs text-center">⏱️ Elapsed: {elapsed}s</p>

          <div className="mt-4">
            <label className="inline-flex items-center gap-2 text-gray-400">
              <input
                type="checkbox"
                checked={shuffle}
                onChange={() => setShuffle((s) => !s)}
                className="form-checkbox h-4 w-4 text-teal-600"
              />
              <span className="text-sm">Shuffle on restart</span>
            </label>
          </div>
        </>
      )}
    </div>
  );
}
