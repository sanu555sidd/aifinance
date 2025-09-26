import { NextRequest, NextResponse } from 'next/server';
import { categorizeExpense, generateExpenseInsights } from '@/lib/ai';
import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY,
  defaultHeaders: {
    'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    'X-Title': 'ExpenseTracker AI',
  },
});

export async function GET(request: NextRequest) {
  try {
    console.log('🧪 Testing OpenRouter API connection...');
    console.log('🔑 API Key exists:', !!process.env.OPENROUTER_API_KEY);
    console.log('🔑 API Key prefix:', process.env.OPENROUTER_API_KEY?.substring(0, 15));
    console.log('🌐 Base URL:', 'https://openrouter.ai/api/v1');
    console.log('🏠 App URL:', process.env.NEXT_PUBLIC_APP_URL);

    const completion = await openai.chat.completions.create({
      model: 'openai/gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant. Respond with a simple test message.',
        },
        {
          role: 'user',
          content: 'Say "Hello from OpenRouter!" and nothing else.',
        },
      ],
      temperature: 0.1,
      max_tokens: 20,
    });

    const response = completion.choices[0].message.content;
    console.log('✅ OpenRouter API test successful:', response);

    return NextResponse.json({ 
      success: true, 
      message: response,
      debug: {
        hasApiKey: !!process.env.OPENROUTER_API_KEY,
        apiKeyPrefix: process.env.OPENROUTER_API_KEY?.substring(0, 15),
        baseURL: 'https://openrouter.ai/api/v1',
        appURL: process.env.NEXT_PUBLIC_APP_URL,
      }
    });
  } catch (error) {
    console.error('❌ OpenRouter API test failed:', error);
    
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      debug: {
        hasApiKey: !!process.env.OPENROUTER_API_KEY,
        apiKeyPrefix: process.env.OPENROUTER_API_KEY?.substring(0, 15),
        baseURL: 'https://openrouter.ai/api/v1',
        appURL: process.env.NEXT_PUBLIC_APP_URL,
      }
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { description, testInsights } = await request.json();
    
    console.log('🧪 Test AI endpoint called with:', { description, testInsights });
    
    // Test environment variables
    console.log('Environment check:');
    console.log('- OPENROUTER_API_KEY exists:', !!process.env.OPENROUTER_API_KEY);
    console.log('- NEXT_PUBLIC_APP_URL:', process.env.NEXT_PUBLIC_APP_URL);
    
    if (testInsights) {
      // Test insights generation
      const mockExpenses = [
        { id: '1', amount: 50, category: 'Food', description: 'Coffee at Starbucks', date: new Date().toISOString() },
        { id: '2', amount: 120, category: 'Transportation', description: 'Uber ride', date: new Date().toISOString() },
        { id: '3', amount: 80, category: 'Shopping', description: 'New shirt', date: new Date().toISOString() },
      ];
      
      const insights = await generateExpenseInsights(mockExpenses);
      
      return NextResponse.json({ 
        success: true, 
        insights,
        debug: {
          hasApiKey: !!process.env.OPENROUTER_API_KEY,
          apiKeyPrefix: process.env.OPENROUTER_API_KEY?.substring(0, 15) || 'N/A'
        }
      });
    } else {
      // Test categorization
      const result = await categorizeExpense(description);
      
      return NextResponse.json({ 
        success: true, 
        category: result,
        debug: {
          hasApiKey: !!process.env.OPENROUTER_API_KEY,
          apiKeyPrefix: process.env.OPENROUTER_API_KEY?.substring(0, 15) || 'N/A'
        }
      });
    }
  } catch (error) {
    console.error('🚨 Test AI endpoint error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      debug: {
        hasApiKey: !!process.env.OPENROUTER_API_KEY,
        apiKeyPrefix: process.env.OPENROUTER_API_KEY?.substring(0, 15) || 'N/A'
      }
    }, { status: 500 });
  }
}