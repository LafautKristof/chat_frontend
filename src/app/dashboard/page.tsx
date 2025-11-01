"use client";

import { useSession } from "next-auth/react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";

export default function Dashboard() {
    const { data: session } = useSession();

    return (
        <>
            <div className="p-6 space-y-6">
                <h1 className="text-2xl font-bold">
                    Welkom {session?.user?.name}
                </h1>
                {!session?.user?.hasPassword && (
                    <Alert className="border-yellow-500 text-yellow-800 bg-yellow-50">
                        <AlertCircle className="h-5 w-5 text-yellow-600" />
                        <AlertTitle>Wachtwoord ontbreekt</AlertTitle>
                        <AlertDescription>
                            Your account was created via
                            {session?.user?.email?.includes("github")
                                ? "GitHub"
                                : "Google"}
                            . Set a password so you can log in via e-mail
                            <Link
                                href="/set-password"
                                className="underline text-blue-600"
                            >
                                Set password
                            </Link>
                        </AlertDescription>
                    </Alert>
                )}
            </div>
        </>
    );
}
