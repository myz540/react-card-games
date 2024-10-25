import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Deck from "../components/Deck";
import Hand from "../components/Hand";
import Card from "../components/Card";
import { CARD_MAP, shuffle } from "../constants";
import "./Durac.css";

function Durac() {
  const [gameState, setGameState] = useState({
    players: [],
    deck: [],
    attackSlots: [],
    primaryAttacker: null,
    defender: null,
    currentPlayer: null,
    gamePhase: "attack",
    trumpSuit: null, // Add this line
    // ... other state properties ...
  });

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    const deck = shuffle(CARD_MAP);
    const trumpCard = deck[deck.length - 1]; // Last card determines trump suit
    const trumpSuit = trumpCard.suit;

    // ... rest of game initialization ...

    setGameState({
      // ... other state properties ...
      deck: deck,
      trumpSuit: trumpSuit,
    });
  };

  const handleCardPlay = (playerId, card) => {
    if (gameState.gamePhase === "attack") {
      handleAttack(playerId, card);
    } else {
      handleDefend(playerId, card);
    }
  };

  const handleAttack = (playerId, card) => {
    setGameState((prevState) => {
      if (!isValidAttack(card, prevState)) {
        return prevState; // Invalid attack
      }

      const updatedPlayers = prevState.players.map((player) => {
        if (player.id === playerId) {
          return {
            ...player,
            hand: player.hand.filter((c) => c !== card),
          };
        }
        return player;
      });

      const newAttackSlot = {
        id: prevState.attackSlots.length + 1,
        attacker: playerId,
        defender: prevState.defender.id,
        attackCard: card,
        defendCard: null,
      };

      const updatedAttackSlots = [...prevState.attackSlots, newAttackSlot];

      return {
        ...prevState,
        players: updatedPlayers,
        attackSlots: updatedAttackSlots,
      };
    });
  };

  const isValidAttack = (card, state) => {
    if (state.attackSlots.length === 0) {
      return true; // First attack is always valid
    }

    return (
      state.validAttackValues.includes(card.value) &&
      state.attackSlots.length < 6 &&
      state.attackSlots.length < state.defender.hand.length
    );
  };

  const handleDefend = (playerId, card) => {
    setGameState((prevState) => {
      if (playerId !== prevState.defender.id) {
        return prevState; // Not the defender's turn
      }

      const undefendedAttackSlot = prevState.attackSlots.find(
        (slot) => !slot.defendCard
      );
      if (!undefendedAttackSlot) {
        return prevState; // No attacks to defend
      }

      // TODO: Implement canDefend function
      // This function should be defined elsewhere, possibly in a utility file
      // It should compare the attack card and defense card to determine if the defense is valid
      if (!canDefend(undefendedAttackSlot.attackCard, card)) {
        return prevState; // Invalid defense
      }

      const updatedPlayers = prevState.players.map((player) => {
        if (player.id === playerId) {
          return {
            ...player,
            hand: player.hand.filter((c) => c !== card),
          };
        }
        return player;
      });

      const updatedAttackSlots = prevState.attackSlots.map((slot) => {
        if (slot.id === undefendedAttackSlot.id) {
          return { ...slot, defendCard: card };
        }
        return slot;
      });

      return {
        ...prevState,
        players: updatedPlayers,
        attackSlots: updatedAttackSlots,
      };
    });

    checkEndRound();
  };

  const canDefend = (attackCard, defendCard) => {
    const { trumpSuit } = gameState;

    // Check if the defending card is of the same suit and higher value
    if (
      attackCard.suit === defendCard.suit &&
      defendCard.value > attackCard.value
    ) {
      return true;
    }

    // Check if the defending card is a trump and the attacking card is not
    if (defendCard.suit === trumpSuit && attackCard.suit !== trumpSuit) {
      return true;
    }

    // If both cards are trumps, check if the defending card has a higher value
    if (
      defendCard.suit === trumpSuit &&
      attackCard.suit === trumpSuit &&
      defendCard.value > attackCard.value
    ) {
      return true;
    }

    return false;
  };

  const checkEndRound = () => {
    const allDefended = gameState.attackSlots.every((slot) => slot.defendCard);
    const maxAttacks = gameState.attackSlots.length >= 6;

    if (allDefended || maxAttacks) {
      endRound(allDefended);
    }
  };

  const endRound = (successful) => {
    setGameState((prevState) => {
      let updatedPlayers = [...prevState.players];
      let updatedDeck = [...prevState.deck];

      if (!successful) {
        // Defender picks up all cards
        const allCards = prevState.attackSlots.flatMap((slot) =>
          [slot.attackCard, slot.defendCard].filter(Boolean)
        );
        const defender = updatedPlayers.find(
          (p) => p.id === prevState.defender.id
        );
        defender.hand = [...defender.hand, ...allCards];
      }

      // Draw cards
      updatedPlayers = updatedPlayers.map((player) => {
        while (player.hand.length < 6 && updatedDeck.length > 0) {
          player.hand.push(updatedDeck.pop());
        }
        return player;
      });

      // Set new attacker and defender
      const newAttackerIndex =
        (updatedPlayers.findIndex((p) => p.id === prevState.defender.id) + 1) %
        updatedPlayers.length;
      const newDefenderIndex = (newAttackerIndex + 1) % updatedPlayers.length;

      return {
        ...prevState,
        players: updatedPlayers,
        deck: updatedDeck,
        attackSlots: [],
        primaryAttacker: updatedPlayers[newAttackerIndex],
        defender: updatedPlayers[newDefenderIndex],
        currentPlayer: updatedPlayers[newAttackerIndex],
        gamePhase: "attack",
      };
    });
  };

  const handlePickUp = () => {
    if (
      gameState.gamePhase === "defend" &&
      gameState.currentPlayer.id === gameState.defender.id
    ) {
      endRound(false);
    }
  };

  // ... (other helper functions remain the same)

  return (
    <div className="durac-game">
      <h1>Durac</h1>
      <div className="game-board">
        {gameState.players.map((player) => (
          <div
            key={player.id}
            className={`player ${
              player.id === gameState.currentPlayer.id ? "active" : ""
            }`}
          >
            <h2>{player.name}</h2>
            <Hand
              cards={player.hand}
              onCardClick={(card) => handleCardPlay(player.id, card)}
            />
            {player.id === gameState.defender.id &&
              gameState.gamePhase === "defend" && (
                <button onClick={handlePickUp}>Pick Up Cards</button>
              )}
          </div>
        ))}
        <div className="attack-slots">
          {gameState.attackSlots.map((slot) => (
            <div key={slot.id} className="attack-slot">
              <Card card={slot.attackCard} />
              {slot.defendCard && <Card card={slot.defendCard} />}
            </div>
          ))}
        </div>
        <div className="deck-area">
          <Deck cards={gameState.deck} />
        </div>
      </div>
      <Link to="/" className="back-link">
        Back to Home
      </Link>
    </div>
  );
}

export default Durac;
