export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method === "POST" && url.pathname === "/webhook") {
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

    if (request.method === "GET" && url.pathname === "/api/state") {
      const daveStatus = await env.GARTEN_KV.get("dave_status") || "off";
      const annaStatus = await env.GARTEN_KV.get("anna_status") || "off";

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
        message = "Volle Power! Dave & Anna sind da.";
      }

      const responseBody = JSON.stringify({ state, message });
      return new Response(responseBody, {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
          "Cache-Control": "no-store"
        },
      });
    }

    return new Response("Not Found", { status: 404, headers: corsHeaders });
  }
};
