import Card from "./Card";

export default function Hand({ cards }) {
  return (
    <div className="hand">
      {cards.map((c) => (
        <Card card={c} key={c.name} />
      ))}
    </div>
  );
}
