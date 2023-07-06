import { CARD_MAP, shuffle } from "./constants";
import { useState } from "react";

export default function App() {
  const [cards, setCards] = useState(CARD_MAP.slice());
  const [hand, setHand] = useState([]);
  const topCard = cards[0];
  const bottomCard = cards[-1];

  function handleDrawCard() {
    console.log(topCard);
    setHand((h) => [...h, topCard]);
    setCards((c) => c.filter((i) => i.name !== topCard.name));
  }

  function handleShuffle() {
    console.log("Shuffling");
    setCards(shuffle(CARD_MAP.slice()));
    setHand([]);
  }

  return (
    <div>
      <Deck
        cards={cards}
        onDrawCard={handleDrawCard}
        onShuffle={handleShuffle}
      />
      <Hand cards={hand} />
    </div>
  );
}

function Card({ card }) {
  return <div className={`card ${card.suit}`}>{card.icon}</div>;
}

function Deck({ cards, onDrawCard, onShuffle }) {
  const cardsInDeck = cards.length;
  return (
    <div className="deck">
      <h3 onClick={onDrawCard}>🎴</h3>
      <p>Cards Left: {cardsInDeck}</p>
      <button onClick={onShuffle}>Shuffle</button>
    </div>
  );
}

function Hand({ cards }) {
  return (
    <div className="hand">
      {cards.map((c) => (
        <Card card={c} key={c.name} />
      ))}
    </div>
  );
}
