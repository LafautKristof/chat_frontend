"use client";
export default function HomePage() {
    return (
        <section className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
                Welcome to My Chat App
            </h1>
            <p className="max-w-2xl text-lg sm:text-xl text-muted-foreground leading-relaxed">
                This app is part of my personal portfolio — a place where you
                can explore profiles, start a chat, and see how I combine
                frontend design and backend logic.
            </p>
            <p className="max-w-2xl text-lg sm:text-xl text-muted-foreground leading-relaxed mt-4">
                It’s not a commercial product, but a living demo of what I love
                doing: building modern, interactive web experiences with{" "}
                <span className="font-semibold text-blue-600 dark:text-blue-400">
                    React
                </span>
                ,{" "}
                <span className="font-semibold text-sky-600 dark:text-sky-400">
                    Next.js
                </span>{" "}
                and{" "}
                <span className="font-semibold text-cyan-600 dark:text-cyan-400">
                    Tailwind&nbsp;CSS
                </span>
                .
            </p>
        </section>
    );
}
