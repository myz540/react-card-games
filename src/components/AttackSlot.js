import React from "react";
import Card from "./Card";
import "./AttackSlot.css";

const AttackSlot = ({ attackCard, defendCard }) => {
  return (
    <div className={`attack-slot ${!attackCard ? "empty" : ""}`}>
      {attackCard && (
        <div className={`attack-card ${defendCard ? "sliver" : ""}`}>
          <Card card={attackCard} faceUp={true} />
        </div>
      )}
      {defendCard && (
        <div className="defend-card">
          <Card card={defendCard} faceUp={true} />
        </div>
      )}
    </div>
  );
};

export default AttackSlot;
