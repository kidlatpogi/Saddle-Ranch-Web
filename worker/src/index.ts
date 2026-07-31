export interface Env {
  AI?: any;
}

const SADDLE_RANCH_KNOWLEDGE = `
You are the Help Assistant for Saddle Ranch in Cavite, Philippines.
Key Restaurant Information:

1. LOCATIONS & BRANCHES:
   - Flagship Branch: Saddle Ranch Bulihan
     Address: 123 Roadhouse Lane, Barangay Bulihan, Cavite
     Phone: +63 917 123 4567
   - New Branch: Saddle Ranch Dasmariñas
     Address: Governors Drive, Barangay Sampaloc 1, Dasmariñas City, Cavite
     Phone: +63 918 987 6543

2. OPERATING HOURS & STATUS:
   - Saddle Ranch Bulihan: Open daily (Monday - Sunday) from 11:00 AM to 11:00 PM.
   - Saddle Ranch Dasmariñas: Open daily (Monday - Sunday) from 10:00 AM to 10:00 PM.
   - Status: Open daily during regular business hours.

3. POPULAR MENU & PRICES:
   - Sizzling Pork Sisig: ₱180.00 (Crispy pork belly, local spices, egg & chilies)
   - Sizzling Pork T-Bone Steak: ₱250.00 (Juicy T-Bone, signature gravy, java rice, corn & carrots)
   - Sizzling Porterhouse Steak: ₱320.00 (Premium cut steak on sizzling hot skillet)
   - Sizzling Chicken Steak: ₱190.00 (Tender grilled chicken breast & gravy)
   - Sizzling Gambas: ₱220.00 (Spicy garlic shrimp)
   - Sizzling Pork Liempo: ₱210.00 (Grilled marinated pork belly)

4. DISCOUNTS & SPECIAL PROMOS:
   - Delivery Promo: FREE Delivery around Bulihan Area!
   - Senior Citizen & PWD Discount: 20% discount as mandated by law.
   - Student Promo: 10% discount with valid school ID.
   - Active Vouchers: Use promo codes at checkout (e.g. WELCOME10 for 10% off online orders).

5. ORDERING OPTIONS:
   - Pick-Up / Takeout: Ready in 15 minutes.
   - Home Delivery: Delivered hot to your doorstep.
   - Dine-In QR Service: Scan Table QR code at restaurant tables for direct ordering.

Keep answers concise, professional, clear, and free of emojis.
`;

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // Enable CORS
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    const url = new URL(request.url);

    if (url.pathname === "/api/chat" && request.method === "POST") {
      try {
        const body = (await request.json()) as { message?: string };
        const userMessage = body?.message || "";

        if (!userMessage.trim()) {
          return new Response(
            JSON.stringify({ error: "Message content cannot be empty." }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        let aiReply = "";

        // 1. If Cloudflare Workers AI binding is present
        if (env.AI) {
          try {
            const aiResponse = await env.AI.run("@cf/meta/llama-3-8b-instruct", {
              messages: [
                { role: "system", content: SADDLE_RANCH_KNOWLEDGE },
                { role: "user", content: userMessage },
              ],
            });
            aiReply = aiResponse?.response || "";
          } catch (e) {
            console.error("Workers AI run error:", e);
          }
        }

        // 2. Fallback Engine if AI binding is absent
        if (!aiReply) {
          aiReply = generateFallbackReply(userMessage);
        }

        return new Response(
          JSON.stringify({ reply: aiReply, timestamp: new Date().toISOString() }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      } catch (err: any) {
        return new Response(
          JSON.stringify({ error: "Failed to process chat request.", details: err.message }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    return new Response(
      JSON.stringify({ message: "Cloudflare Worker is running." }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  },
};

function generateFallbackReply(msg: string): string {
  const query = msg.toLowerCase();

  if (query.includes("location") || query.includes("where") || query.includes("address") || query.includes("branch")) {
    return "Saddle Ranch has two locations in Cavite:\n\n• **Bulihan Branch**: 123 Roadhouse Lane, Barangay Bulihan, Cavite\n• **Dasmariñas Branch**: Governors Drive, Barangay Sampaloc 1, Dasmariñas City, Cavite";
  }

  if (query.includes("open") || query.includes("hour") || query.includes("time") || query.includes("status")) {
    return "We are open daily:\n\n• **Bulihan Branch**: Mon - Sun (11:00 AM - 11:00 PM)\n• **Dasmariñas Branch**: Mon - Sun (10:00 AM - 10:00 PM)";
  }

  if (query.includes("price") || query.includes("menu") || query.includes("cost") || query.includes("how much") || query.includes("sisig") || query.includes("steak")) {
    return "Menu dishes and prices:\n\n• **Sizzling Pork Sisig**: ₱180.00\n• **Sizzling Pork T-Bone Steak**: ₱250.00\n• **Sizzling Porterhouse Steak**: ₱320.00\n• **Sizzling Chicken Steak**: ₱190.00\n• **Sizzling Gambas**: ₱220.00\n• **Sizzling Pork Liempo**: ₱210.00";
  }

  if (query.includes("discount") || query.includes("promo") || query.includes("voucher") || query.includes("sale") || query.includes("offer") || query.includes("free")) {
    return "Discounts and promos:\n\n• **FREE Delivery** around Bulihan Area\n• **10% Student Discount** (Present valid ID)\n• **20% Senior Citizen & PWD Discount**\n• Use promo code `WELCOME10` during online checkout for 10% off!";
  }

  if (query.includes("order") || query.includes("delivery") || query.includes("takeout") || query.includes("pickup") || query.includes("dine in") || query.includes("qr")) {
    return "Ordering options available:\n\n1. **Pick-Up (Takeout)** - Ready in 15 mins.\n2. **Home Delivery** - Free delivery around Bulihan.\n3. **Dine-In QR** - Scan table QR code at your table for direct ordering.";
  }

  return "Welcome! How can I help you today? Ask about our locations, operating hours, menu prices, or special discounts.";
}
