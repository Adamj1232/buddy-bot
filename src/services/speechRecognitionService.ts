
/**
 * Speech Recognition Service
 * Uses the Web Speech API to convert speech to text
 */

class SpeechRecognitionService {
  private recognition: SpeechRecognition | null = null;
  private isListening: boolean = false;
  
  constructor() {
    // Check if browser supports SpeechRecognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognitionAPI();
      
      // Configure recognition
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = 'en-US';
    }
  }

  /**
   * Start listening for speech and convert to text
   * @returns Promise that resolves with the transcribed text or rejects with error
   */
  startListening(): Promise<string> {
    // Return early if speech recognition is not supported
    if (!this.recognition) {
      return Promise.reject(new Error('Speech recognition is not supported in this browser'));
    }
    
    // Return early if already listening
    if (this.isListening) {
      return Promise.reject(new Error('Already listening'));
    }
    
    return new Promise((resolve, reject) => {
      if (!this.recognition) {
        reject(new Error('Speech recognition is not supported'));
        return;
      }
      
      this.isListening = true;
      
      // Set up event handlers
      this.recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        resolve(transcript);
        this.isListening = false;
      };
      
      this.recognition.onerror = (event) => {
        this.isListening = false;
        reject(new Error(`Speech recognition error: ${event.error}`));
      };
      
      this.recognition.onend = () => {
        // If recognition ends without a result, resolve with empty string
        if (this.isListening) {
          this.isListening = false;
          resolve('');
        }
      };
      
      // Start recognition
      this.recognition.start();
    });
  }
  
  /**
   * Stop listening
   */
  stopListening(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }
  
  /**
   * Check if speech recognition is supported in the current browser
   */
  isSupported(): boolean {
    return !!this.recognition;
  }
}

// Create singleton instance
const speechRecognitionService = new SpeechRecognitionService();

export default speechRecognitionService;
