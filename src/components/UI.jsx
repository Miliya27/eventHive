export function Btn({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "10px 18px",
        borderRadius: 8,
        border: "none",
        background: "#6366F1",
        color: "white",
        cursor: "pointer",
      }}
    >
      {children}
    </button>
  );
}