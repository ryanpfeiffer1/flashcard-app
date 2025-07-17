import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const decksFilePath = path.join(process.cwd(), 'decks.json');

function readDecks() {
  try {
    const jsonData = fs.readFileSync(decksFilePath, 'utf8');
    return JSON.parse(jsonData);
  } catch (error) {
    console.error('Failed to read decks:', error);
    return [];
  }
}

function writeDecks(decks) {
  try {
    fs.writeFileSync(decksFilePath, JSON.stringify(decks, null, 2));
  } catch (error) {
    console.error('Failed to write decks:', error);
  }
}

export async function GET() {
  const decks = readDecks();
  return NextResponse.json(decks);
}

export async function POST(request) {
  const { name, cards = [] } = await request.json();

  const decks = readDecks();

  // Calculate nextDeckId safely
  const nextDeckId = decks.length > 0 ? Math.max(...decks.map(d => d.id)) + 1 : 0;

  const newDeck = {
    id: nextDeckId,
    name,
    cards,
  };

  decks.push(newDeck);
  writeDecks(decks);

  return NextResponse.json(newDeck, { status: 201 });
}

export async function PATCH(req) {
  const { deckId, front, back } = await req.json();

  const decks = readDecks();

  const deckIndex = decks.findIndex(d => d.id === parseInt(deckId));
  if (deckIndex === -1) {
    return new Response("Deck not found", { status: 404 });
  }

  decks[deckIndex].cards.push({ front, back });
  writeDecks(decks);

  return new Response(JSON.stringify(decks[deckIndex]), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
