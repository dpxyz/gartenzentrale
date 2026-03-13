const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
};

export async function onRequestPost({ request, env }) {
    try {
        const body = await request.json();
        const { user, status } = body;

        if (!["dave", "anna"].includes(user) || !["on", "off"].includes(status)) {
            return new Response("Invalid payload", { status: 400, headers: corsHeaders });
        }

        const now = Date.now();
        const lastUpdateStr = await env.GARTEN_KV.get(`${user}_last_update`);
        const lastUpdate = lastUpdateStr ? parseInt(lastUpdateStr, 10) : 0;

        if (now - lastUpdate < 60000) {
            return new Response("Cooldown active", { status: 429, headers: corsHeaders });
        }

        await env.GARTEN_KV.put(`${user}_status`, status);
        await env.GARTEN_KV.put(`${user}_last_update`, now.toString());

        return new Response("OK", { status: 200, headers: corsHeaders });
    } catch (e) {
        return new Response("Bad Request", { status: 400, headers: corsHeaders });
    }
}

export async function onRequestOptions() {
    return new Response(null, { headers: corsHeaders });
}
