export default function Card({
  card,
  isDraggable = false,
  isDropZone = false,
}) {
  return (
    <div className={`card ${card.suit}`} draggable={isDraggable} >
      {card.icon}
    </div>
  );
}
