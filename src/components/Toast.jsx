export default function Toast({ toasts }) {
  return (
    <div style={{ position: "fixed", bottom: 20, right: 20 }}>
      {toasts.map((t) => (
        <div key={t.id} style={{ background: "#fff", padding: 10, margin: 5 }}>
          {t.message}
        </div>
      ))}
    </div>
  );
}