import { CARD_MAP, shuffle, CARD_BACK } from "./constants";
import { useState } from "react";
import Deck from "./Deck";
import Card from "./Card";
import Foundation from "./Foundation";

export default function App() {
  const [cards, setCards] = useState(CARD_MAP.slice());
  const [shownCard, setShownCard] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);
  const [foundations, setFoundations] = useState({
    DIAMOND: [],
    SPADE: [],
    HEART: [],
    CLUB: [],
  });

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

  function handleCardClick(card) {
    if (selectedCard && selectedCard.name === card.name) {
      setSelectedCard(null);
    } else {
      setSelectedCard(card);
    }
  }

  function handleFoundationClick(suit) {
    if (selectedCard && canPlaceCard(selectedCard, foundations[suit], suit)) {
      setFoundations((prev) => ({
        ...prev,
        [suit]: [...prev[suit], selectedCard],
      }));
      if (selectedCard === shownCard) {
        setShownCard(null);
      }
      setCards((prev) => prev.filter((c) => c.name !== selectedCard.name));
      setSelectedCard(null);
    }
  }

  function canPlaceCard(card, foundationPile, foundationSuit) {
    if (card.suit !== foundationSuit) {
      return false;
    }

    if (foundationPile.length === 0) {
      return card.value === "A";
    }

    const topCard = foundationPile[foundationPile.length - 1];
    return parseInt(card.value) === parseInt(topCard.value) + 1;
  }

  return (
    <div className="solitaire-game">
      <div className="board">
        <Deck
          cards={cards}
          shownCard={shownCard}
          onDrawCard={handleDrawCard}
          onShuffle={handleShuffle}
        />
        {shownCard && (
          <div onClick={() => handleCardClick(shownCard)}>
            <Card
              card={shownCard}
              isSelected={selectedCard && selectedCard.name === shownCard.name}
            />
          </div>
        )}
      </div>
      <div className="foundations-row">
        {Object.entries(foundations).map(([suit, cards]) => (
          <Foundation
            key={suit}
            suit={suit}
            cards={cards}
            onClick={() => handleFoundationClick(suit)}
          />
        ))}
      </div>
    </div>
  );
}
