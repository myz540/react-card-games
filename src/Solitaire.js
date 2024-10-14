import { CARD_MAP, shuffle, CARD_BACK } from "./constants";
import { useState, useEffect } from "react";
import Deck from "./Deck";
import Card from "./Card";
import Foundation from "./Foundation";
import WinBanner from "./WinBanner";
import { Link } from "react-router-dom";

export default function Solitaire() {
  const [cards, setCards] = useState(CARD_MAP.slice());
  const [shownCard, setShownCard] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);
  const [foundations, setFoundations] = useState({
    DIAMOND: [],
    SPADE: [],
    HEART: [],
    CLUB: [],
  });

  const [isGameWon, setIsGameWon] = useState(false);

  useEffect(() => {
    checkWinCondition();
  }, [foundations, cards]);

  function checkWinCondition() {
    const allFoundationsFull = Object.values(foundations).every(
      (foundation) => foundation.length === 13
    );
    const deckEmpty = cards.length === 0 && !shownCard;

    if (allFoundationsFull && deckEmpty) {
      setIsGameWon(true);
    }
  }

  function handleDrawCard() {
    if (cards.length > 0) {
      const drawnCard = cards[0];
      setShownCard(drawnCard);
      setCards(cards.slice(1));
    } else {
      setShownCard(null);
    }
  }

  function handleShuffle() {
    setCards(shuffle(CARD_MAP.slice()));
    setShownCard(null);
    setSelectedCard(null);
    setFoundations({
      DIAMOND: [],
      SPADE: [],
      HEART: [],
      CLUB: [],
    });
    setIsGameWon(false);
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
        // If the placed card was the shown card, draw a new card
        handleDrawCard();
      } else {
        // If the placed card was from elsewhere (e.g., tableau in future implementations),
        // we don't need to draw a new card
        setCards((prev) => prev.filter((c) => c.name !== selectedCard.name));
      }

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
    const cardValues = [
      "A",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "11",
      "12",
      "13",
    ];
    const topCardIndex = cardValues.indexOf(topCard.value);
    const currentCardIndex = cardValues.indexOf(card.value);

    return currentCardIndex === topCardIndex + 1;
  }

  return (
    <div className="solitaire-game">
      {isGameWon && <WinBanner onPlayAgain={handleShuffle} />}
      <div className="board">
        <div className="deck">
          <Deck
            cards={cards}
            onDrawCard={handleDrawCard}
            onShuffle={handleShuffle}
          />
        </div>
        <div className="shown-card">
          {shownCard && (
            <div onClick={() => handleCardClick(shownCard)}>
              <Card
                card={shownCard}
                isSelected={
                  selectedCard && selectedCard.name === shownCard.name
                }
              />
            </div>
          )}
        </div>
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
      <div className="solitaire-game">
        <Link to="/" className="back-link">
          Back to Home
        </Link>
        {/* ... existing Solitaire game JSX ... */}
      </div>
    </div>
  );
}
