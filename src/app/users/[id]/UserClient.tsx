"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

import getInitials from "@/app/helpers/getInitals";

type User = {
    id: string;
    name: string;
    email: string;
    image: string;
};

export default function UserClient({ userId }: { userId: string }) {
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();
    const { data: session } = useSession();

    useEffect(() => {
        async function loadUser() {
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${userId}`
                );
                if (!res.ok) throw new Error("Failed to fetch user");
                const data = await res.json();
                setUser(data);
            } catch (err) {
                console.error(err);
            }
        }
        loadUser();
    }, [userId]);

    async function handleOpenChat() {
        if (!session?.user?.id) return;

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/conversations/check?userA=${session.user.id}&userB=${userId}`,
                {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                }
            );
            if (!res.ok) throw new Error("Failed to check conversation");

            const data = await res.json();

            if (data?.conversationId) {
                router.push(`/chat/${data.conversationId}`);
            } else {
                router.push(`/chat/new?recipientId=${userId}`);
            }
        } catch (err) {
            console.error("Error checking conversation:", err);
        }
    }

    if (!user) return <p>Loading...</p>;

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold">{user.name}</h1>
            <p className="text-gray-600">{user.email}</p>
            <Image
                src={user.image || getInitials(user.name)}
                alt={user.name}
                width={200}
                height={200}
                className="rounded-md"
            />
            <button
                onClick={handleOpenChat}
                className="bg-blue-500 text-white px-4 py-2 rounded mt-4 hover:bg-blue-600 transition"
            >
                chat with me 👋
            </button>
        </div>
    );
}
