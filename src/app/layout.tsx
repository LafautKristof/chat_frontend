import Navbar from "@/components/Navbar";
import "./globals.css";
import SessionProvider from "@/app/providers/SessionProvider";

export const metadata = {
    title: "Chat App",
    description: "Realtime chat with NextAuth",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className="h-screen">
            <body className="h-screen overflow-hidden">
                <SessionProvider>
                    <div className="flex flex-col h-full min-h-0">
                        <Navbar />
                        <main className="flex-1 min-h-0 flex flex-col overflow-hidden">
                            {children}
                        </main>
                    </div>
                </SessionProvider>
            </body>
        </html>
    );
}
