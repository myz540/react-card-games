export default function Card({ card }) {
  return <div className={`card ${card.suit}`}>{card.icon}</div>;
}
