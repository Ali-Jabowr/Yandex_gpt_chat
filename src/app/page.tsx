import Image from "next/image";
import ChatContainer from '@/components/ChatContainer';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 p-4">
      <h1 className="text-2xl font-bold text-center mb-4">Yandex GPT Chat</h1>
      <ChatContainer />
    </main>
  );
}