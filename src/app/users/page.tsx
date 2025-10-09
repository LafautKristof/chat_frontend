"use client";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
type User = {
    id: string;
    name: string;
    email: string;
    image: string;
};
const UsersPage = () => {
    const [users, setUsers] = useState<User[]>([]);
    const { data: session, status } = useSession();
    useEffect(() => {
        if (status !== "authenticated") return;
        async function loadUsers() {
            try {
                if (!session?.user?.id) {
                    console.warn(
                        "Session loaded without user ID — skipping user fetch"
                    );
                    return;
                }
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
        <ul className="divide-y divide-gray-200 dark:divide-gray-800">
            {users.map((u) => (
                <li key={u.id}>
                    <Link
                        href={`/users/${u.id}`}
                        className="
                        block px-4 py-3 
                        rounded-md transition
                        hover:bg-muted hover:text-foreground
                    "
                    >
                        {" "}
                        <Image
                            src={u.image}
                            alt={u.name}
                            width={24}
                            height={24}
                            className="mr-2 rounded-full"
                        />
                        {u.name}
                    </Link>
                </li>
            ))}
        </ul>
    );
};
export default UsersPage;
