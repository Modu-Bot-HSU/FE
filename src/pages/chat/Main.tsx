import { HOME_BG } from "../../features/home/homeConstants";
import { useHomeChat } from "../../features/home/useHomeChat";
import { CHAT_SAFE_TOP_CLASS } from "../../utils/layout";
import HomeChatView from "./ChatView";
import HomeComposer from "./Composer";
import HomeDefaultView from "./DefaultView";

export default function HomeMain() {
  const chat = useHomeChat();

  return (
    <div
      className={`flex min-h-full flex-col px-4 ${CHAT_SAFE_TOP_CLASS}`}
      style={{ backgroundColor: HOME_BG }}
    >
      {chat.isChatActive ? (
        <HomeChatView messages={chat.messages} isTyping={chat.isTyping} />
      ) : (
        <HomeDefaultView onPickSuggestion={chat.applySuggestion} />
      )}
      <HomeComposer
        value={chat.input}
        onChange={chat.setInput}
        onSend={chat.sendFromInput}
        disabled={chat.isTyping}
      />
    </div>
  );
}
