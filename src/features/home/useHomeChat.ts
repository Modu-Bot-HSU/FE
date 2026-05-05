import { useCallback, useState } from "react";

export type ChatRole = "user" | "assistant";

export type ChatMessage = {
  id: string;
  role: ChatRole;
  text: string;
};

const id = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export const useHomeChat = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const sendText = useCallback((text: string) => {
    const t = text.trim();
    if (!t) return;
    setMessages((prev) => [...prev, { id: id(), role: "user", text: t }]);
    setInput("");
    setIsTyping(true);
    window.setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: id(),
          role: "assistant",
          text: "Thanks for your message. Chat replies will connect to the campus assistant API here.",
        },
      ]);
      setIsTyping(false);
    }, 900);
  }, []);

  const sendFromInput = useCallback(() => {
    sendText(input);
  }, [input, sendText]);

  const applySuggestion = useCallback(
    (label: string) => {
      setInput(label);
      sendText(label);
    },
    [sendText],
  );

  const isChatActive = messages.length > 0;

  return {
    input,
    setInput,
    messages,
    isTyping,
    isChatActive,
    sendFromInput,
    applySuggestion,
  };
};
