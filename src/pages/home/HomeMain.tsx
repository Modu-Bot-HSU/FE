import { HOME_BG } from "../../features/home/homeConstants";
import { useHomeChat } from "../../features/home/useHomeChat";
import HomeChatView from "./HomeChatView";
import HomeComposer from "./HomeComposer";
import HomeDefaultView from "./HomeDefaultView";
import HomeMainHeader from "./HomeMainHeader";

export default function HomeMain() {
  const chat = useHomeChat();

  return (
    <div className="min-h-[calc(100vh-0px)] flex flex-col px-4" style={{ backgroundColor: HOME_BG }}>
      <HomeMainHeader />
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
