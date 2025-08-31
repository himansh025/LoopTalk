// MessageInput.tsx
import React, { useState } from "react";

interface Props {
  onSend: (text: string) => void;
  placeholder?: string;
}

export default function MessageInput({ onSend, placeholder = "Type a message..." }: Props) {
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setSending(true);
    await onSend(input.trim());
    setInput("");
    setSending(false);
  };

  return (
    <form
      onSubmit={handleSend}
      className="p-3 border-t border-gray-200 bg-white flex items-center gap-2"
    >
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={placeholder}
        className="flex-1 px-3 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-400"
        disabled={sending}
      />

      <button
        type="submit"
        disabled={sending || !input.trim()}
        className="bg-blue-600 text-white rounded-full px-4 py-2 disabled:opacity-60"
      >
        {sending ? "..." : "Send"}
      </button>
    </form>
  );
}