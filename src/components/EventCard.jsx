export default function EventCard({ event, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{ border: "1px solid #ddd", padding: 16, borderRadius: 10 }}
    >
      <h3>{event.title}</h3>
      <p>{event.clubName}</p>
      <p>{event.date}</p>
    </div>
  );
}