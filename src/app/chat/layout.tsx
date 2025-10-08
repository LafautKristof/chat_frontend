"use client";

import { useState } from "react";
import ConversationList from "@/components/Chat/ConversationList";
import ChatWindow from "@/components/Chat/ChatWindow";

export default function ChatLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [activeConversation, setActiveConversation] = useState<{
        conversationId?: string;
        recipientId?: string;
    } | null>(null);

    return (
        <div className="flex h-full min-h-0">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r p-4 flex flex-col shadow-sm">
                <h2 className="text-lg font-semibold mb-4">Conversations</h2>
                <div className="flex-1 overflow-y-auto p-4">
                    <ConversationList
                        onSelectConversation={(conversationId) =>
                            setActiveConversation({ conversationId })
                        }
                    />
                </div>
            </aside>

            {/* Main Chat Area */}
            <main className="flex-1 min-h-0 flex flex-col overflow-hidden">
                {activeConversation ? (
                    <ChatWindow
                        conversationId={activeConversation.conversationId}
                        recipientId={activeConversation.recipientId}
                    />
                ) : (
                    <div className="flex-1 flex items-center justify-center text-gray-500">
                        {children}
                    </div>
                )}
            </main>
        </div>
    );
}
