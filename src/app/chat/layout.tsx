"use client";

import { useState } from "react";
import ConversationList from "@/components/Chat/ConversationList";
import ChatWindow from "@/components/Chat/ChatWindow";
import { ArrowLeft } from "lucide-react";

export default function ChatLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [activeConversation, setActiveConversation] = useState<{
        conversationId?: string;
        recipientId?: string;
    } | null>(null);

    const isMobileView = activeConversation !== null; // tonen chat als er gesprek actief is

    return (
        <div className="flex h-full min-h-0">
            {/* 🔹 Sidebar */}
            <aside
                className={`
          w-64 bg-white border-r p-4 flex flex-col shadow-sm
          transition-all duration-300
          ${isMobileView ? "hidden sm:flex" : "flex w-full sm:w-64"}
        `}
            >
                <h2 className="text-lg font-semibold mb-4">Conversations</h2>
                <div className="flex-1 overflow-y-auto p-4">
                    <ConversationList
                        onSelectConversation={(conversationId) =>
                            setActiveConversation({ conversationId })
                        }
                    />
                </div>
            </aside>

            {/* 🔹 Main Chat Area */}
            <main
                className={`
          flex-1 min-h-0 flex flex-col overflow-hidden
          ${!isMobileView ? "hidden sm:flex" : "flex w-full"}
        `}
            >
                {activeConversation ? (
                    <>
                        {/* 🔙 Terugknop voor mobiel */}
                        <div className="sm:hidden flex items-center gap-2 bg-gray-100 border-b p-2">
                            <button
                                onClick={() => setActiveConversation(null)}
                                className="p-2 rounded-md hover:bg-gray-200"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                            <span className="font-semibold">Chat</span>
                        </div>

                        <ChatWindow
                            conversationId={activeConversation.conversationId}
                            recipientId={activeConversation.recipientId}
                        />
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-gray-500">
                        {children}
                    </div>
                )}
            </main>
        </div>
    );
}
