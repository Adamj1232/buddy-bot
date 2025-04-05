
/**
 * Service for handling communication with the educational AI API
 */

// This function handles sending the user's question to an educational AI API
// and returns the response
export async function getEducationalResponse(question: string, apiKey: string): Promise<string> {
  try {
    // Using OpenAI for educational STEM responses
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // Using a model good for educational content
        messages: [
          {
            role: 'system',
            content: 'You are a helpful educational robot assistant for children ages 7-12. ' +
              'Provide accurate but simple explanations about STEM topics. ' +
              'Keep responses concise (under 150 words) and engaging. ' +
              'Use analogies and examples children can relate to. ' +
              'For math questions, explain the process step by step.'
          },
          {
            role: 'user',
            content: question
          }
        ],
        temperature: 0.7,
        max_tokens: 300
      })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error getting educational response:', error);
    return "I'm sorry, I couldn't process your question. Please try again.";
  }
}
