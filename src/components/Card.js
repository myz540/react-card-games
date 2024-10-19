export default function Card({ card, isSelected = false }) {
  return (
    <div className={`card ${card.suit} ${isSelected ? "selected" : ""}`}>
      {card.icon}
    </div>
  );
}
