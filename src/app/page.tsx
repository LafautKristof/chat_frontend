"use client";

import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");
export default function Home() {
    const [messages, setMessages] = useState<string[]>([]);
    const [input, setInput] = useState("");

    useEffect(() => {
        socket.on("chat_message", (msg) => {
            setMessages((prev) => [...prev, msg]);
        });

        return () => {
            socket.off("chat_message");
        };
    }, []);

    function sendMessage() {
        if (!input.trim()) return;
        socket.emit("chat_message", input);
        setInput("");
    }

    return (
        <main className="flex flex-col items-center justify-center min-h-screen p-6">
            <h1 className="text-2xl font-bold mb-4">💬 Chat Frontend</h1>

            <div className="border w-full max-w-md h-80 p-4 overflow-y-auto bg-gray-100 mb-4 rounded">
                {messages.map((msg, i) => (
                    <p key={i} className="mb-2 p-2 bg-white rounded shadow">
                        {msg}
                    </p>
                ))}
            </div>

            <div className="flex gap-2 w-full max-w-md">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="flex-1 border p-2 rounded"
                    placeholder="Type a message..."
                />
                <button
                    onClick={sendMessage}
                    className="bg-blue-600 text-white px-4 rounded"
                >
                    Send
                </button>
            </div>
        </main>
    );
}
