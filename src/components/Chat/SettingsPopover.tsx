import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Settings } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
const SettingsPopover = ({
    conversationId,
    title: initialTitle,
    background: initialBackground,
    onTitleChange,
    onBackgroundChange,
    onSave,
}: {
    conversationId?: string;
    title: string;
    background: string;
    onTitleChange?: (title: string) => void;
    onBackgroundChange?: (background: string) => void;
    onSave?: () => void;
}) => {
    const { data: session } = useSession();
    const [title, setTitle] = useState(initialTitle ?? "");
    const [background, setBackground] = useState(
        initialBackground ?? "#ffffff"
    );

    // Sync props bij refresh of verandering
    useEffect(() => {
        if (initialTitle) setTitle(initialTitle);
    }, [initialTitle]);

    useEffect(() => {
        if (initialBackground) setBackground(initialBackground);
    }, [initialBackground]);

    async function handleLeaveConversation() {
        if (!conversationId || !session?.user?.id) return;

        const confirmLeave = confirm(
            "Weet je zeker dat je deze chat wilt verlaten?"
        );
        if (!confirmLeave) return;

        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/conversations/${conversationId}/leave`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: session.user.id,
                }),
            }
        );

        if (res.ok) {
            // optioneel: redirect naar home of chatlijst
            window.location.href = "/chat";
        } else {
            console.error("❌ Kon chat niet verlaten");
        }
    }
    return (
        <Popover>
            <PopoverTrigger asChild>
                <button
                    type="button"
                    className="p-2 hover:bg-gray-200 rounded transition"
                    title="Chat instellingen"
                >
                    <Settings size={22} />
                </button>
            </PopoverTrigger>

            <PopoverContent
                side="top"
                align="start"
                className="bg-white border rounded-lg shadow-lg p-3 w-64"
            >
                <h3 className="font-medium text-sm mb-2">Chat Instellingen</h3>

                <label className="text-xs text-gray-500">Titel</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => {
                        const newTitle = e.target.value;
                        setTitle(newTitle);
                        if (onTitleChange) onTitleChange(newTitle); // 👈 update parent live
                    }}
                    className="w-full border rounded px-2 py-1 mb-2 text-sm"
                    placeholder="Bv. Chill chat 💬"
                />

                <label className="text-xs text-gray-500">Achtergrond</label>
                <input
                    type="color"
                    value={background}
                    onChange={(e) => {
                        const newColor = e.target.value;
                        setBackground(newColor);
                        if (onBackgroundChange) onBackgroundChange(newColor); // 👈 direct live update
                    }}
                    className="w-full h-8 border rounded mb-3"
                />

                <button
                    type="button"
                    onClick={onSave}
                    className="w-full bg-blue-500 text-white py-1.5 rounded text-sm hover:bg-blue-600 transition"
                >
                    Opslaan
                </button>
                <button
                    type="button"
                    onClick={handleLeaveConversation}
                    className="w-full bg-red-500 text-white py-1.5 rounded text-sm hover:bg-red-600 transition"
                >
                    Groep verlaten
                </button>
            </PopoverContent>
        </Popover>
    );
};
export default SettingsPopover;
