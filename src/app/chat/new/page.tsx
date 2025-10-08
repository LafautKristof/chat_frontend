"use client";

import ChatWindow from "@/components/Chat/ChatWindow";
import { useRouter } from "next/navigation";
import { use } from "react";

export default function NewChatPage({
    searchParams,
}: {
    searchParams: Promise<{ recipientId?: string }>;
}) {
    const router = useRouter();
    const { recipientId } = use(searchParams);

    if (!recipientId) {
        return (
            <div className="flex items-center justify-center flex-1 text-gray-500">
                No recipient selected 😕
            </div>
        );
    }

    return (
        <div className="flex flex-col flex-1">
            <ChatWindow
                recipientId={recipientId}
                onNewConversation={(newId) => {
                    router.replace(`/chat/${newId}`);
                }}
            />
        </div>
    );
}
