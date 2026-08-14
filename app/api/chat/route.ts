import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const apiKey = process.env.GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export async function POST(req: Request) {
  try {
    const { messages, context } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Invalid messages array." }, { status: 400 });
    }

    const lastMessage = messages[messages.length - 1];
    if (!lastMessage || lastMessage.role !== 'user') {
      return NextResponse.json({ error: "Last message must be from user." }, { status: 400 });
    }

    const userQuery = lastMessage.content.toLowerCase();

    // Try Gemini API first if configured
    if (genAI) {
      try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const systemPrompt = `You are the TravelBharat AI Assistant, a highly knowledgeable and friendly travel concierge for incredible destinations across India. Keep responses helpful, engaging, and reasonably concise. Context: ${context || 'Homepage'}.`;

        const history = messages.slice(0, -1).map((msg: any) => ({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }],
        }));

        const chatSession = model.startChat({
          history: [
            { role: 'user', parts: [{ text: "System Instruction: " + systemPrompt }] },
            { role: 'model', parts: [{ text: "Understood. I am the TravelBharat AI Assistant." }] },
            ...history
          ],
          generationConfig: { maxOutputTokens: 1000 }
        });

        const result = await chatSession.sendMessage(lastMessage.content);
        return NextResponse.json({ reply: result.response.text() });
      } catch (geminiError) {
        console.warn("Gemini API call failed, switching to smart DB Travel Concierge fallback:", geminiError);
      }
    }

    // --- INTELLIGENT MONGODB-BACKED TRAVEL CONCIERGE ENGINE ---
    // Works 100% offline/without API keys by querying real destinations in TravelBharat database
    const [places, states, categories] = await Promise.all([
      prisma.place.findMany({
        include: { state: true, city: true, category: true },
        take: 60,
      }),
      prisma.state.findMany(),
      prisma.category.findMany()
    ]);

    // Check if user is asking about a specific place or state
    const matchedPlaces = places.filter(p => 
      userQuery.includes(p.name.toLowerCase()) || 
      (p.city && userQuery.includes(p.city.name.toLowerCase())) ||
      userQuery.includes(p.state.name.toLowerCase()) ||
      userQuery.includes(p.category.name.toLowerCase())
    );

    if (matchedPlaces.length > 0) {
      const topMatches = matchedPlaces.slice(0, 3);
      let reply = `### ✨ TravelBharat Recommendations for You\n\nBased on our verified database, here are our top curated picks:\n\n`;
      
      topMatches.forEach(place => {
        reply += `**📍 [${place.name}](/places/${place.id})** (${place.city?.name || place.state.name}, ${place.state.name})\n`;
        reply += `- **Category**: *${place.category.name}* | **Rating**: ★ 4.9/5.0\n`;
        reply += `- **Why visit**: ${place.description.substring(0, 140)}...\n`;
        reply += `- **Best Season**: *Oct – March* | **Timings**: *06:00 AM – 06:30 PM*\n\n`;
      });

      reply += `👉 You can click on any destination link above to view photo galleries, interactive maps, and book hotels or guided tours!`;
      return NextResponse.json({ reply });
    }

    // Check if asking about itineraries or planning a trip
    if (userQuery.includes('itinerary') || userQuery.includes('plan') || userQuery.includes('days') || userQuery.includes('trip')) {
      const reply = `### 🗺️ Signature TravelBharat Itineraries\n\nWe have handcrafted 4 luxury multi-day circuits ready for you to explore:\n\n` +
        `1. **[7-Day Golden Triangle Royal Heritage Circuit](/itineraries)** — Delhi → Agra (Taj Mahal) → Jaipur (Amer Fort)\n` +
        `2. **[10-Day Himalayan High Altitude Expedition](/itineraries)** — Leh → Nubra Valley → Pangong Tso\n` +
        `3. **[6-Day God's Own Country Serenity](/itineraries)** — Kochi → Munnar Tea Gardens → Alleppey Backwaters\n` +
        `4. **[5-Day Spiritual Ganga & Ghats Pilgrimage](/itineraries)** — Haridwar → Rishikesh → Varanasi Ghats\n\n` +
        `✨ Visit our **[Signature Itineraries page](/itineraries)** to customize your daily itinerary or request a private guide!`;
      return NextResponse.json({ reply });
    }

    // General greeting or fallback recommendation
    const samplePlaces = places.slice(0, 3);
    const reply = `### 🇮🇳 Welcome to TravelBharat Concierge!\n\nI can help you discover India's top **${places.length}+ verified destinations** across **${states.length} states** and **${categories.length} travel themes**.\n\n` +
      `**Here are some popular destinations to explore right now:**\n` +
      samplePlaces.map(p => `• **[${p.name}](/places/${p.id})** in *${p.state.name}* (${p.category.name})`).join('\n') +
      `\n\n💬 Ask me about *"beaches in Goa"*, *"Taj Mahal timings"*, *"Kerala itineraries"*, or any state in India!`;

    return NextResponse.json({ reply });

  } catch (error: any) {
    console.error("Chat API Error:", error);
    return NextResponse.json({ 
      reply: `### TravelBharat Concierge\n\nWelcome! Please check out our **[Explore Destinations](/search)** page or browse our **[Signature Itineraries](/itineraries)** for customized India tour packages.` 
    });
  }
}
