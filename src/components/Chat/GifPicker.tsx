"use client";
import { Gif } from "@/app/types/types";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function GifPicker({
    onSelect,
}: {
    onSelect: (url: string) => void;
}) {
    const [search, setSearch] = useState("funny");
    const [gifs, setGifs] = useState<Gif[]>([]);

    useEffect(() => {
        async function fetchGifs() {
            const res = await fetch(
                `https://tenor.googleapis.com/v2/search?q=${encodeURIComponent(
                    search
                )}&key=${process.env.NEXT_PUBLIC_TENOR_API_KEY}&limit=12`
            );
            const data = await res.json();
            setGifs(data.results || []);
        }
        fetchGifs();
    }, [search]);

    return (
        <div className="absolute bottom-14 right-0 bg-white border rounded-lg shadow-lg p-2 w-64 z-50">
            <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search GIFs..."
                className="border rounded w-full p-1 text-sm mb-2"
            />
            <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto">
                {gifs.map((gif) => (
                    <Image
                        key={gif.id}
                        src={gif.media_formats?.tinygif?.url}
                        alt={gif.content_description}
                        width={100}
                        height={100}
                        className="cursor-pointer rounded"
                        onClick={() =>
                            onSelect(gif.media_formats?.tinygif?.url)
                        }
                    />
                ))}
            </div>
        </div>
    );
}
