import { NextRequest, NextResponse } from "next/server";
import { verifyTokenAndGetUser } from "@/lib/auth-server";
import { isRateLimited } from "@/lib/rate-limiter";
import { getUserDocument } from "@/lib/db";
import { z } from "zod";

const generateQuestionsSchema = z.object({
  passageText: z.string().min(10).max(25000),
  accuracyPercent: z.number().min(0).max(100).optional(),
  wpm: z.number().min(1).max(1000).optional(),
});

export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate user
    const user = await verifyTokenAndGetUser(req);
    if (!user) {
      return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    }

    // 2. Rate Limiting (10 requests per minute per user)
    if (isRateLimited(`gen_qs_${user.uid}`, 10, 60_000)) {
      return NextResponse.json({ error: "Too many requests. Please try again in a minute." }, { status: 429 });
    }

    // 3. Input Validation
    let jsonBody: any;
    try {
      jsonBody = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
    }

    const validation = generateQuestionsSchema.safeParse(jsonBody);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid inputs.", details: validation.error.format() },
        { status: 400 }
      );
    }

    const { passageText, accuracyPercent = 100, wpm = 150 } = validation.data;

    // 4. Paywall Check
    const userDoc = await getUserDocument(user.uid);
    if (!userDoc) {
      return NextResponse.json({ error: "User profile not found." }, { status: 404 });
    }

    const isFree = userDoc.tier === "free";
    if (isFree) {
      const completedSessions = userDoc.totalSessions || userDoc.sessions_completed || 0;
      if (completedSessions >= 1) {
        return NextResponse.json(
          {
            error: "Free limit reached. Upgrade to Unlimited to generate more quizzes.",
            code: "PAYWALL_REACHED"
          },
          { status: 403 }
        );
      }
    }

    const hfToken = process.env.HF_TOKEN;
    if (!hfToken) {
      return NextResponse.json({ error: "HF_TOKEN not configured" }, { status: 400 });
    }

    // Determine difficulty tier based on student performance
    let difficultyTier = "Medium";
    let pedagogicalInstruction = "";

    if (accuracyPercent < 60) {
      difficultyTier = "Easy / Foundational";
      pedagogicalInstruction = `
- The student is currently struggling with this module (Accuracy: ${accuracyPercent.toFixed(0)}%).
- Generate clear, concept-reinforcing, and slightly easier questions focusing on core definitions and relationships.
- Make the high-yield explanations highly detailed, supportive, and clear to build up their confidence.
`;
    } else if (accuracyPercent >= 80) {
      difficultyTier = "Hard / Advanced";
      pedagogicalInstruction = `
- The student is doing exceptionally well (Accuracy: ${accuracyPercent.toFixed(0)}%).
- Challenge them with complex, multi-step clinical reasoning and experimental design questions.
- Write sophisticated distractors (wrong options) that require active elimination of similar scientific arguments.
`;
    } else {
      difficultyTier = "Medium / Standard";
      pedagogicalInstruction = `
- The student is performing at an average level (Accuracy: ${accuracyPercent.toFixed(0)}%).
- Generate standard, high-yield MCAT style conceptual and passage-interpretation questions.
`;
    }

    // Dynamic prompt adaptation based on reading speed (WPM)
    let wpmInstruction = "";
    if (wpm > 250) {
      wpmInstruction = `
- The student read very quickly at ${wpm} WPM. They may have scanned the text.
- Formulate a couple of questions that test for deep reading of specific details or subtle wording to ensure they didn't miss details.
`;
    } else if (wpm < 130) {
      wpmInstruction = `
- The student read slowly and carefully at ${wpm} WPM.
- Formulate questions that check high-level structural and thematic comprehension, offering clear conceptual bridges in the explanations.
`;
    } else {
      wpmInstruction = `
- The student read at a normal pace of ${wpm} WPM.
- Maintain a balanced mix of detail-retrieval and conceptual-inference questions.
`;
    }

    // System prompt instructing strict JSON schema output
    const systemPrompt = `
You are an expert MCAT Question Generator. Analyze the provided reading passage segment and write 5 multiple-choice questions.
Target Difficulty Tier: ${difficultyTier}
Pedagogical Guidelines: ${pedagogicalInstruction}
Reading Speed Personalization: ${wpmInstruction}

Output MUST be a valid JSON array containing exactly 5 items matching this exact schema:
[
  {
    "questionText": "Question text here...",
    "options": {
      "A": "Option A text",
      "B": "Option B text",
      "C": "Option C text",
      "D": "Option D text"
    },
    "correctAnswer": "A",
    "explanation": "Detailed explanation of why this answer is correct and why other choices are incorrect."
  }
]

Do not include any intro, outro, markdown formatting tags (other than the JSON array), or chat commentary. Only output the raw, parseable JSON array.
`;

    // Sanitize passage text to prevent basic prompt injections
    let sanitizedPassage = passageText
      .replace(/<\|system\|>/gi, "")
      .replace(/<\|user\|>/gi, "")
      .replace(/<\|assistant\|>/gi, "")
      .replace(/<\|end_of_text\|>/gi, "")
      .trim();

    // Truncate to reasonable token length
    if (sanitizedPassage.length > 15000) {
      sanitizedPassage = sanitizedPassage.substring(0, 15000) + "...";
    }

    const modelUrl = "https://api-inference.huggingface.co/models/meta-llama/Llama-3.1-8B-Instruct?provider=featherless-ai";

    // Call Hugging Face API
    const response = await fetch(modelUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${hfToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: `<|system|>\n${systemPrompt}\n<|user|>\nPassage Segment: "${sanitizedPassage}"\n<|assistant|>\n`,
        parameters: {
          max_new_tokens: 800,
          temperature: 0.75,
          return_full_text: false,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Hugging Face API returned error status:", response.status, errorText);
      return NextResponse.json({ error: `Hugging Face API error: ${response.statusText}` }, { status: response.status });
    }

    const data = await response.json();
    let generatedText = data[0]?.generated_text || data.generated_text;

    if (!generatedText) {
      console.error("No text returned in Hugging Face response:", data);
      return NextResponse.json({ error: "Empty model output" }, { status: 500 });
    }

    // Clean up potential markdown wrapper characters
    generatedText = generatedText.trim();
    if (generatedText.startsWith("```")) {
      generatedText = generatedText.replace(/^```(json)?/, "");
      generatedText = generatedText.replace(/```$/, "");
      generatedText = generatedText.trim();
    }

    // Locate brackets to avoid trailing texts
    const startIdx = generatedText.indexOf("[");
    const endIdx = generatedText.lastIndexOf("]");
    if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
      generatedText = generatedText.substring(startIdx, endIdx + 1);
    }

    try {
      const parsedQuestions = JSON.parse(generatedText);

      // Map sequential IDs to match client-side expectations
      const structuredQuestions = parsedQuestions.map((q: any, idx: number) => ({
        id: idx + 1,
        questionText: q.questionText,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
      }));

      return NextResponse.json({ questions: structuredQuestions });
    } catch (parseError) {
      console.error("Failed to parse JSON output from Llama:", generatedText, parseError);
      return NextResponse.json({ error: "Failed to parse JSON response from LLM" }, { status: 500 });
    }
  } catch (err: any) {
    console.error("Unhandled MCQ generator route error:", err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
