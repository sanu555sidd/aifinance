import OpenAI from 'openai';

interface RawInsight {
  type?: string;
  title?: string;
  message?: string;
  action?: string;
  confidence?: number;
}

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY,
  defaultHeaders: {
    'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    'X-Title': 'ExpenseTracker AI',
  },
});

// Debug logging
console.log('🔑 API Key exists:', !!process.env.OPENROUTER_API_KEY);
console.log('🔑 API Key prefix:', process.env.OPENROUTER_API_KEY?.substring(0, 10));
console.log('🌐 Base URL:', 'https://openrouter.ai/api/v1');
console.log('🏠 App URL:', process.env.NEXT_PUBLIC_APP_URL);

export interface ExpenseRecord {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
}

export interface AIInsight {
  id: string;
  type: 'warning' | 'info' | 'success' | 'tip';
  title: string;
  message: string;
  action?: string;
  confidence: number;
}

export async function generateExpenseInsights(
  expenses: ExpenseRecord[]
): Promise<AIInsight[]> {
  try {
    console.log('🚀 Starting AI insights generation for', expenses.length, 'expenses');
    console.log('🔑 API Key status:', process.env.OPENROUTER_API_KEY ? 'Present' : 'Missing');
    
    // Prepare expense data for AI analysis
    const expensesSummary = expenses.map((expense) => ({
      amount: expense.amount,
      category: expense.category,
      description: expense.description,
      date: expense.date,
    }));

    console.log('📊 Expense data prepared:', expensesSummary.slice(0, 3)); // Log first 3 for debugging

    const prompt = `Analyze the following expense data and provide 3-4 actionable financial insights. 
    Return a JSON array of insights with this structure:
    {
      "type": "warning|info|success|tip",
      "title": "Brief title",
      "message": "Detailed insight message with specific numbers when possible",
      "action": "Actionable suggestion",
      "confidence": 0.8
    }

    Expense Data:
    ${JSON.stringify(expensesSummary, null, 2)}

    Focus on:
    1. Spending patterns (day of week, categories)
    2. Budget alerts (high spending areas)
    3. Money-saving opportunities
    4. Positive reinforcement for good habits

    Return only valid JSON array, no additional text.`;

    console.log('📝 Making API request to OpenRouter...');

    const completion = await openai.chat.completions.create({
      model: 'openai/gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content:
            'You are a financial advisor AI that analyzes spending patterns and provides actionable insights. Always respond with valid JSON only.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    console.log('📥 API Response received:', completion);

    const response = completion.choices[0].message.content;
    if (!response) {
      throw new Error('No response from AI');
    }

    console.log('📜 Raw AI response:', response);

    // Clean the response by removing markdown code blocks if present
    let cleanedResponse = response.trim();
    if (cleanedResponse.startsWith('```json')) {
      cleanedResponse = cleanedResponse
        .replace(/^```json\s*/, '')
        .replace(/\s*```$/, '');
    } else if (cleanedResponse.startsWith('```')) {
      cleanedResponse = cleanedResponse
        .replace(/^```\s*/, '')
        .replace(/\s*```$/, '');
    }

    console.log('🧹 Cleaned response:', cleanedResponse);

    // Parse AI response
    const insights = JSON.parse(cleanedResponse);

    console.log('✅ Parsed insights:', insights);

    // Add IDs and ensure proper format
    const formattedInsights = insights.map(
      (insight: RawInsight, index: number) => ({
        id: `ai-${Date.now()}-${index}`,
        type: insight.type || 'info',
        title: insight.title || 'AI Insight',
        message: insight.message || 'Analysis complete',
        action: insight.action,
        confidence: insight.confidence || 0.8,
      })
    );

    console.log('🎯 Final formatted insights:', formattedInsights);
    return formattedInsights;
  } catch (error) {
    console.error('❌ Error generating AI insights:', error);
    console.error('❌ Error stack:', error instanceof Error ? error.stack : 'No stack trace');

    // Fallback to mock insights if AI fails
    return [
      {
        id: 'fallback-1',
        type: 'info',
        title: 'AI Analysis Unavailable',
        message:
          'Unable to generate personalized insights at this time. Please try again later.',
        action: 'Refresh insights',
        confidence: 0.5,
      },
    ];
  }
}

export async function categorizeExpense(description: string): Promise<string> {
  try {
    console.log('🤖 Starting AI categorization for:', description);
    console.log('🔑 Using API key:', process.env.OPENROUTER_API_KEY ? 'Present' : 'Missing');
    
    console.log('📤 Sending request to OpenRouter...');
    
    const completion = await openai.chat.completions.create({
      model: 'openai/gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are an expense categorization AI. Analyze the expense description and categorize it into one of these categories:

- Food: restaurants, groceries, coffee, snacks, dining
- Transportation: gas, uber, taxi, bus fare, parking, car maintenance
- Entertainment: movies, games, concerts, streaming services, books
- Shopping: clothes, electronics, home goods, personal items
- Bills: utilities, rent, phone, internet, insurance, subscriptions
- Healthcare: doctor visits, medicine, pharmacy, medical supplies
- Other: anything that doesn't fit the above categories

Respond with ONLY the category name (exact match from the list above).`,
        },
        {
          role: 'user',
          content: `Categorize this expense description: "${description}"

Examples:
- "coffee at starbucks" → Food
- "uber ride home" → Transportation  
- "netflix subscription" → Entertainment
- "new shirt" → Shopping
- "electric bill" → Bills
- "doctor appointment" → Healthcare

Category:`,
        },
      ],
      temperature: 0.3,
      max_tokens: 30,
    });
    
    console.log('📥 Received response from OpenRouter');
    console.log('📊 Response object:', JSON.stringify(completion, null, 2));

    const category = completion.choices[0].message.content?.trim();
    console.log('🤖 AI response content:', category);

    const validCategories = [
      'Food',
      'Transportation',
      'Entertainment',
      'Shopping',
      'Bills',
      'Healthcare',
      'Other',
    ];

    const finalCategory = validCategories.includes(category || '')
      ? category!
      : 'Other';
    
    console.log('✅ Final category selected:', finalCategory);
    return finalCategory;
  } catch (error) {
    console.error('❌ Detailed error in categorizeExpense:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      error: error
    });
    return 'Other';
  }
}

export async function generateAIAnswer(
  question: string,
  context: ExpenseRecord[]
): Promise<string> {
  try {
    const expensesSummary = context.map((expense) => ({
      amount: expense.amount,
      category: expense.category,
      description: expense.description,
      date: expense.date,
    }));

    const prompt = `Based on the following expense data, provide a detailed and actionable answer to this question: "${question}"

    Expense Data:
    ${JSON.stringify(expensesSummary, null, 2)}

    Provide a comprehensive answer that:
    1. Addresses the specific question directly
    2. Uses concrete data from the expenses when possible
    3. Offers actionable advice
    4. Keeps the response concise but informative (2-3 sentences)
    
    Return only the answer text, no additional formatting.`;

    const completion = await openai.chat.completions.create({
      model: 'deepseek/deepseek-chat-v3-0324:free',
      messages: [
        {
          role: 'system',
          content:
            'You are a helpful financial advisor AI that provides specific, actionable answers based on expense data. Be concise but thorough.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 200,
    });

    const response = completion.choices[0].message.content;
    if (!response) {
      throw new Error('No response from AI');
    }

    return response.trim();
  } catch (error) {
    console.error('❌ Error generating AI answer:', error);
    return "I'm unable to provide a detailed answer at the moment. Please try refreshing the insights or check your connection.";
  }
}