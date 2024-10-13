export default function Deck({ cards, onDrawCard, onShuffle, shownCard }) {
  const cardsInDeck = cards.length;
  return (
    <div className="deck">
      <h3 onClick={onDrawCard}>🎴</h3>

      <p>Cards Left: {cardsInDeck}</p>
      <button onClick={onShuffle}>Shuffle</button>
    </div>
  );
}
