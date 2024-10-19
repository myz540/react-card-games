import React from "react";
import Card from "./Card";
import { CARD_BACK } from "../constants";

export default function Foundation({ suit, cards, onClick }) {
  const topCard = cards.length > 0 ? cards[cards.length - 1] : null;

  return (
    <div className="foundation" onClick={onClick}>
      {topCard ? <Card card={topCard} /> : <Card card={CARD_BACK} />}
      <p>{suit}</p>
    </div>
  );
}
