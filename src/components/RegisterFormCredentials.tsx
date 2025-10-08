"use client";
import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

const RegisterFormCredentials = () => {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const router = useRouter();
    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (password !== passwordConfirm) {
            alert("Passwords do not match");
            return;
        }
        if (!email || !name || !password || !passwordConfirm) {
            alert("Please fill in all fields");
            return;
        }
        if (password.length < 6) {
            alert("Password must be at least 6 characters");
            return;
        }
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/register`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email,
                    name,
                    password,
                }),
            }
        );
        if (res.ok) {
            router.push("/login");
        } else {
            alert("Something went wrong");
        }
    }
    return (
        <div>
            {" "}
            <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-4 max-w-sm mx-auto"
            >
                <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Name"
                />
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
                <Input
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    placeholder="Confirm Password"
                    type="password"
                />
                <Button type="submit">Register</Button>
            </form>
        </div>
    );
};
export default RegisterFormCredentials;
