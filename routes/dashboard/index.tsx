import ChatBox from "../../islands/Chat/ChatBox.tsx";
import { useSignal } from "@preact/signals";

export default function Dashboard() {
  const messages = useSignal([]);

  return (
    <div>
      <h1>Dashboard</h1>
      <ChatBox message={messages} />
    </div>
  );
}
