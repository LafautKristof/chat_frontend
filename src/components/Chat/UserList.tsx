"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

type User = {
    id: string;
    name: string;
};

type Props = {
    onSelectConversation: (id: string) => void;
};

export default function UserList({ onSelectConversation }: Props) {
    const [users, setUsers] = useState<User[]>([]);

    const { data: session } = useSession();

    useEffect(() => {
        async function loadUsers() {
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/users?excludeId=${session?.user?.id}`,
                    {
                        method: "GET",
                        headers: { "Content-Type": "application/json" },
                    }
                );
                if (!res.ok) throw new Error("Failed to fetch users");

                const data = await res.json();
                setUsers(data);
            } catch (err) {
                console.error(err);
            }
        }

        loadUsers();
    }, [session?.user?.id]);

    return (
        <ul className="space-y-2">
            {users.map((u) => (
                <li
                    key={u.id}
                    className="cursor-pointer p-2 rounded hover:bg-gray-200"
                    onClick={() => onSelectConversation(u.id)}
                >
                    {u.name}
                </li>
            ))}
        </ul>
    );
}
