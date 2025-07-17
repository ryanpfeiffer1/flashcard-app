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

// GET /api/decks/:deckId
export async function GET(_, props) {
  const params = await props.params;
  const decks = readDecks();
  const deck = decks.find((d) => d.id === parseInt(params.deckId));
  if (!deck) {
    return NextResponse.json({ error: 'Deck not found' }, { status: 404 });
  }
  return NextResponse.json(deck);
}

// PUT /api/decks/:deckId
export async function PUT(request, props) {
  const params = await props.params;
  const updatedDeck = await request.json();
  const decks = readDecks();

  const index = decks.findIndex((d) => d.id === parseInt(params.deckId));
  if (index === -1) {
    return NextResponse.json({ error: 'Deck not found' }, { status: 404 });
  }

  decks[index] = { ...decks[index], ...updatedDeck };
  writeDecks(decks);

  return NextResponse.json(decks[index], { status: 200 });
}
