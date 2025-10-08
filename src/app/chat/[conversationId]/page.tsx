import { use } from "react";
import ChatWindow from "@/components/Chat/ChatWindow";

export default function ChatConversationPage({
    params,
}: {
    params: Promise<{ conversationId: string }>;
}) {
    const { conversationId } = use(params);

    return (
        <div className="flex flex-col flex-1 h-full min-h-0">
            <ChatWindow conversationId={conversationId} />
        </div>
    );
}
