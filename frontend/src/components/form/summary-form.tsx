"use client";
import { useState } from "react";
import { toast } from "sonner";
import { cn, extractYouTubeID } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/custom/submit-button";


type ITranscriptResponse = {
    fullTranscript: string;
    title?: string;
    videoId?: string;
    thumbnailUrl?: string;
}


interface IErrors {
    message: string | null;
    name: string;
}


const INITIAL_STATE = {
    message: null,
    name: "",
}


export function SummaryForm() {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<IErrors>(INITIAL_STATE);
    const [value, setValue] = useState("");


    async function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);

        const formData = new FormData(event.currentTarget);
        const videoId = formData.get("videoId") as string;
        const processedVideoId = extractYouTubeID(videoId);

        if (!processedVideoId) {
            toast.error("Invalid Youtube Video ID");
            setLoading(false);
            setValue("");
            setError({
                ...INITIAL_STATE,
                message: "Invalid Youtube Video ID",
                name: "Invalid Id",
            });
            return;
        }

        let currentToastId: string | number | undefined;

        try {
            // Step 1: Get transcript
            currentToastId = toast.loading("✅번역 가져오기...");

            // Step 2: Generate summary
            toast.dismiss(currentToastId);
            currentToastId = toast.loading("✅요약 생성 중...");

            // Step 3: Save summary to database
            toast.dismiss(currentToastId);
            currentToastId = toast.loading("✅요약 저장 중...");


            toast.success("Summary Created and Saved!");
            setValue("");

            // Redirect to the summary details page
        } catch (error) {
            if (currentToastId) toast.dismiss(currentToastId);
            console.error("Error:", error);
            toast.error(
                error instanceof Error ? error.message : "Failed to create summary"
            );
        } finally {
            setLoading(false);
        }
    }

    function clearError() {
        setError(INITIAL_STATE);
        if (error.message) setValue("");
    }

    const errorStyles = error.message
        ? "outline-1 outline outline-red-500 placeholder:text-red-700"
        : "";


    return (
        <div className="w-full">
            <form onSubmit={handleFormSubmit} className="flex gap-2 items-center">
                <Input
                    name="videoId"
                    placeholder={
                        error.message ? error.message : "Youtube Video ID or URL"
                    }
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onMouseDown={clearError}
                    className={cn(
                        "w-full focus:text-black focus-visible:ring-pink-500",
                        errorStyles
                    )}
                    required
                />

                <SubmitButton
                    text="Create Summary"
                    loadingText="Creating Summary"
                    className="bg-pink-500"
                    loading={loading}
                />
            </form>
        </div>
    );



}













