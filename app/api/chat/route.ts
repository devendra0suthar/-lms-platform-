import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const GROQ_API_KEY = process.env.GROQ_API_KEY;

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!GROQ_API_KEY || GROQ_API_KEY === "your_groq_api_key") {
      return NextResponse.json(
        { error: "Groq API key not configured. Add GROQ_API_KEY to .env.local (get one free at https://console.groq.com/keys)." },
        { status: 503 }
      );
    }

    const { message, courseContext } = await request.json();

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const systemPrompt = `You are a helpful learning assistant for an online learning platform.
${courseContext ? `The student is currently viewing a course titled "${courseContext.title}".
Course description: ${courseContext.description}
${courseContext.lessons?.length ? `The course has ${courseContext.lessons.length} lessons: ${courseContext.lessons.map((l: { title: string }, i: number) => `${i + 1}. ${l.title}`).join(", ")}` : ""}` : ""}

Your role is to:
- Answer questions about the course content
- Explain concepts in simple terms
- Provide helpful learning tips
- Encourage the student
- Keep responses concise but informative

If asked about topics outside the course, politely redirect to course-related questions or provide general learning advice.`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message },
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      let errorMessage = "Failed to get AI response";
      try {
        const errorBody = await response.json();
        errorMessage = errorBody.error?.message ?? errorBody.error ?? errorMessage;
      } catch {
        errorMessage = (await response.text()) || errorMessage;
      }
      console.error("OpenAI API error:", errorMessage);
      return NextResponse.json(
        { error: errorMessage },
        { status: response.status === 401 ? 401 : 502 }
      );
    }

    const data = await response.json();
    const aiMessage = data.choices[0]?.message?.content || "Sorry, I couldn't generate a response.";

    return NextResponse.json({ message: aiMessage });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Failed to process chat request" },
      { status: 500 }
    );
  }
}
