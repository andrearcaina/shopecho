import { data, type ActionFunctionArgs } from "@remix-run/node";

export const action = async ({ request }: ActionFunctionArgs) => {
    const response = await fetch("http://localhost:8000/api/campaign/video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
    });

    const result = await response.json();

    return data(result);
};
