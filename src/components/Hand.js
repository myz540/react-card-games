import React from "react";
import Card from "./Card";
import { CARD_BACK } from "../constants";
import "./Hand.css";

const Hand = ({ player, isSelf, orientation, onCardPlay, isVertical }) => {
  return (
    <div
      className={`hand ${orientation} ${isSelf ? "self" : "other"} ${
        isVertical ? "vertical" : ""
      }`}
    >
      {player.hand.map((card, index) => (
        <div
          key={card.name}
          className={`hand-card ${
            index === player.hand.length - 1 ? "top" : "stacked"
          }`}
          style={{
            zIndex: index + 1,
            [isVertical ? "top" : "left"]: `${index * 20}px`,
          }}
          onClick={() => isSelf && onCardPlay(player.id, card)}
        >
          <Card card={isSelf ? card : CARD_BACK} faceUp={isSelf} />
        </div>
      ))}
      <div className="player-name">{player.name}</div>
    </div>
  );
};

export default Hand;
