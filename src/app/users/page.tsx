"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
type User = {
    id: string;
    name: string;
};
const UsersPage = () => {
    const [users, setUsers] = useState<User[]>([]);
    const { data: session, status } = useSession();
    useEffect(() => {
        if (status !== "authenticated") return;
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
    }, [status, session?.user?.id]);
    if (status === "loading") {
        return <p>Loading session...</p>;
    }

    if (status === "unauthenticated") {
        return <p>Please log in to view users.</p>;
    }
    return (
        <ul className="space-y-2">
            {users.map((u) => (
                <li
                    key={u.id}
                    className="cursor-pointer p-2 rounded hover:bg-gray-200"
                >
                    <Link href={`/users/${u.id}`}>{u.name} </Link>
                </li>
            ))}
        </ul>
    );
};
export default UsersPage;
