import Card from "./Card";

export default function Deck({ cards, onDrawCard, onShuffle, shownCard }) {
  const cardsInDeck = cards.length;
  return (
    <p className="deck">
      <h3 onClick={onDrawCard}>🎴</h3>
      <span>{shownCard ? <Card card={shownCard} /> : ""}</span>
      <p>Cards Left: {cardsInDeck}</p>
      <button onClick={onShuffle}>Shuffle</button>
    </p>
  );
}
