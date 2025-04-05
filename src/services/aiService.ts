
import { v4 as uuidv4 } from 'uuid';
import websocketService from './websocketService';

// This function handles sending the user's question to an educational AI API
// and returns the response
export async function getEducationalResponse(question: string, apiKey?: string, useDefaultServer: boolean = false): Promise<string> {
  if (useDefaultServer) {
    return getResponseViaWebSocket(question);
  } else {
    return getResponseViaDirectAPI(question, apiKey || '');
  }
}

// Get response via direct API call to OpenAI
async function getResponseViaDirectAPI(question: string, apiKey: string): Promise<string> {
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

// Get response via WebSocket
async function getResponseViaWebSocket(question: string): Promise<string> {
  return new Promise((resolve, reject) => {
    if (websocketService.hasPendingRequests()) {
      reject(new Error("A request is already in progress. Please wait."));
      return;
    }

    try {
      // Ensure WebSocket is connected
      websocketService.connect().then(() => {
        const requestId = uuidv4();
        
        // Register one-time handler for this specific response
        websocketService.registerMessageHandler('ai_response', (data) => {
          resolve(data.content);
          // Clean up the handler after use
          websocketService.unregisterMessageHandler('ai_response');
        });
        
        // Send the request
        const success = websocketService.sendMessage('ai_request', {
          question,
          type: 'educational'
        }, requestId);
        
        if (!success) {
          websocketService.unregisterMessageHandler('ai_response');
          reject(new Error("Failed to send message via WebSocket"));
        }
        
        // Set timeout for response
        setTimeout(() => {
          websocketService.unregisterMessageHandler('ai_response');
          reject(new Error("Request timed out. Please try again."));
        }, 30000); // 30 second timeout
      }).catch(error => {
        reject(new Error(`Failed to connect to WebSocket: ${error.message}`));
      });
    } catch (error) {
      reject(error);
    }
  });
}

