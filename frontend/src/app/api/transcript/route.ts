import { services } from "@/data/services";
import { safeRequireAuthUser } from "@/lib/auth-helpers";
import { NextRequest } from "next/server";


export const maxDuration = 150;
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
    const auth = await safeRequireAuthUser();

    if (!auth.success) {
        return new Response(JSON.stringify(auth), {
            status: auth.status ?? 401,
            headers: { "Content-Type": "application/json" },
        });
    }

    const body = await request.json();
    const videoId = body.videoId;

    try {
        const transcriptData = await services.summarize.generateTranscript(videoId);
        if (!transcriptData?.fullTranscript) {
            throw new Error("No transcript data found");
        }

        return new Response(JSON.stringify({ data: transcriptData, error: null }));
    } catch (error) {
        console.error("Error processing request:", error);
        if (error instanceof Error)
            return new Response(JSON.stringify({ error: error.message }));
        return new Response(JSON.stringify({ error: "Unknown error" }));

    }





}
