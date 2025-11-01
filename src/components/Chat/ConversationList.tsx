"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { socket } from "@/lib/socket";

type Conversation = {
    id: string;
    title?: string | null;
    isGroup?: boolean;
    participants: { user: { id: string; name: string; image: string } }[];
    messages: { content: string; createdAt: string }[];
    updatedAt: string;
    createdAt: string;
};

export default function ConversationList({
    onSelectConversation,
}: {
    onSelectConversation: (id: string) => void;
}) {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const { data: session } = useSession();

    useEffect(() => {
        async function loadConversations() {
            if (!session?.user?.id) return;
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/conversations?userId=${session.user.id}`
                );
                if (!res.ok) throw new Error("Failed to fetch conversations");
                const data = await res.json();
                setConversations(data);
            } catch (err) {
                console.error("❌ Load conversations error:", err);
            }
        }

        loadConversations();

        socket.on("message", (msg) => {
            setConversations((prev) => {
                const updated = prev.map((c) =>
                    c.id === msg.conversationId
                        ? {
                              ...c,
                              messages: [
                                  {
                                      content: msg.content,
                                      createdAt: msg.createdAt,
                                  },
                              ],
                          }
                        : c
                );

                if (!updated.find((c) => c.id === msg.conversationId)) {
                    updated.unshift({
                        id: msg.conversationId,
                        participants: msg.participants || [],
                        messages: [
                            { content: msg.content, createdAt: msg.createdAt },
                        ],
                        isGroup: false,
                        createdAt: msg.createdAt,
                        updatedAt: msg.createdAt,
                    });
                }

                updated.sort(
                    (a, b) =>
                        new Date(b.messages?.[0]?.createdAt || 0).getTime() -
                        new Date(a.messages?.[0]?.createdAt || 0).getTime()
                );

                return updated;
            });
        });

        socket.on("user_added", ({ conversationId, user }) => {
            if (!user) return;

            setConversations((prev) =>
                prev.map((c) =>
                    c.id === conversationId
                        ? {
                              ...c,
                              participants: [
                                  ...c.participants,
                                  {
                                      user: {
                                          id: user.id,
                                          name: user.name,
                                          image: user.image,
                                      },
                                  },
                              ],
                              isGroup:
                                  (c.participants?.length ?? 1) + 1 > 2
                                      ? true
                                      : c.isGroup,
                          }
                        : c
                )
            );
        });

        socket.on("conversation_update", async ({ conversationId }) => {
            try {
                if (!conversationId) return;

                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/conversations/${conversationId}`
                );
                if (!res.ok) return;

                const updated = await res.json();

                setConversations((prev) => {
                    const exists = prev.some((c) => c.id === conversationId);

                    const normalized = {
                        id: updated.id,
                        title: updated.title ?? null,
                        isGroup: updated.isGroup ?? false,
                        participants: updated.participants ?? [],

                        messages:
                            updated.messages && updated.messages.length > 0
                                ? [updated.messages[0]]
                                : [],
                        createdAt: updated.createdAt,
                        updatedAt: updated.updatedAt,
                    };

                    const next = exists
                        ? prev.map((c) =>
                              c.id === conversationId
                                  ? { ...c, ...normalized }
                                  : c
                          )
                        : [normalized, ...prev];

                    next.sort((a, b) => {
                        const aTs = new Date(
                            a.messages?.[0]?.createdAt || a.updatedAt || 0
                        ).getTime();
                        const bTs = new Date(
                            b.messages?.[0]?.createdAt || b.updatedAt || 0
                        ).getTime();
                        return bTs - aTs;
                    });

                    return next;
                });
            } catch (err) {
                console.error("❌ update error:", err);
            }
        });

        return () => {
            socket.off("message");
            socket.off("user_added");
            socket.off("conversation_update");
        };
    }, [session?.user?.id]);

    return (
        <ul className="space-y-2">
            {conversations.map((conv) => {
                return (
                    <li
                        key={conv.id}
                        onClick={() => onSelectConversation(conv.id)}
                        className="p-3 rounded-lg hover:bg-blue-50 cursor-pointer flex items-center gap-3 border-b border-gray-100 transition"
                    >
                        <div className="flex -space-x-3">
                            {conv.isGroup ? (
                                conv.participants
                                    .filter(
                                        (p) => p.user.id !== session?.user?.id
                                    )
                                    .slice(0, 3)
                                    .map((p, i) => (
                                        <Image
                                            key={i}
                                            src={p.user.image || "/file.svg"}
                                            alt={p.user.name || "User"}
                                            width={36}
                                            height={36}
                                            className="rounded-full border-2 border-white object-cover"
                                        />
                                    ))
                            ) : (
                                <Image
                                    src={
                                        conv.participants.find(
                                            (p) =>
                                                p.user.id !== session?.user?.id
                                        )?.user?.image || "/file.svg"
                                    }
                                    alt={
                                        conv.participants.find(
                                            (p) =>
                                                p.user.id !== session?.user?.id
                                        )?.user?.name || "User"
                                    }
                                    width={40}
                                    height={40}
                                    className="rounded-full object-cover"
                                />
                            )}
                        </div>

                        <div className="flex flex-col min-w-0 flex-1">
                            <span className="font-medium text-gray-900 truncate">
                                {conv.isGroup
                                    ? conv.title || "Groepsgesprek"
                                    : conv.participants.find(
                                          (p) => p.user.id !== session?.user?.id
                                      )?.user?.name || "Onbekend"}
                            </span>
                            <span className="text-sm text-gray-500 truncate">
                                {conv.messages?.[0]?.content ||
                                    "Geen berichten"}
                            </span>
                        </div>
                    </li>
                );
            })}
        </ul>
    );
}
