import { Gif } from "@/app/types/types";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@radix-ui/react-popover";
import { GiftIcon, Search } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

const GifPopover = ({ onSelect }: { onSelect: (url: string) => void }) => {
    const [gifs, setGifs] = useState<Gif[]>([]);
    const [query, setQuery] = useState("funny");

    // 🎞️ GIF verzenden
    useEffect(() => {
        const fetchGifs = async () => {
            try {
                const endpoint = query.trim()
                    ? `https://tenor.googleapis.com/v2/search?q=${encodeURIComponent(
                          query
                      )}&key=${
                          process.env.NEXT_PUBLIC_TENOR_API_KEY
                      }&limit=9&media_filter=gif,tinygif`
                    : `https://tenor.googleapis.com/v2/featured?key=${process.env.NEXT_PUBLIC_TENOR_API_KEY}&limit=9&media_filter=gif,tinygif`;

                const res = await fetch(endpoint);
                const data = await res.json();
                setGifs(data.results || []);
            } catch (e) {
                console.error("❌ Tenor error:", e);
            }
        };

        const delay = setTimeout(fetchGifs, 400);
        return () => clearTimeout(delay);
    }, [query]);
    return (
        <Popover>
            <PopoverTrigger asChild>
                <button
                    type="button"
                    className="p-2 hover:bg-gray-200 rounded transition"
                >
                    <GiftIcon size={22} />
                </button>
            </PopoverTrigger>

            <PopoverContent
                side="top"
                align="start"
                className="bg-white border rounded-lg shadow-lg p-3 w-72"
            >
                <div className="flex gap-2 mb-2">
                    <input
                        type="text"
                        placeholder="Search GIFs..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="flex-1 border rounded p-1 text-sm"
                    />
                    <button
                        type="button"
                        onClick={() => setQuery(query)}
                        className="p-1 bg-blue-500 text-white rounded"
                    >
                        <Search size={16} />
                    </button>
                </div>

                <div className="grid grid-cols-3 gap-2 max-h-60 overflow-y-auto">
                    {gifs.map((g) => (
                        <Image
                            key={g.id}
                            src={g.media_formats.tinygif.url}
                            alt="GIF"
                            width={100}
                            height={100}
                            className="cursor-pointer rounded hover:opacity-80"
                            onClick={() => onSelect(g.media_formats.gif.url)}
                        />
                    ))}
                </div>
            </PopoverContent>
        </Popover>
    );
};
export default GifPopover;
