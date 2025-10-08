"use client";
import Link from "next/link";
import LogoutButton from "./LogoutButton";
import { useSession } from "next-auth/react";

const Navbar = () => {
    const { data: session } = useSession();

    return (
        <nav className="bg-yellow-400 p-4 flex items-center justify-between">
            {/* 🔹 Linkerkant */}
            <div className="flex items-center gap-4">
                <Link href="/">Home</Link>

                {!session?.user && (
                    <>
                        <Link href="/login">Login</Link>
                        <Link href="/register">Register</Link>
                    </>
                )}

                {session?.user && (
                    <>
                        <Link
                            href="/chat"
                            className="text-blue-600 hover:underline"
                        >
                            Chat
                        </Link>
                        <Link
                            href="/users"
                            className="text-blue-600 hover:underline"
                        >
                            Users
                        </Link>
                    </>
                )}
            </div>

            {/* 🔹 Rechterkant */}
            {session?.user && <LogoutButton />}
        </nav>
    );
};

export default Navbar;
