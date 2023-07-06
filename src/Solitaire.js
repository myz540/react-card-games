import { CARD_MAP, shuffle, CARD_BACK } from "./constants";
import { useState } from "react";
import Deck from "./Deck";
import Card from "./Card";

export default function App() {
  const [cards, setCards] = useState(CARD_MAP.slice());
  const [spadeDock, setSpadeDock] = useState(null);
  const [heartDock, setHeartDock] = useState(null);
  const [diamondDock, setDiamondDock] = useState(null);
  const [clubDock, setClubDock] = useState(null);
  const [shownCard, setShownCard] = useState(null);

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
  }

  function updateDock(card) {}

  return (
    <>
      <div className="board">
        <Deck
          cards={cards}
          shownCard={shownCard}
          onDrawCard={handleDrawCard}
          onShuffle={handleShuffle}
        />
      </div>
      <div className="dock">
        <ul className="list">
          <Dock suit="SPADE" card={spadeDock} />
          <Dock suit="HEART" card={heartDock} />
          <Dock suit="CLUB" card={clubDock} />
          <Dock suit="DIAMOND" card={diamondDock} />
        </ul>
      </div>
    </>
  );
}

function Dock({ suit, card }) {
  return (
    <li className="list">
      {card ? <Card card={card} /> : <Card card={CARD_BACK} />}
    </li>
  );
}
