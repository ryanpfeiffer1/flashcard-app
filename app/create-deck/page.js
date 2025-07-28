"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function CreateDeck() {
  const [mode, setMode] = useState("manual"); // manual or ai
  const [name, setName] = useState("");
  const [cards, setCards] = useState([{ front: "", back: "" }]);

  // AI states
  const [topic, setTopic] = useState("");
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deckName, setDeckName] = useState("");
  const [decks, setDecks] = useState([]);

  const router = useRouter();

  // Fetch saved decks on mount (for AI mode saved decks list)
  useEffect(() => {
    fetch("/api/decks")
      .then((res) => res.json())
      .then((data) => setDecks(data))
      .catch((err) => console.error("Failed to fetch decks:", err));
  }, []);

  // Manual handlers
  function handleCardChange(index, field, value) {
    const updated = [...cards];
    updated[index][field] = value;
    setCards(updated);
  }

  function addCard() {
    setCards([...cards, { front: "", back: "" }]);
  }

  function removeCard(index) {
    const updated = cards.filter((_, i) => i !== index);
    setCards(updated);
  }

  // AI generate flashcards
  const generateFlashcards = async () => {
    if (!topic.trim()) {
      alert("Please enter a topic.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/generate-flashcards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topic }),
      });

      const data = await res.json();
      setFlashcards(data.flashcards || []);
    } catch (err) {
      console.error("Error generating flashcards:", err);
      alert("Error generating flashcards.");
    } finally {
      setLoading(false);
    }
  };

  // AI save deck
  const saveDeck = async () => {
    if (!deckName.trim()) {
      alert("Please enter a deck name.");
      return;
    }

    const deckToSave = {
      name: deckName,
      cards: flashcards.map((card) => ({
        front: card.question,
        back: card.answer,
      })),
    };

    try {
      const res = await fetch("/api/decks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(deckToSave),
      });

      if (!res.ok) throw new Error("Failed to save deck");
      const newDeck = await res.json();
      setDecks((prev) => [...prev, newDeck]);
      setFlashcards([]);
      setDeckName("");
      setTopic("");
    } catch (err) {
      console.error("Error saving deck:", err);
      alert("Error saving deck.");
    }
  };

  // Combined submit for manual mode only (AI save handled separately)
  async function handleSubmit(e) {
    e.preventDefault();

    if (mode === "manual") {
      if (!name.trim()) {
        alert("Deck name is required");
        return;
      }
      if (cards.some((card) => !card.front.trim() || !card.back.trim())) {
        alert("All cards must have front and back text.");
        return;
      }

      try {
        const res = await fetch("/api/decks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, cards }),
        });

        if (res.ok) {
          router.push("/decks");
        } else {
          alert("Failed to create deck");
        }
      } catch (err) {
        alert("Network error: " + err.message);
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 py-10 relative">
      {/* Back button */}
      <button
        type="button"
        onClick={() => {
        // Navigate and force reload
        window.location.href = '/'; 
        }}
        className="absolute top-6 left-6 flex items-center text-teal-400 hover:text-teal-300 transition">
        <ArrowLeft className="w-5 h-5 mr-1 cursor-pointer" />
        <span className="text-sm font-medium">Back</span>
      </button>


      <div className="w-full max-w-4xl space-y-6 rounded-lg shadow-lg text-white">
        {/* Mode toggle */}
        <div className="flex justify-center space-x-4 mb-4">
          <button
            type="button"
            onClick={() => setMode("manual")}
            className={`px-5 py-2 rounded-md font-semibold transition ${
              mode === "manual"
                ? "bg-teal-500 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            Create Manually
          </button>
          <button
            type="button"
            onClick={() => setMode("ai")}
            className={`px-5 py-2 rounded-md font-semibold transition ${
              mode === "ai"
                ? "bg-teal-500 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            Create with AI
          </button>
        </div>

        {/* Manual mode form */}
        {mode === "manual" && (
          <form
            onSubmit={handleSubmit}
            className="space-y-6 bg-gray-900 rounded-lg p-6 border border-gray-700"
          >
            <h1 className="text-3xl font-bold text-center text-blue-400 mb-6">
              Create Deck
            </h1>

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Deck name"
              className="border border-gray-700 bg-gray-800 p-3 w-full rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400"
              required
            />

            <h2 className="text-2xl font-semibold mt-6 mb-4 text-teal-400">
              Cards
            </h2>
            {cards.map((card, i) => (
              <div
                key={i}
                className="space-y-3 border border-gray-700 p-5 rounded-xl bg-gray-800"
              >
                <input
                  value={card.front}
                  onChange={(e) => handleCardChange(i, "front", e.target.value)}
                  placeholder="Front"
                  className="border border-gray-600 bg-gray-700 p-3 w-full rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
                <input
                  value={card.back}
                  onChange={(e) => handleCardChange(i, "back", e.target.value)}
                  placeholder="Back"
                  className="border border-gray-600 bg-gray-700 p-3 w-full rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
                {cards.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeCard(i)}
                    className="text-red-500 text-sm hover:text-red-600 transition"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={addCard}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-md font-semibold transition"
            >
              Add Another Card
            </button>

            <div className="text-center">
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-md font-bold transition"
              >
                Create Deck
              </button>
            </div>
          </form>
        )}

        {/* AI mode UI */}
        {mode === "ai" && (
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
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
              {loading ? "Generating..." : "✨ Generate Flashcards"}
            </button>

            {flashcards.length > 0 && (
              <>
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

                <div className="space-y-4 max-h-[400px] overflow-y-auto">
                  {flashcards.map((card, idx) => (
                    <div
                      key={idx}
                      className="bg-gray-800 border border-gray-700 p-4 rounded-xl shadow"
                    >
                      <p className="font-semibold text-white">
                        Q: {card.question}
                      </p>
                      <p className="mt-2 text-gray-300">A: {card.answer}</p>
                    </div>
                  ))}
                </div>
              </>
            )}

            <div>
              <h2 className="text-2xl font-bold text-teal-400 mb-4 mt-10">
                📚 Saved Decks
              </h2>
              {decks.length === 0 && (
                <p className="text-gray-400">No saved decks yet.</p>
              )}
              {decks.map((deck) => (
                <div
                  key={deck.id}
                  className="mb-6 bg-gray-800 border border-gray-700 p-4 rounded-xl shadow"
                >
                  <h3 className="text-xl font-bold text-blue-300 mb-3">
                    {deck.name}
                  </h3>
                  <div className="space-y-2">
                    {deck.cards.map((card, idx) => (
                      <div
                        key={idx}
                        className="bg-gray-900 border border-gray-700 p-3 rounded"
                      >
                        <p className="font-semibold text-white">Q: {card.front}</p>
                        <p className="text-gray-400">A: {card.back}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
