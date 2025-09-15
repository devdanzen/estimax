import 'dotenv/config';
import Groq from 'groq-sdk';
import { NextResponse } from 'next/server';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

export async function POST(request) {
  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant for EstiMax, a construction materials estimation system. Help users find and understand materials pricing and specifications."
        },
        {
          role: "user",
          content: message
        }
      ],
      model: "llama-3.3-70b-versatile", // Current supported model
      temperature: 0.7,
      max_tokens: 1024,
      stream: false
    });

    return NextResponse.json({
      response: completion.choices[0]?.message?.content || "No response generated"
    });

  } catch (error) {
    console.error('Groq API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    );
  }
}