"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewFlashcard() {
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    try {
      const res = await fetch("http://localhost:3000/api/decks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ front, back }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || "Failed to create flashcard");
      }

      router.push("/");  // Redirect back to list page
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="p-8 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create New Flashcard</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="front" className="block font-semibold mb-1">
            Front
          </label>
          <input
            id="front"
            type="text"
            value={front}
            onChange={(e) => setFront(e.target.value)}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label htmlFor="back" className="block font-semibold mb-1">
            Back
          </label>
          <textarea
            id="back"
            value={back}
            onChange={(e) => setBack(e.target.value)}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {error && <p className="text-red-600">{error}</p>}

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create
        </button>
      </form>
    </main>
  );
}