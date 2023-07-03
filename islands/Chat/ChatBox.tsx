import { Signal, signal } from "@preact/signals";
import { useRef, useState } from "preact/hooks";

interface Message {
  assistant: string;
  user: string;
}

interface ChatBoxProps {
  message: Signal<Message[]>;
}

export default function ChatBox(props: ChatBoxProps) {
  const currentMessage = signal<string | null>(null);
  const chatInput = useRef<HTMLInputElement>(null);
  const [messages, setMessages] = useState<string[]>([]);

  const generate = async (prompt: string) => {
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    if (res.body) {
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let chatMessage = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.includes("[DONE]")) {
            currentMessage.value = null;
            setMessages([...messages, chatMessage]);
          } else if (line.startsWith("data:")) {
            try {
              const data = JSON.parse(line.slice(5));

              chatMessage += data.choices[0]?.delta?.content || "";
              currentMessage.value = chatMessage;
            } catch {
              return;
            }
          }
        }
      }
    }
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();

    if (!chatInput.current) return;
    await generate(chatInput.current.value);
    chatInput.current.value = "";
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex-1 flex flex-col">
        {messages.map((message) => (
          <div>{message}</div>
        ))}
        <div>{currentMessage}</div>
      </div>
      <form className="" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Type your message here"
          className="border border-gray-400 p-2"
          ref={chatInput}
        />
        <button className="bg-black text-white p-2 border-1 border-black">
          Go
        </button>
      </form>
    </div>
  );
}
