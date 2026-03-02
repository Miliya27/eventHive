import EventCard from "./EventCard";

export default function EventsListing({ events }) {
  return (
    <div style={{ display: "grid", gap: 10 }}>
      {events.map((e) => (
        <EventCard key={e.id} event={e} />
      ))}
    </div>
  );
}