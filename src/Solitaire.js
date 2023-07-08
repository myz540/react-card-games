import { CARD_MAP, shuffle, CARD_BACK } from "./constants";
import { useState } from "react";
import Deck from "./Deck";
import Card from "./Card";

export default function App() {
  const [cards, setCards] = useState(CARD_MAP.slice());
  const [shownCard, setShownCard] = useState(null);
  const docks = ["DIAMOND", "SPADE", "HEART", "CLUB"];

  const topCard = cards[0];

  function handleDrawCard() {
    const tempCards = cards.slice();
    const card = tempCards.shift();
    console.log(card);
    setCards(() => [...tempCards, card]);
    setShownCard(card);
  }

  function handleShuffle() {
    console.log("Shuffling");
    setCards(shuffle(CARD_MAP.slice()));
    setShownCard(null);
  }

  function onDragEnd(e) {
    console.log(e.clientX);
    console.log(e.clientY);
  }

  return (
    <>
      <div className="board">
        <Deck
          cards={cards}
          shownCard={shownCard}
          onDrawCard={handleDrawCard}
          onShuffle={handleShuffle}
        />
        <span onDragStart={() => console.log("DragStart")}>
          {shownCard ? <Card card={shownCard} isDraggable={true} /> : ""}
        </span>
      </div>
      <div className="dock">
        <ul className="list">
          {docks.map((suit) => (
            <Dock suit={suit} />
          ))}
        </ul>
      </div>
    </>
  );
}

function Dock({ suit, card }) {
  const [cardHistory, setCardHistory] = useState([]);
  const topCard = cardHistory ? cardHistory[-1] : null;
  return (
    <li className="list">
      <p>{suit}</p>
      {card ? <Card card={card} /> : <Card card={CARD_BACK} />}
    </li>
  );
}
