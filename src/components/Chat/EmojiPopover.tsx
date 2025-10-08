import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Smile } from "lucide-react";
import dynamic from "next/dynamic";

const EmojiPicker = dynamic(() => import("emoji-picker-react"), { ssr: false });

const EmojiPopover = ({ onSelect }: { onSelect: (emoji: string) => void }) => {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <button
                    type="button"
                    className="p-2 hover:bg-gray-200 rounded transition"
                >
                    <Smile size={22} />
                </button>
            </PopoverTrigger>

            <PopoverContent
                side="top"
                align="start"
                className="bg-white border rounded-lg shadow-lg p-2"
            >
                <EmojiPicker
                    onEmojiClick={(emojiData) => onSelect(emojiData.emoji)}
                />
            </PopoverContent>
        </Popover>
    );
};
export default EmojiPopover;
