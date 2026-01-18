export async function createCampaignDraftVideo() {
    try {
        const response = await fetch("/api/campaign/video", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Remix API Error: ${errorText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Failed to create campaign draft video:", error);
        throw error;
    }
}

/**
 * Publishes a campaign by calling the Remix API route.
 */
export async function createCampaignDraftEmail() {

    try {
        const response = await fetch("/api/campaign/email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Remix API Error: ${errorText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Failed to create campaign draft email:", error);
        throw error;
    }
}

export async function getCampaignVideoFile(filePath: string) {
    try {
        const response = await fetch(`/api/campaign/video/${encodeURIComponent(filePath)}`, {
            method: "GET",
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Remix API Error: ${errorText}`);
        }
        return await response.blob();
    } catch (error) {
        console.error("Failed to fetch campaign video file:", error);
        throw error;
    }
}
