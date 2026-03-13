export async function onRequestGet({ env }) {
    const corsHeaders = {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
    };

    const daveStatus = (await env.GARTEN_KV.get("dave_status")) || "off";
    const annaStatus = (await env.GARTEN_KV.get("anna_status")) || "off";

    let state = 1;
    let message = "Die Zentrale schläft ...";

    if (daveStatus === "off" && annaStatus === "off") {
        state = 1;
        message = "Die Zentrale schläft ...";
    } else if (daveStatus === "on" && annaStatus === "off") {
        state = 2;
        message = "Dave optimiert die Zentrale.";
    } else if (daveStatus === "off" && annaStatus === "on") {
        state = 3;
        message = "Anna bringt die Zentrale zum Blühen.";
    } else if (daveStatus === "on" && annaStatus === "on") {
        state = 4;
        message = "Gartenzentrale: Volle Power! Anna & Dave sind da.";
    }

    return new Response(JSON.stringify({ state, message }), { headers: corsHeaders });
}

export async function onRequestOptions() {
    return new Response(null, {
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
        },
    });
}
