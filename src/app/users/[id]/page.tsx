import { use } from "react";
import UserClient from "./UserClient";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    return <UserClient userId={id} />;
}
