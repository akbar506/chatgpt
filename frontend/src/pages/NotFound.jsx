import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-center p-6">
            <h1 className="text-8xl font-bold bg-linear-to-r  from-neutral-300 via-neutral-700 to-neutral-900 bg-clip-text text-transparent ">404</h1>
            <h2 className="text-3xl font-semibold mt-4">
                Page Not Found
            </h2>
            <p className="text-muted-foreground mt-2">
                Sorry, the page you're looking for doesn't exist.
            </p>
            <div className="flex gap-4 mt-8">
                <Button
                    onClick={() => navigate(-1)}
                    className="px-5 py-4 rounded-lg"
                >
                    ← Go Back
                </Button>
                <Button
                    onClick={() => navigate("/")}
                    className="px-5 py-4 rounded-lg"
                >
                    Go Home
                </Button>
            </div>
        </div>
    );
};