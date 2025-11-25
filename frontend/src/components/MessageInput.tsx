import React, { useState } from "react";
import { Send, Paperclip, Image as ImageIcon, Smile } from "lucide-react";
import { Button } from "./ui/Button";

interface Props {
  onSend: (text: string) => void;
  placeholder?: string;
}

export default function MessageInput({
  onSend,
  placeholder = "Type a message...",
}: Props) {
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
    <form onSubmit={handleSend} className="flex items-center gap-2">
      <div className="flex gap-1 text-slate-400">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="rounded-full p-2"
        >
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="rounded-full p-2"
        >
          <ImageIcon size={20} />
        </Button>
      </div>

      <div className="relative flex-1">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-full border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 placeholder:text-slate-400 transition-all focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          disabled={sending}
        />
        <button
          type="button"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
        >
          <Smile size={20} />
        </button>
      </div>

      <Button
        type="submit"
        disabled={sending || !input.trim()}
        className="rounded-full p-3"
        isLoading={sending}
      >
        {!sending && <Send size={20} />}
      </Button>
    </form>
  );
}