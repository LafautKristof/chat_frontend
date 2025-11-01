"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();

        await signIn("credentials", {
            email,
            password,
            callbackUrl: "/chat",
        });
    }

    return (
        <div className="max-w-sm mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Login</h1>

            <form onSubmit={handleLogin} className="flex flex-col gap-4">
                <Input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    type="email"
                />
                <Input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    type="password"
                />
                <Button type="submit">Login</Button>
            </form>

            <div className="mt-6">
                <p className="text-center mb-2">Or login with</p>
                <div className="flex flex-col gap-2">
                    <Button
                        onClick={() =>
                            signIn("google", { callbackUrl: "/dashboard" })
                        }
                        className="bg-red-500 text-white"
                    >
                        Google
                    </Button>
                    <Button
                        onClick={() =>
                            signIn("github", { callbackUrl: "/dashboard" })
                        }
                        className="bg-gray-800 text-white"
                    >
                        GitHub
                    </Button>
                </div>
            </div>
        </div>
    );
}
