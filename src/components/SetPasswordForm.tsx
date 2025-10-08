"use client";

import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function SetPasswordForm({ email }: { email: string }) {
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [message, setMessage] = useState("");
    const { update } = useSession();
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (password !== confirm) {
            setMessage("Passwords do not match");
            return;
        }

        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/set-password`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            }
        );

        if (res.ok) {
            await update();
            router.push("/");
        } else {
            const data = await res.json();
            setMessage(data.error || "Something went wrong");
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 max-w-sm mx-auto"
        >
            <Input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="New Password"
                type="password"
                required
            />
            <Input
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Confirm Password"
                type="password"
                required
            />
            <Button type="submit">Set Password</Button>
            {message && <p className="text-sm mt-2">{message}</p>}
        </form>
    );
}
