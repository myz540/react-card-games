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

  useEffect(() => {
    if (gameState.gamePhase !== "setup") {
      positionHands();
    }
  }, [gameState.players, gameState.gamePhase]);

  const positionHands = () => {
    const handElements = document.querySelectorAll(".durac-player-hand");
    const totalPlayers = gameState.players.length;
    handElements.forEach((hand, index) => {
      const angle = (index / totalPlayers) * 2 * Math.PI;
      const x = 300 + 250 * Math.sin(angle);
      const y = 300 - 250 * Math.cos(angle);
      hand.style.left = `${x}px`;
      hand.style.top = `${y}px`;
      hand.style.transform = `rotate(${(angle * 180) / Math.PI}deg)`;
    });
  };

  const renderHand = (player) => {
    const isSelf = player.id === 1; // Assuming you (developer) are always Player 1
    return (
      <div className={`durac-hand ${isSelf ? "self" : "other"}`}>
        {player.hand.map((card, index) => (
          <div
            key={index}
            className={`durac-card-wrapper ${
              index === player.hand.length - 1 ? "top" : "sliver"
            }`}
            style={{
              zIndex: index + 1,
              left: `${index * 20}px`, // Offset each card to create a sliver effect
            }}
            onClick={() => isSelf && handleCardPlay(player.id, card)}
          >
            <Card
              card={isSelf ? card : CARD_BACK}
              faceUp={true} // Always true because we're using CARD_BACK for other players
            />
          </div>
        ))}
      </div>
    );
  };

  const renderAttackSlots = () => (
    <div className="durac-attack-slots">
      {Array(6)
        .fill(null)
        .map((_, index) => (
          <div key={index} className="durac-attack-slot">
            {gameState.attackSlots[index]?.attackCard && (
              <Card
                card={gameState.attackSlots[index].attackCard}
                faceUp={true}
              />
            )}
            {gameState.attackSlots[index]?.defendCard && (
              <Card
                card={gameState.attackSlots[index].defendCard}
                faceUp={true}
              />
            )}
          </div>
        ))}
    </div>
  );

  const renderGameInfo = () => (
    <div className="durac-game-info">
      <div className="durac-deck-count">{gameState.deck.length} cards left</div>
      <div className="durac-trump-suit">Trump: {gameState.trumpSuit}</div>
    </div>
  );

  const handleBackClick = () => {
    console.log("Back link clicked");
  };

  const renderGameBoard = () => (
    <div className="durac-game-board">
      <Link
        to="/"
        className="back-link"
        onClick={handleBackClick}
        style={{
          position: "absolute",
          top: "10px",
          left: "10px",
          zIndex: 1000,
          padding: "10px",
          background: "white",
          border: "1px solid black",
          cursor: "pointer",
        }}
      >
        Back to Home
      </Link>
      {/* Temporary anchor tag for testing */}
      <a
        href="/"
        className="back-link-test"
        onClick={(e) => {
          e.preventDefault();
          console.log("Test anchor clicked");
        }}
        style={{
          position: "absolute",
          top: "50px",
          left: "10px",
          zIndex: 1000,
          padding: "10px",
          background: "white",
          border: "1px solid black",
          cursor: "pointer",
        }}
      >
        Test Back Link
      </a>
      {renderGameInfo()}
      <div className="durac-hands-circle">
        {gameState.players.map((player) => (
          <div key={player.id} className="durac-player-hand">
            {renderHand(player)}
            <div className="player-name">{player.name}</div>
          </div>
        ))}
      </div>
      <div className="durac-center-area">
        {renderAttackSlots()}
        {gameState.gamePhase === "defend" && gameState.defender.id === 1 && (
          <button className="pickup-button" onClick={handlePickUp}>
            Pick Up
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="durac-game">
      {gameState.gamePhase === "setup" ? (
        <button onClick={initializeGame}>Start Game</button>
      ) : (
        renderGameBoard()
      )}
    </div>
  );
}

export default Durac;
