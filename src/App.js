import { CARD_MAP, shuffle } from "./constants";
import { useState } from "react";
import Deck from "./Deck";
import Hand from "./Hand";

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

  function handleFlipTopCard() {}

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
