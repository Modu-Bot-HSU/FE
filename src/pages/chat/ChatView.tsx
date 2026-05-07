import type { ChatMessage } from "../../features/home/useHomeChat";

type Props = {
  messages: ChatMessage[];
  isTyping: boolean;
};

export default function HomeChatView({ messages, isTyping }: Props) {
  return (
    <div className="flex-1 min-h-0 overflow-y-auto px-1 pb-4 space-y-4">
      {messages.map((m) =>
        m.role === "user" ? (
          <div key={m.id} className="flex justify-end">
            <div className="max-w-[85%] rounded-2xl bg-gray-200/90 px-3.5 py-2.5 text-sm text-gray-800">
              {m.text}
            </div>
          </div>
        ) : (
          <div key={m.id} className="max-w-[92%] text-sm text-gray-800 leading-relaxed">
            {m.text}
          </div>
        ),
      )}
      {isTyping ? (
        <div className="text-sm text-gray-400 pl-1" aria-live="polite">
          ···
        </div>
      ) : null}
    </div>
  );
}
