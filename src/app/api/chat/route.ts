import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

export const runtime = 'edge';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const SYSTEM_PROMPT = `You are UMREC AI Assistant for the University of Makati Research Ethics Committee.

Your role is to help researchers with:
- Understanding the research submission process
- Explaining document requirements (Application Form, Research Protocol, Consent Form, Endorsement Letter)
- Clarifying ethics review procedures and classifications (Exempted, Expedited, Full Review)
- Answering questions about submission status
- Providing guidance on research ethics

Key information:
- Review process: Submission → Staff Verification → Classification → Review → Decision
- Typical timeline: 2-4 weeks depending on classification
- Exempted: No review needed
- Expedited: 2 weeks, 3 reviewers
- Full Review: 30 days, all reviewers

Guidelines:
- Be helpful, professional, and concise
- If you don't know something specific, advise contacting UMREC secretariat
- Always maintain confidentiality
- Keep responses clear and actionable

Respond naturally to researcher questions.`;

export async function POST(request: Request) {
  try {
    const { message, history } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const chatHistory = history?.map((msg: any) => ({
      role: msg.isUser ? 'user' : 'model',
      parts: [{ text: msg.text }],
    })) || [];

    const chat = model.startChat({
      history: [
        {
          role: 'user',
          parts: [{ text: SYSTEM_PROMPT }],
        },
        {
          role: 'model',
          parts: [{ text: 'I understand. I am the UMREC AI Assistant ready to help with research ethics submissions.' }],
        },
        ...chatHistory,
      ],
      generationConfig: {
        maxOutputTokens: 800,
        temperature: 0.7,
      },
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ 
      success: true, 
      message: text 
    });

  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json(
      { error: 'Failed to get response from AI assistant' },
      { status: 500 }
    );
  }
}
