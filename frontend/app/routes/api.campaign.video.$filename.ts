import { type LoaderFunctionArgs } from "@remix-run/node";

export const loader = async ({ params }: LoaderFunctionArgs) => {
    const { filename } = params;

    if (!filename) {
        throw new Response("Missing filename", { status: 400 });
    }

    const response = await fetch(
        `http://localhost:8000/api/campaign/video/${encodeURIComponent(filename)}`
    );

    if (!response.ok) {
        const text = await response.text();
        throw new Response(text, { status: response.status });
    }

    // Stream the video through Remix
    return new Response(response.body, {
        headers: {
            "Content-Type": "video/mp4",
            "Cache-Control": "public, max-age=31536000",
        },
    });
};
