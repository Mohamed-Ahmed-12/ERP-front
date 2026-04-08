"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Spinner } from "flowbite-react";
import { useAuth } from "@/context/auth"; // Adjust path to your AuthContext

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { loggedIn, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // Only redirect if loading is finished and user is not logged in
        if (!isLoading && !loggedIn) {
            router.replace("/");
        }
    }, [isLoading, loggedIn, router]);

    // Show a loader while AuthProvider is fetching the user profile
    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Spinner size="xl" aria-label="Authenticating..." />
            </div>
        );
    }

    // If not loading and logged in, render the dashboard content
    return loggedIn ? <>{children}</> : null;
}