import { NextRequest, NextResponse } from "next/server";
import { verifyTokenAndGetUser } from "@/lib/auth-server";
import { isRateLimited } from "@/lib/rate-limiter";
import { z } from "zod";

const chatSchema = z.object({
  passage: z.string().optional(),
  question: z.any().optional(),
  selectedOption: z.string().nullable().optional(),
  correctOption: z.string().nullable().optional(),
  explanation: z.string().nullable().optional(),
  userMessage: z.string().min(1).max(5000),
  history: z.array(
    z.object({
      sender: z.string(),
      text: z.string(),
    })
  ).optional(),
});

export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate user
    const user = await verifyTokenAndGetUser(req);
    if (!user) {
      return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    }

    // 2. Rate Limiting (20 requests per minute per user)
    if (isRateLimited(`chat_${user.uid}`, 20, 60_000)) {
      return NextResponse.json(
        { text: "Squeak! I need to rest my paws. Please wait a minute before sending another message! 🐿️" },
        { status: 429 }
      );
    }

    // 3. Input Validation
    let jsonBody: any;
    try {
      jsonBody = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
    }

    const validation = chatSchema.safeParse(jsonBody);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid inputs.", details: validation.error.format() },
        { status: 400 }
      );
    }

    const {
      passage,
      question,
      selectedOption,
      correctOption,
      explanation,
      userMessage,
      history = [],
    } = validation.data;

    // Craft system guidelines for Scratten the Squirrel
    const systemInstruction = `
You are Scratten, a cute, highly encouraging, and super smart 3D squirrel mascot and expert MCAT study tutor (inspired by Duolingo's mascot style, but for medical students).
You are tutoring the student on an MCAT passage/question. Always stay in character as a friendly, warm squirrel. Use occasional squirrel emojis (🐿️, 🌰, 🌲).

Context for the current question:
- Passage segment: "${passage || 'N/A'}"
- Question: "${question?.questionText || 'N/A'}"
- Options: ${JSON.stringify(question?.options || {})}
- Student's Answer: "${selectedOption || 'None yet'}"
- Correct Answer: "${correctOption || 'N/A'}"
- High-Yield Explanation: "${explanation || 'N/A'}"

Guidelines:
1. Explain the scientific concepts simply, encouragingly, and clearly.
2. If the user asks for a hint, give them a subtle hint rather than the direct answer.
3. Keep responses relatively concise (1-3 small paragraphs) so it fits beautifully in a chat drawer.
4. Support the student, cheer them on, and remind them they can crush the MCAT!
`;

    const hfToken = process.env.HF_TOKEN;

    if (hfToken) {
      try {
        const url = "https://api-inference.huggingface.co/models/meta-llama/Llama-3.1-8B-Instruct?provider=featherless-ai";

        // Build prompt with history
        let conversationPrompt = `<|system|>\n${systemInstruction}\n`;
        for (const msg of history) {
          if (msg.sender === "user") {
            conversationPrompt += `<|user|>\n${msg.text}\n`;
          } else {
            conversationPrompt += `<|assistant|>\n${msg.text}\n`;
          }
        }
        
        // Sanitize user message to prevent basic injection
        const sanitizedUserMessage = userMessage
          .replace(/<\|system\|>/gi, "")
          .replace(/<\|user\|>/gi, "")
          .replace(/<\|assistant\|>/gi, "")
          .replace(/<\|end_of_text\|>/gi, "");

        conversationPrompt += `<|user|>\n${sanitizedUserMessage}\n<|assistant|>\n`;

        const apiResponse = await fetch(url, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${hfToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            inputs: conversationPrompt,
            parameters: {
              max_new_tokens: 350,
              temperature: 0.7,
              return_full_text: false,
            },
          }),
        });

        if (apiResponse.ok) {
          const data = await apiResponse.json();
          const responseText = data[0]?.generated_text || data.generated_text;
          if (responseText) {
            return NextResponse.json({ text: responseText.trim() });
          }
        } else {
          const errorText = await apiResponse.text();
          console.error("Hugging Face API returned error:", apiResponse.status, errorText);
        }
      } catch (innerErr) {
        console.error("Hugging Face API direct fetch failed, using fallback:", innerErr);
      }
    }

    // --- Dynamic Fallback Generator ---
    const lowercaseQuery = userMessage.toLowerCase();
    let reply = "";

    if (lowercaseQuery.includes("hint") || lowercaseQuery.includes("help")) {
      reply = `Squeak! Here is a little hint for you, future doctor! 🌰 Look closely at the differences between the options. Remember that ${explanation?.split('.')[0] || 'the correct mechanism is explained in the answer key'}. Try to eliminate choices that contradict this! You've got this! 🐿️`;
    } else if (lowercaseQuery.includes("explain") || lowercaseQuery.includes("why")) {
      reply = `Let's crack this nut together! 🐿️ The key concept here is that the correct answer is option **${correctOption}**. Why? Because ${explanation || 'it matches the physiological details in the passage'}. Let me know if you want me to break down any other option! 🌰`;
    } else if (lowercaseQuery.includes("easy") || lowercaseQuery.includes("explain like i'm 5") || lowercaseQuery.includes("eli5")) {
      reply = `No problem! Imagine this like storing acorns for winter! 🌰 ${explanation?.replace(/pathophysiology|ischemia|occlusion/gi, 'blockage') || 'The biological pathway works step-by-step.'} Basically, when things get blocked, the cell runs out of energy super fast, just like a squirrel running out of nuts! 🐿️ Makes sense, right?`;
    } else {
      reply = `Squeak! That is a great question! 🐿️ Regarding this question: the high-yield fact to remember is that **${correctOption}** is correct because ${explanation?.split('.')[0] || 'of the physiological mechanisms discussed'}. What part of this topic can I clarify further for you? 🌰`;
    }

    return NextResponse.json({ text: reply });
  } catch (error: any) {
    console.error("Chat route error:", error);
    return NextResponse.json({ text: "Squeak! Something went wrong in my squirrel brain. Let's try again! 🌰" }, { status: 500 });
  }
}
