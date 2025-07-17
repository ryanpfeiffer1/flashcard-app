import StudyPage from "@/components/StudyPage";

export default async function StudyRoute({ params }) {
  const res = await fetch(`http://localhost:3000/api/decks`, { cache: 'no-store' });
  const decks = await res.json();
  const deck = decks.find((d) => d.id === parseInt(params.deckId));

  if (!deck) return <div>Deck not found</div>;

  return <StudyPage deck={deck} />;
}
