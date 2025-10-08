export type Message = {
    content: string;
    createdAt: string;
    id: string;
    sender?: Sender;
    senderId?: string;
    type: "text" | "gif" | "system";
    conversationId: string;
};

export type Participants = {
    conversationId: string;
    id: string;
    user: User;
    userId: string;
};

export type User = {
    createdAt?: string;
    email?: string;
    id: string;
    image: string;
    name: string;
    updatedAt?: string;
};

export type ConversationData = {
    id: string;
    title: string;
    background: string;
    isGroup: boolean;
    createdAt: string;
    messages: Message[];
    participants: Participants[];
    updatedAt: string;
};

export type Sender = {
    createdAt: string;
    email: string;
    id: string;
    image: string;
    name: string;
    password: string;
    updatedAt: string;
};

export type Gif = {
    id: string;
    media_formats: { tinygif: { url: string }; gif: { url: string } };
    content_description: string;
};
