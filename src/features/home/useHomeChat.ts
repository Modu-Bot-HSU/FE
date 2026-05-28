import { useCallback, useState } from "react";
import { askChat } from "../../apis/chat/ask";

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

  const sendText = useCallback(async (text: string) => {
    const t = text.trim();
    if (!t) return;
    setMessages((prev) => [...prev, { id: id(), role: "user", text: t }]);
    setInput("");
    setIsTyping(true);
    try {
      const response = await askChat({ question: t });
      setMessages((prev) => [
        ...prev,
        {
          id: id(),
          role: "assistant",
          text: response.answer,
        },
      ]);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "답변을 가져오지 못했습니다. 잠시 후 다시 시도해주세요.";
      setMessages((prev) => [
        ...prev,
        {
          id: id(),
          role: "assistant",
          text: message,
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  }, []);

  const sendFromInput = useCallback(() => {
    void sendText(input);
  }, [input, sendText]);

  const applySuggestion = useCallback(
    (label: string) => {
      setInput(label);
      void sendText(label);
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
