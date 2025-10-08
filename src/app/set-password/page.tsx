"use client";
import SetPasswordForm from "@/components/SetPasswordForm";
import { useSession } from "next-auth/react";

export default function SetPasswordPage() {
    const { data: session, status } = useSession();

    if (status === "loading") {
        return <p>Loading...</p>;
    }

    if (!session?.user?.email) {
        return <p>Je moet ingelogd zijn om een wachtwoord in te stellen.</p>;
    }

    return (
        <div className="p-8">
            <h1 className="text-xl font-bold mb-4">Set Your Password</h1>
            <SetPasswordForm email={session.user.email} />
        </div>
    );
}
