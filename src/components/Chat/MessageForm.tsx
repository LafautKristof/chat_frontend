"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";

import { socket } from "@/lib/socket";
import SettingsPopover from "./SettingsPopover";
import EmojiPopover from "./EmojiPopover";
import GifPopover from "./GifPopover";
import InvitePopover from "./InvitePopover";

export default function MessageForm({
    conversationId,
    recipientId,
    onNewConversation,
    onSettingsChange,
    background: initialBackground,
    title: initialTitle,
    onTitleChange,

    participants = [],
}: {
    conversationId?: string;
    recipientId?: string;
    onNewConversation?: (conversationId: string) => void;
    onSettingsChange?: (background: string) => void;
    background?: string;
    title?: string;
    onTitleChange?: (title: string) => void;

    participants?: { user: { id: string } }[];
}) {
    const { data: session } = useSession();
    const [content, setContent] = useState("");

    const [background, setBackground] = useState(
        initialBackground ?? "#ffffff"
    );
    const [title, setTitle] = useState(initialTitle ?? "");

    const typingTimeout = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (!socket.connected) socket.connect();
        return () => {
            if (socket.connected) socket.disconnect();
        };
    }, []);

    function handleTyping() {
        if (conversationId && session?.user) {
            socket.emit("typing", {
                conversationId,
                user: session.user.name,
                userId: session.user.id,
            });

            if (typingTimeout.current) clearTimeout(typingTimeout.current);
            typingTimeout.current = setTimeout(handleStopTyping, 2000);
        }
    }

    function handleStopTyping() {
        if (conversationId && session?.user?.name) {
            socket.emit("stop_typing", {
                conversationId,
                user: session.user.name,
                userId: session.user.id,
            });
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!content.trim() || !session?.user?.id) return;

        handleStopTyping();

        const isGif =
            /\.(gif)$/i.test(content) || content.includes("tenor.com");

        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/messages`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    senderId: session.user.id,
                    recipientId,
                    conversationId,
                    content,
                    type: isGif ? "gif" : "text",
                }),
            }
        );

        if (res.ok) {
            const msg = await res.json();
            if (!conversationId && msg.conversationId && onNewConversation) {
                onNewConversation(msg.conversationId);
            }
            setContent("");
        }
    }

    async function sendGif(url: string) {
        if (!session?.user?.id) return;

        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/messages`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    senderId: session.user.id,
                    recipientId,
                    conversationId,
                    content: url,
                    type: "gif",
                }),
            }
        );

        if (res.ok) {
            const msg = await res.json();
            if (!conversationId && msg.conversationId && onNewConversation) {
                onNewConversation(msg.conversationId);
            }
        }
    }
    async function handleSaveSettings() {
        if (!conversationId) return;
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/conversations/${conversationId}/customize`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ title, background }),
                }
            );
            if (!res.ok) throw new Error("Failed to save settings");

            if (onSettingsChange) onSettingsChange(background);
        } catch (e) {
            console.error("❌ Settings error:", e);
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="sticky bottom-0 flex items-center gap-2 border-t bg-white p-3 shadow-inner"
        >
            <SettingsPopover
                conversationId={conversationId}
                title={title}
                background={background}
                onTitleChange={(newTitle) => {
                    setTitle(newTitle);
                    if (onTitleChange) onTitleChange(newTitle);
                }}
                onBackgroundChange={(newColor) => {
                    setBackground(newColor);
                    if (onSettingsChange) onSettingsChange(newColor);
                }}
                onSave={handleSaveSettings}
            />

            <EmojiPopover onSelect={(emoji) => setContent(content + emoji)} />

            <GifPopover onSelect={(url) => sendGif(url)} />

            <InvitePopover
                conversationId={conversationId}
                participants={participants}
            />

            <input
                className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                value={content}
                onChange={(e) => {
                    setContent(e.target.value);
                    handleTyping();
                }}
                onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit(e);
                    }
                }}
                placeholder="Type your message..."
            />

            <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition"
            >
                Send
            </button>
        </form>
    );
}
