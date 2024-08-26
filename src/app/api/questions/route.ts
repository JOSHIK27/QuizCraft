import { NextRequest, NextResponse } from "next/server";
import { YoutubeTranscript } from "youtube-transcript";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyBBgIDgY7vLqF506RV5N3oC77ktWzVnD4Y");

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { url } = body;

  try {
    const transcript = await YoutubeTranscript.fetchTranscript(url);
    const transcriptText = transcript.map((item) => item.text).join(" ");

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `Generate 5 multiple-choice quiz questions based on the following transcript. Return the result as a valid JSON array of objects, where each object has the following structure: { "question": "...", "options": ["...", "...", "...", "..."], "correctAnswer": "..." }. Ensure the output is a valid JSON array without any surrounding code block markers or additional text. Here's the transcript:\n\n${transcriptText}`;

    const result = await model.generateContent(prompt);
    const quizQuestionsString = result.response.text();
    let quizQuestions;
    try {
      // Remove any potential code block markers
      const cleanedString = quizQuestionsString
        .replace(/```json\n?|\n?```/g, "")
        .trim();
      quizQuestions = JSON.parse(cleanedString);
    } catch (error) {
      console.error("Error parsing AI response:", error);
      console.log("Raw AI response:", quizQuestionsString);
      quizQuestions = [];
    }
    return NextResponse.json({ quizQuestions }, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Failed to generate quiz questions" },
      { status: 500 }
    );
  }
}
