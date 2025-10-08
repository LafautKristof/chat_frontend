"use client";

import { signIn } from "next-auth/react";
import { Button } from "./ui/button";

export default function SocialLogin() {
    return (
        <div className="flex flex-col gap-2 mt-4">
            <Button
                onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                className="bg-red-500 text-white px-4 py-2 rounded"
            >
                Sign in with Google
            </Button>
            <Button
                onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
                className="bg-gray-800 text-white px-4 py-2 rounded"
            >
                Sign in with GitHub
            </Button>
        </div>
    );
}
