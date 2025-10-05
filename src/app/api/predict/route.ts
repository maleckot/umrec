// src/app/api/predict/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { text, model_name = 'distilbert' } = await request.json();
    
    // Validate input
    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }
    
    // Clean the text - remove or escape control characters
    const cleanedText = text
      .replace(/\n/g, ' ')  // Replace newlines with spaces
      .replace(/\r/g, ' ')  // Replace carriage returns
      .replace(/\t/g, ' ')  // Replace tabs
      .trim();
    
    const response = await fetch('http://localhost:8000/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        text: cleanedText, 
        model_name,
        use_chunking: true  // ✅ Enable automatic chunking for long texts
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Prediction failed');
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Prediction error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to get prediction' },
      { status: 500 }
    );
  }
}
