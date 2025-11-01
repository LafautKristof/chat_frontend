"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

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
        <div className="max-w-sm mx-auto bg-card border rounded-xl shadow-md p-6 text-center">
            {/* Profielfoto */}
            <div className="flex justify-center mb-4">
                <div className="relative w-32 h-32">
                    <Image
                        src={user.image || "/anonymous.jpeg"}
                        alt={user.name}
                        fill
                        className="object-cover rounded-full border border-gray-300 shadow-sm"
                    />
                </div>
            </div>

            {/* Naam & Email */}
            <h1 className="text-2xl font-semibold text-foreground mb-1">
                {user.name}
            </h1>
            <p className="text-sm text-muted-foreground">{user.email}</p>

            {/* Chatknop */}
            <button
                onClick={handleOpenChat}
                className="
                    mt-6 inline-flex items-center gap-2 
                    bg-blue-600 text-white font-medium 
                    px-5 py-2.5 rounded-lg 
                    hover:bg-blue-700 active:scale-95 
                    transition-all duration-150
                "
            >
                💬 Chat with me
            </button>
        </div>
    );
}
