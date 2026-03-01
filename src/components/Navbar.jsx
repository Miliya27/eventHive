import { Btn } from "./UI";

export default function Navbar({ user, onLogin, onSignup }) {
  return (
    <nav style={{ padding: 16, display: "flex", justifyContent: "space-between" }}>
      <h2>🏛️ EduEvents</h2>

      {!user && (
        <div>
          <Btn onClick={onLogin}>Login</Btn>{" "}
          <Btn onClick={onSignup}>Signup</Btn>
        </div>
      )}
    </nav>
  );
}