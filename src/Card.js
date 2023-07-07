export default function Card({ card }) {
  return (
    <div className={`card ${card.suit}`} draggable>
      {card.icon}
    </div>
  );
}
