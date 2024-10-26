import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Deck from "../components/Deck";
import Hand from "../components/Hand";
import Card from "../components/Card";
import { CARD_MAP, CARD_BACK, shuffle } from "../constants";
import "./Durac.css";

function Durac() {
  const [gameState, setGameState] = useState({
    players: [],
    deck: [],
    attackSlots: [],
    primaryAttacker: null,
    defender: null,
    currentPlayer: null,
    gamePhase: "setup",
    trumpSuit: null,
    validAttackValues: [],
  });

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    const deck = shuffle(CARD_MAP);
    const trumpCard = deck[deck.length - 1];
    const trumpSuit = trumpCard.suit;

    const players = [
      { id: 1, name: "Player 1", hand: [] },
      { id: 2, name: "Player 2", hand: [] },
      { id: 3, name: "Player 3", hand: [] },
      { id: 4, name: "Player 4", hand: [] },
    ];

    // Deal cards to players
    players.forEach((player) => {
      for (let i = 0; i < 6; i++) {
        player.hand.push(deck.pop());
      }
    });

    setGameState({
      players,
      deck,
      trumpSuit,
      primaryAttacker: players[0],
      defender: players[1],
      currentPlayer: players[0],
      gamePhase: "attack",
      attackSlots: [],
      validAttackValues: [],
    });
  };

  const handleCardPlay = (playerId, card) => {
    if (gameState.gamePhase === "attack") {
      handleAttack(playerId, card);
    } else if (gameState.gamePhase === "defend") {
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
      const updatedValidAttackValues = [
        ...new Set([...prevState.validAttackValues, card.value]),
      ];

      return {
        ...prevState,
        players: updatedPlayers,
        attackSlots: updatedAttackSlots,
        validAttackValues: updatedValidAttackValues,
        gamePhase: "defend",
        currentPlayer: prevState.defender,
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

      if (
        !canDefend(undefendedAttackSlot.attackCard, card, prevState.trumpSuit)
      ) {
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

      const updatedValidAttackValues = [
        ...new Set([...prevState.validAttackValues, card.value]),
      ];

      return {
        ...prevState,
        players: updatedPlayers,
        attackSlots: updatedAttackSlots,
        validAttackValues: updatedValidAttackValues,
        gamePhase: "attack",
        currentPlayer: prevState.primaryAttacker,
      };
    });

    checkEndRound();
  };

  const canDefend = (attackCard, defendCard, trumpSuit) => {
    if (
      attackCard.suit === defendCard.suit &&
      defendCard.value > attackCard.value
    ) {
      return true;
    }
    if (defendCard.suit === trumpSuit && attackCard.suit !== trumpSuit) {
      return true;
    }
    return false;
  };

  const checkEndRound = () => {
    setGameState((prevState) => {
      const allDefended = prevState.attackSlots.every(
        (slot) => slot.defendCard
      );
      const maxAttacks = prevState.attackSlots.length >= 6;

      if (allDefended || maxAttacks) {
        return endRound(prevState, allDefended);
      }

      return prevState;
    });
  };

  const endRound = (prevState, successful) => {
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
      validAttackValues: [],
    };
  };

  const handlePickUp = () => {
    if (
      gameState.gamePhase === "defend" &&
      gameState.currentPlayer.id === gameState.defender.id
    ) {
      setGameState((prevState) => endRound(prevState, false));
    }
  };

  const renderAttackSlots = () => (
    <div className="durac-attack-slots">
      {gameState.attackSlots.map((slot) => (
        <div key={slot.id} className="durac-attack-slot">
          {slot.attackCard && <Card card={slot.attackCard} faceUp={true} />}
          {slot.defendCard && <Card card={slot.defendCard} faceUp={true} />}
        </div>
      ))}
      {/* Add empty slots if needed */}
      {[...Array(6 - gameState.attackSlots.length)].map((_, index) => (
        <div key={`empty-${index}`} className="durac-attack-slot empty"></div>
      ))}
    </div>
  );

  const renderGameBoard = () => {
    const centerX = 400; // Half of the game board width
    const centerY = 400; // Half of the game board height
    const radius = 300; // Adjust this value to change the size of the circle

    return (
      <div className="durac-game-board">
        <div className="durac-hands-circle">
          {gameState.players.map((player, index) => {
            const angle = (index * Math.PI) / 2; // Divide the circle into 4 parts
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);

            return (
              <div
                key={player.id}
                className="durac-player-hand"
                style={{
                  position: "absolute",
                  left: `${x}px`,
                  top: `${y}px`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <Hand
                  player={player}
                  isSelf={player.id === 1}
                  onCardPlay={handleCardPlay}
                />
              </div>
            );
          })}
        </div>
        <div className="durac-center-area">
          {renderAttackSlots()}
          {gameState.gamePhase === "defend" && gameState.defender.id === 1 && (
            <button
              className="pickup-button durac-button"
              onClick={handlePickUp}
            >
              Pick Up
            </button>
          )}
        </div>
        {renderGameInfo()}
        <Link to="/" className="back-link" onClick={handleBackClick}>
          Back to Home
        </Link>
      </div>
    );
  };

  const restartGame = () => {
    setGameState({
      players: [],
      deck: [],
      attackSlots: [],
      primaryAttacker: null,
      defender: null,
      currentPlayer: null,
      gamePhase: "setup",
      trumpSuit: null,
      validAttackValues: [],
    });
  };

  const renderGameInfo = () => (
    <div className="durac-game-info">
      <div className="durac-deck-count">{gameState.deck.length} cards left</div>
      <div className="durac-trump-suit">Trump: {gameState.trumpSuit}</div>
      <button className="restart-button durac-button" onClick={restartGame}>
        Restart Game
      </button>
    </div>
  );

  const handleBackClick = () => {
    console.log("Back link clicked");
  };

  return (
    <div className="durac-game">
      {gameState.gamePhase === "setup" ? (
        <div className="start-game-wrapper">
          <button
            className="start-game-button durac-button"
            onClick={initializeGame}
          >
            Start Game
          </button>
        </div>
      ) : (
        renderGameBoard()
      )}
    </div>
  );
}

export default Durac;
