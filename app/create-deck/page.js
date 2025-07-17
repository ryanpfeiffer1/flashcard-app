"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateDeck() {
  const [name, setName] = useState("");
  const [cards, setCards] = useState([{ front: "", back: "" }]);
  const router = useRouter();

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

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:3000/api/decks", {
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

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 py-10">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-3xl space-y-6 bg-gray-900 rounded-lg shadow-lg text-white"
      >
        <h1 className="text-3xl font-bold text-center text-blue-400">Create Deck</h1>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Deck name"
          className="border border-gray-700 bg-gray-800 p-3 w-full rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400"
          required
        />

        <h2 className="text-2xl font-semibold mt-6 mb-4 text-teal-400">Cards</h2>
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
    </div>
  );
}
