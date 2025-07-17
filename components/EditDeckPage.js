'use client';
import { useState } from 'react';
import Router from 'next/router';
export default function EditDeckPage({ initialDeck }) {
  const [name, setName] = useState(initialDeck.name);
  const [cards, setCards] = useState(initialDeck.cards);

  const handleCardChange = (index, side, value) => {
    const newCards = [...cards];
    newCards[index][side] = value;
    setCards(newCards);
  };

  const handleAddCard = () => {
    setCards([...cards, { front: '', back: '' }]);
  };

  const handleDeleteCard = (index) => {
    const newCards = [...cards];
    newCards.splice(index, 1);
    setCards(newCards);
  };

  const handleSave = async () => {
    await fetch(`/api/decks/${initialDeck.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, cards }),
    });
    alert('Deck saved!');
    Router.push(`/decks/${initialDeck.id}`)

  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 flex flex-col items-center">
      <div className="w-full max-w-4xl flex flex-col flex-grow overflow-auto">
        <h1 className="text-3xl font-bold mb-6">Edit Deck</h1>

        <label className="block mb-6">
          <span className="text-gray-300 text-lg">Deck Name</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full mt-2 p-3 rounded bg-gray-800 border border-gray-700 text-white text-lg"
            placeholder="Enter deck name"
          />
        </label>

        <h2 className="text-2xl font-semibold mb-4">Cards</h2>

        <div className="flex flex-col gap-6 mb-8">
          {cards.map((card, index) => (
            <div key={index} className="bg-gray-800 p-5 rounded-lg shadow-md">
              <label className="block mb-3">
                <span className="text-gray-400 font-medium">Front</span>
                <input
                  value={card.front}
                  onChange={(e) => handleCardChange(index, 'front', e.target.value)}
                  className="w-full mt-1 p-3 rounded bg-gray-700 text-white text-lg"
                  placeholder="Front of card"
                />
              </label>
              <label className="block mb-3">
                <span className="text-gray-400 font-medium">Back</span>
                <input
                  value={card.back}
                  onChange={(e) => handleCardChange(index, 'back', e.target.value)}
                  className="w-full mt-1 p-3 rounded bg-gray-700 text-white text-lg"
                  placeholder="Back of card"
                />
              </label>
              <button
                onClick={() => handleDeleteCard(index)}
                className="text-red-500 hover:underline text-sm"
                aria-label={`Delete card ${index + 1}`}
              >
                Delete Card
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={handleAddCard}
          className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded text-lg font-semibold mb-8 w-full max-w-xs self-center"
        >
          + Add Card
        </button>

        <button
          onClick={handleSave}
          className="bg-green-600 hover:bg-green-700 px-8 py-3 rounded text-xl font-bold w-full max-w-xs self-center"
        >
          💾 Save Deck
        </button>
      </div>
    </div>
  );
}
