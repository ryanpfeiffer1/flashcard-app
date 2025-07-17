'use client';

import Link from 'next/link';

export default function HomeClient({ decks }) {
  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center py-20 px-4 bg-gradient-to-r from-blue-500 to-teal-500">
        <h1 className="text-5xl font-extrabold mb-4 tracking-wide">
          Welcome to QuickCardAI
        </h1>
        <p className="text-xl mb-6 max-w-2xl mx-auto">
          The fastest way to create and study flashcards with the power of AI. Learn smarter, not harder.
        </p>
        <a
          href="#decks"
          className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 text-xl font-semibold rounded-lg shadow-lg transition duration-300 transform hover:scale-105"
        >
          Get Started
        </a>
      </section>

{/* Decks Section */}
<main id="decks" className="w-full px-4 py-10 flex-grow text-center">
  <h2 className="text-4xl font-extrabold text-center mb-10 text-blue-400">
    Your Flashcard Decks
  </h2>

  {decks.length === 0 ? (
    <div className="text-center">
      <p className="text-gray-400 text-lg mb-4">You have no decks yet.</p>
      <Link
        href="/create-deck"
        className="inline-block bg-teal-600 hover:bg-teal-700 text-white px-5 py-2 rounded-lg font-semibold shadow transition-transform hover:scale-105"
      >
        Create Your First Deck
      </Link>
    </div>
  ) : (
    <div className="flex justify-center">
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {decks.map((deck) => (
          <div
            key={deck.id}
            className="bg-gray-800 shadow-md rounded-2xl p-6 hover:shadow-lg transition-shadow border border-gray-700 w-72"
          >
            <h3 className="text-xl font-semibold text-white mb-3 truncate">{deck.name}</h3>
            <Link
              href={`/decks/${deck.id}`}
              className="inline-block bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-200"
            >
              View {deck.cards?.length || 0} {deck.cards?.length === 1 ? 'card' : 'cards'}
            </Link>
          </div>
        ))}
      </div>
    </div>
  )}
</main>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gray-900">
        <h2 className="text-3xl font-semibold text-center mb-12 text-white">
          Why Choose QuickCardAI?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-2xl font-bold mb-4 text-white">AI-Powered Flashcards</h3>
            <p className="text-gray-300">
              Generate personalized flashcards using the latest AI technology to help you learn faster and more effectively.
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-2xl font-bold mb-4 text-white">Smart Study Mode</h3>
            <p className="text-gray-300">
              Study at your own pace with smart features like spaced repetition and progress tracking.
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-2xl font-bold mb-4 text-white">Seamless Syncing</h3>
            <p className="text-gray-300">
              Access your flashcards across multiple devices with automatic syncing.
            </p>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-gray-900 py-8 px-4 text-center text-gray-500">
        <p>&copy; 2025 QuickCardAI. All rights reserved.</p>
        <div className="mt-4">
          <a href="#" className="text-teal-400 hover:text-teal-500 mx-2">Privacy</a>
          <a href="#" className="text-teal-400 hover:text-teal-500 mx-2">Terms of Service</a>
        </div>
      </footer>
    </div>
  );
}
