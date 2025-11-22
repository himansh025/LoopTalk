import React, { useState } from "react";
import { Send, Paperclip, Image as ImageIcon, Smile } from "lucide-react";

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
      className="flex items-center gap-2"
    >
      <div className="flex gap-1 text-slate-400">
        <button type="button" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <Paperclip size={20} />
        </button>
        <button type="button" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <ImageIcon size={20} />
        </button>
      </div>

      <div className="flex-1 relative">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-slate-100 border-none rounded-full px-4 py-3 focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all text-slate-800 placeholder:text-slate-400 outline-none"
          disabled={sending}
        />
        <button
          type="button"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
        >
          <Smile size={20} />
        </button>
      </div>

      <button
        type="submit"
        disabled={sending || !input.trim()}
        className="relative p-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 transition-all shadow-sm hover:shadow-md"
      >
        <Send size={20} className={sending ? "opacity-0" : "opacity-100"} />
        {sending && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          </div>
        )}
      </button>
    </form>
  );
}