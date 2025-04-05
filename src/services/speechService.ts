
/**
 * Service for handling text-to-speech functionality
 */

export interface SpeechOptions {
  voiceId?: string;
  modelId?: string;
  stability?: number;
  similarityBoost?: number;
}

// Default voice configuration
const DEFAULT_OPTIONS: SpeechOptions = {
  voiceId: 'Xb7hH8MSUJpSbSDYk0k2', // Alice voice - friendly and educational sounding
  modelId: 'eleven_multilingual_v2',
  stability: 0.5,
  similarityBoost: 0.75
};

// This function converts text to speech using ElevenLabs API
export async function textToSpeech(
  text: string, 
  apiKey: string,
  options: SpeechOptions = {}
): Promise<HTMLAudioElement> {
  const mergedOptions = { ...DEFAULT_OPTIONS, ...options };
  
  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${mergedOptions.voiceId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': apiKey
        },
        body: JSON.stringify({
          text,
          model_id: mergedOptions.modelId,
          voice_settings: {
            stability: mergedOptions.stability,
            similarity_boost: mergedOptions.similarityBoost
          }
        })
      }
    );

    if (!response.ok) {
      throw new Error(`Speech API error: ${response.status}`);
    }

    // Convert the response to an audio blob
    const audioBlob = await response.blob();
    
    // Create an audio element and set the source to the blob
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    
    return audio;
  } catch (error) {
    console.error('Error generating speech:', error);
    throw error;
  }
}
