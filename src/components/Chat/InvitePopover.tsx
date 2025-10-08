"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { UserPlus, Search } from "lucide-react";
import { socket } from "@/lib/socket";
import { User } from "@/app/types/types";

export default function InvitePopover({
    conversationId,
    participants = [],
}: {
    conversationId?: string;
    participants?: { user: { id: string } }[];
}) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [invitedIds, setInvitedIds] = useState<string[]>([]);
    const existingIds = participants.map((p) => p.user.id);
    // 🔎 Live zoeken op naam

    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            return;
        }

        const delay = setTimeout(async () => {
            setLoading(true);
            try {
                const res = await fetch(
                    `${
                        process.env.NEXT_PUBLIC_BACKEND_URL
                    }/users/search?name=${encodeURIComponent(query)}`
                );
                if (res.ok) {
                    const users = await res.json();
                    setResults(users);
                }
            } catch (err) {
                console.error("❌ Search error:", err);
            } finally {
                setLoading(false);
            }
        }, 400);

        return () => clearTimeout(delay);
    }, [query]);

    // ➕ Gebruiker toevoegen of uitnodigen
    async function handleInvite(userId: string) {
        if (!conversationId) return;

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/conversations/${conversationId}/invite`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ userId }),
                }
            );

            if (!res.ok) throw new Error("Kon gebruiker niet uitnodigen");
            const data = await res.json();

            // ✅ Hier pak je de juiste user uit de response
            socket.emit("user_added", {
                conversationId,
                user: {
                    id: data.participant.user.id,
                    name: data.participant.user.name,
                    image: data.participant.user.image,
                },
            });

            setInvitedIds((prev) => [...prev, userId]);
        } catch (err) {
            console.error("❌ Invite error:", err);
        }
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <button
                    type="button"
                    className="p-2 hover:bg-gray-200 rounded transition"
                    title="Gebruiker uitnodigen"
                >
                    <UserPlus size={22} />
                </button>
            </PopoverTrigger>

            <PopoverContent
                side="top"
                align="start"
                className="bg-white border rounded-lg shadow-lg p-3 w-72"
            >
                <h3 className="font-medium text-sm mb-2">
                    Gebruiker uitnodigen
                </h3>

                {/* 🔎 Zoekveld */}
                <div className="flex gap-2 mb-3">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Zoek op naam..."
                        className="flex-1 border rounded px-2 py-1 text-sm"
                    />
                    <button
                        type="button"
                        onClick={() => setQuery(query)}
                        className="p-1 bg-blue-500 text-white rounded"
                    >
                        <Search size={16} />
                    </button>
                </div>

                {loading && (
                    <p className="text-xs text-gray-400 mb-2">Zoeken...</p>
                )}

                {/* 👥 Resultatenlijst */}
                <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
                    {results.length > 0
                        ? results.map((user) => {
                              const alreadyInChat = existingIds.includes(
                                  user.id
                              );
                              const alreadyInvited = invitedIds.includes(
                                  user.id
                              );
                              const disabled = alreadyInChat || alreadyInvited;

                              return (
                                  <button
                                      key={user.id}
                                      onClick={() =>
                                          !disabled && handleInvite(user.id)
                                      }
                                      disabled={disabled}
                                      className={`flex items-center gap-2 p-2 rounded text-left text-sm border transition
                    ${
                        alreadyInChat
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : alreadyInvited
                            ? "bg-green-50 text-green-600 border-green-200 cursor-default"
                            : "hover:bg-gray-100"
                    }`}
                                  >
                                      <Image
                                          src={
                                              user.image ||
                                              "/default-avatar.png"
                                          }
                                          alt={user.name}
                                          width={28}
                                          height={28}
                                          className="rounded-full object-cover"
                                      />
                                      <span>{user.name}</span>

                                      {alreadyInChat && (
                                          <span className="ml-auto text-xs italic text-gray-400">
                                              ✅ In chat
                                          </span>
                                      )}
                                      {alreadyInvited && (
                                          <span className="ml-auto text-xs text-green-600">
                                              ✓ Uitgenodigd
                                          </span>
                                      )}
                                  </button>
                              );
                          })
                        : !loading && (
                              <p className="text-xs text-gray-400 italic">
                                  Geen resultaten gevonden
                              </p>
                          )}
                </div>
            </PopoverContent>
        </Popover>
    );
}
