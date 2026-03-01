import { useState, useCallback } from "react";

export default function useToast() {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "info") => {
    const id = Date.now();
    setToasts((p) => [...p, { id, message, type }]);
    setTimeout(() => {
      setToasts((p) => p.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const removeToast = (id) =>
    setToasts((p) => p.filter((t) => t.id !== id));

  return { toasts, addToast, removeToast };
}