"use client";
import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import MessageForm from "@/components/Chat/MessageForm";
import Image from "next/image";
import getInitials from "@/app/helpers/getInitals";
import { socket } from "@/lib/socket";
import {
    ConversationData,
    Message,
    Participants,
    User,
} from "@/app/types/types";

export default function ChatWindow({
    conversationId: initialConversationId,
    recipientId,
    onNewConversation,
}: {
    conversationId?: string;
    recipientId?: string;
    onNewConversation?: (conversationId: string) => void;
}) {
    const [conversationId, setConversationId] = useState(initialConversationId);
    const [messages, setMessages] = useState<Message[]>([]);
    const [participants, setParticipants] = useState<Participants[]>([]);
    const [availableUsers, setAvailableUsers] = useState<User[]>([]);
    const [typingUser, setTypingUser] = useState<string | null>(null);
    const { data: session } = useSession();
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const messagesContainerRef = useRef<HTMLDivElement | null>(null);
    const [background, setBackground] = useState("#ffffff");
    const [title, setTitle] = useState("");

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        if (initialConversationId) setConversationId(initialConversationId);
    }, [initialConversationId]);

    useEffect(() => {
        if (!conversationId) return;

        async function loadConversation() {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/messages/${conversationId}`
            );
            if (!res.ok) return;
            const msgs = await res.json();
            setMessages(msgs);

            const convRes = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/conversations/${conversationId}`
            );
            if (convRes.ok) {
                const convData: ConversationData = await convRes.json();
                setParticipants(convData.participants ?? []);
                setBackground(convData.background);
                setTitle(convData.title ?? "");
            }
        }

        loadConversation();

        socket.emit("join_conversation", conversationId);

        socket.on("message", (msg) => {
            if (msg.conversationId === conversationId) {
                setMessages((prev) => [...prev, msg]);
            }
        });

        socket.on("typing", ({ user, userId }) => {
            if (userId !== session?.user?.id) setTypingUser(user);
        });

        socket.on("stop_typing", ({ userId }) => {
            if (userId !== session?.user?.id) setTypingUser(null);
        });

        socket.on("system_message", (data) => {
            if (data.conversationId !== conversationId) return;

            const systemMsg: Message = {
                id: `system-${Date.now()}`,
                content: data.message,
                type: "system",
                conversationId,
                createdAt: new Date().toISOString(),
                sender: undefined,
                senderId: undefined,
            };

            setMessages((prev) => [...prev, systemMsg]);
        });

        return () => {
            socket.emit("leave_conversation", conversationId);
            socket.off("message");
            socket.off("typing");
            socket.off("stop_typing");
            socket.off("system_message");
        };
    }, [conversationId, session?.user?.id]);

    useEffect(() => {
        async function loadUsers() {
            if (!session?.user?.id) return;
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/users?excludeId=${session.user.id}`
            );
            if (!res.ok) return;

            const users = await res.json();
            const participantIds = participants.map((p) => p.user.id);
            setAvailableUsers(
                users.filter((u: User) => !participantIds.includes(u.id))
            );
        }

        loadUsers();
    }, [participants, session?.user?.id]);

    const handleScroll = () => {
        if (!messagesContainerRef.current) return;
        const { scrollTop } = messagesContainerRef.current;
        if (scrollTop === 0) console.log("⬆️ Load older messages...");
    };

    return (
        <div
            className="flex flex-col flex-1 h-full min-h-0 rounded-lg shadow-inner"
            style={{ backgroundColor: background }}
        >
            <div
                ref={messagesContainerRef}
                onScroll={handleScroll}
                className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4"
            >
                {messages.map((m, i) => {
                    if (m.type === "system") {
                        return (
                            <p
                                key={`system-${i}`}
                                className="text-center text-xs text-gray-400 italic my-2"
                            >
                                {m.content}
                            </p>
                        );
                    }

                    const isMe = m.sender?.id === session?.user?.id;

                    return (
                        <div
                            key={i}
                            className={`flex items-start gap-2 ${
                                isMe ? "justify-end" : "justify-start"
                            }`}
                        >
                            {!isMe &&
                                (m.sender?.image ? (
                                    <Image
                                        src={m.sender.image}
                                        alt={m.sender.name}
                                        className="rounded-full"
                                        width={32}
                                        height={32}
                                    />
                                ) : (
                                    <div className="w-8 h-8 bg-gray-500 text-white rounded-full flex items-center justify-center">
                                        {getInitials(m.sender?.name || "?")}
                                    </div>
                                ))}

                            <div
                                className={`max-w-xs px-3 py-2 rounded-lg ${
                                    isMe
                                        ? "bg-blue-500 text-white"
                                        : "bg-gray-100 text-gray-900"
                                }`}
                            >
                                {!isMe && (
                                    <b className="block text-sm mb-1">
                                        {m.sender?.name}
                                    </b>
                                )}

                                {m.type === "gif" ? (
                                    <Image
                                        src={m.content}
                                        alt="GIF"
                                        width={200}
                                        height={200}
                                        className="rounded-lg max-w-[200px] shadow-md"
                                    />
                                ) : (
                                    <p className="break-words">{m.content}</p>
                                )}
                            </div>
                        </div>
                    );
                })}

                {typingUser && (
                    <div className="italic text-sm text-gray-500">
                        {typingUser} is typing...
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            <div className="shrink-0 bg-white border-t shadow-md">
                <MessageForm
                    conversationId={conversationId}
                    recipientId={recipientId}
                    onNewConversation={(newId) => {
                        setConversationId(newId);
                        socket.emit("join_conversation", newId);
                        window.history.replaceState(null, "", `/chat/${newId}`);

                        onNewConversation?.(newId);
                    }}
                    onSettingsChange={(background) => setBackground(background)}
                    background={background}
                    title={title}
                    onTitleChange={(t) => setTitle(t)}
                    participants={participants}
                />
            </div>
        </div>
    );
}
