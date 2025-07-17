import EditDeckPage from "@/components/EditDeckPage";

export default async function EditDeck(props) {
  const params = await props.params;
  const res = await fetch(`http://localhost:3000/api/decks/${params.deckId}`, {
    cache: 'no-store',
  });
  const deck = await res.json();

  return <EditDeckPage initialDeck={deck} />;
}
