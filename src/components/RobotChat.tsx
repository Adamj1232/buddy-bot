
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Send, Maximize, Minimize, Settings, ArrowLeft } from 'lucide-react';
import RobotHead from './RobotHead';
import { useToast } from '@/components/ui/use-toast';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useIsMobile } from '@/hooks/use-mobile';
import type { RobotConfig } from './RobotBuilder';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getEducationalResponse } from '@/services/aiService';
import { textToSpeech } from '@/services/speechService';
import { useApiKeys } from '@/hooks/use-api-keys';
import ApiKeyConfig from './ApiKeyConfig';

type RobotChatProps = {
  robotConfig: RobotConfig;
  onBackToBuilder: () => void;
};

type Message = {
  content: string;
  isUser: boolean;
  status?: 'pending' | 'complete' | 'error';
};

const RobotChat: React.FC<RobotChatProps> = ({ robotConfig, onBackToBuilder }) => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [recording, setRecording] = useState(false);
  const [userMessage, setUserMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { content: `Hi! I'm ${robotConfig.name}. Ask me any educational question!`, isUser: false }
  ]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isTextExpanded, setIsTextExpanded] = useState(true);
  const [apiConfigOpen, setApiConfigOpen] = useState(false);
  const [processingMessage, setProcessingMessage] = useState(false);
  
  const { apiKeys, isConfigured } = useApiKeys();
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  // Check if API keys are configured on initial load
  useEffect(() => {
    if (!isConfigured) {
      setApiConfigOpen(true);
    }
  }, [isConfigured]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current);
        processAudioToText(audioBlob);
      };

      mediaRecorderRef.current.start();
      setRecording(true);
      
      toast({
        title: "Recording Started",
        description: "Speak your question clearly...",
      });
      
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast({
        title: "Microphone Error",
        description: "Could not access your microphone",
        variant: "destructive"
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
      
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      
      toast({
        title: "Recording Stopped",
        description: "Processing your question...",
      });
    }
  };

  const processAudioToText = async (audioBlob: Blob) => {
    // In a real implementation, we would use a speech-to-text service here
    // For now, we'll show a placeholder message to simulate processing
    toast({
      title: "Processing Speech",
      description: "Converting your audio to text...",
    });
    
    // Simulating speech recognition with a timeout
    // In a real implementation, this would be replaced with an actual STT service call
    setTimeout(() => {
      const simulatedText = "How does photosynthesis work?";
      setUserMessage(simulatedText);
      sendMessage(simulatedText);
    }, 1500);
  };

  const sendTextMessage = () => {
    if (userMessage.trim()) {
      sendMessage(userMessage);
      setUserMessage('');
    }
  };

  const sendMessage = async (content: string) => {
    if (!isConfigured) {
      toast({
        title: "API Keys Missing",
        description: "Please configure your API keys first",
        variant: "destructive"
      });
      setApiConfigOpen(true);
      return;
    }

    // Add user message to chat
    addMessage(content, true);
    
    // Set state to show loading
    setProcessingMessage(true);

    try {
      // Add a pending bot message
      const pendingMessageIndex = messages.length;
      setMessages(prev => [...prev, { 
        content: "Thinking...", 
        isUser: false, 
        status: 'pending' 
      }]);

      // Get response from AI service
      const response = await getEducationalResponse(content, apiKeys.openai || '');
      
      // Replace the pending message with the actual response
      setMessages(prev => {
        const updatedMessages = [...prev];
        updatedMessages[pendingMessageIndex] = { 
          content: response, 
          isUser: false,
          status: 'complete'
        };
        return updatedMessages;
      });

      // Generate speech
      speakText(response);
    } catch (error) {
      console.error('Error processing message:', error);
      toast({
        title: "Error",
        description: "There was a problem processing your request",
        variant: "destructive"
      });
      
      // Update pending message to show error
      setMessages(prev => {
        const updatedMessages = [...prev];
        const pendingIndex = updatedMessages.findIndex(
          msg => msg.isUser === false && msg.status === 'pending'
        );
        
        if (pendingIndex !== -1) {
          updatedMessages[pendingIndex] = {
            content: "Sorry, I couldn't process your question. Please try again.",
            isUser: false,
            status: 'error'
          };
        }
        
        return updatedMessages;
      });
    } finally {
      setProcessingMessage(false);
    }
  };

  const speakText = async (text: string) => {
    try {
      setIsSpeaking(true);
      
      // Stop any currently playing audio
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current = null;
      }
      
      // Generate speech audio from text
      const audio = await textToSpeech(text, apiKeys.elevenlabs || '');
      currentAudioRef.current = audio;
      
      // Play the audio and animate mouth
      audio.play();
      
      // When audio ends, stop speaking animation
      audio.onended = () => {
        setIsSpeaking(false);
        currentAudioRef.current = null;
      };
      
      // If there's an error, stop speaking animation
      audio.onerror = () => {
        setIsSpeaking(false);
        currentAudioRef.current = null;
        toast({
          title: "Audio Error",
          description: "Couldn't play the speech audio",
          variant: "destructive"
        });
      };
    } catch (error) {
      console.error('Error speaking text:', error);
      setIsSpeaking(false);
      toast({
        title: "Speech Error",
        description: "Couldn't generate the speech audio",
        variant: "destructive"
      });
    }
  };

  const addMessage = (content: string, isUser: boolean) => {
    setMessages(prev => [...prev, { content, isUser }]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendTextMessage();
    }
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="p-2 sm:p-4 max-w-md mx-auto flex flex-col h-[80vh] relative">
      <div className="steampunk-cog w-32 h-32 top-0 right-0 rotate-12 opacity-10"></div>
      <div className="steampunk-cog w-24 h-24 bottom-0 left-0 -rotate-12 opacity-10"></div>
      
      <h1 className="text-xl sm:text-2xl font-bold text-center mb-3 sm:mb-4 steampunk-title">
        Chat with {robotConfig.name}
        <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-2 h-6 bg-robot-metal/70 rounded-full"></div>
        <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-2 h-6 bg-robot-metal/70 rounded-full"></div>
      </h1>
      
      <div className="robot-container mb-4 neo-glow relative">
        {/* Added padding-top to create space for antenna */}
        <div className={`robot-preview mb-2 ${robotConfig.antennaType !== 'none' ? 'pt-10 sm:pt-12' : 'pt-2'}`}>
          <RobotHead
            headType={robotConfig.headType}
            eyeType={robotConfig.eyeType}
            mouthType={robotConfig.mouthType}
            antennaType={robotConfig.antennaType}
            headColor={robotConfig.headColor}
            eyeColor={robotConfig.eyeColor}
            headTexture={robotConfig.headTexture}
            mouthAnimation={robotConfig.mouthAnimation}
            isAnimated={true}
            isSpeaking={isSpeaking}
          />
        </div>
      </div>
      
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => setApiConfigOpen(true)}
        className="w-auto self-end mb-2 border-robot-purple text-robot-purple hover:bg-robot-purple hover:text-white cyber-button"
      >
        <Settings className="mr-1 h-3 w-3" />
        <span className="text-sm">{isConfigured ? "API Settings" : "Configure APIs"}</span>
      </Button>
      
      <Collapsible
        open={isTextExpanded}
        onOpenChange={setIsTextExpanded}
        className="flex-grow flex flex-col"
      >
        <div className="flex items-center justify-between mb-2">
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="flex gap-1 text-robot-blue hover:text-robot-purple hover:bg-transparent cyber-button">
              {isTextExpanded ? (
                <>
                  <Minimize className="h-4 w-4" />
                  <span className="text-sm">Hide Chat</span>
                </>
              ) : (
                <>
                  <Maximize className="h-4 w-4" />
                  <span className="text-sm">Show Chat</span>
                </>
              )}
            </Button>
          </CollapsibleTrigger>
          <div className="flex gap-1">
            <span className="h-2 w-2 rounded-full bg-robot-blue animate-pulse"></span>
            <span className="h-2 w-2 rounded-full bg-robot-green animate-pulse delay-100"></span>
            <span className="h-2 w-2 rounded-full bg-robot-red animate-pulse delay-200"></span>
          </div>
        </div>
        
        <CollapsibleContent className="flex-grow flex flex-col">
          <ScrollArea 
            className="flex-grow mb-4 robot-message-container neo-blur steampunk-panel"
            ref={chatContainerRef}
          >
            <div className="p-2">
              {messages.map((message, index) => (
                <div 
                  key={index} 
                  className={`mb-2 p-2 rounded-lg ${message.isUser ? 
                    'bg-robot-blue/20 border border-robot-blue text-white ml-auto max-w-[80%]' : 
                    'bg-robot-dark border border-robot-metal text-white mr-auto max-w-[80%]'
                  } ${message.status === 'pending' ? 'animate-pulse' : ''}`}
                >
                  <p>{message.content}</p>
                  {message.status === 'pending' && (
                    <div className="flex justify-center space-x-1 mt-1">
                      <div className="w-1.5 h-1.5 bg-robot-metal rounded-full animate-bounce"></div>
                      <div className="w-1.5 h-1.5 bg-robot-metal rounded-full animate-bounce delay-100"></div>
                      <div className="w-1.5 h-1.5 bg-robot-metal rounded-full animate-bounce delay-200"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
          
          <div className="mt-auto">
            <div className="flex items-center gap-2 cyber-input-container">
              <input
                type="text"
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type your question..."
                className="flex-grow p-2 bg-robot-dark border border-robot-metal rounded-lg text-white cyber-input"
                disabled={recording || processingMessage}
              />
              
              <Button
                variant="outline"
                size="icon"
                onClick={recording ? stopRecording : startRecording}
                disabled={processingMessage}
                className={recording ? 'bg-red-500 text-white hover:bg-red-600 cyber-button pulse-red' : 'bg-robot-blue text-white hover:bg-robot-purple cyber-button'}
              >
                {recording ? <MicOff /> : <Mic />}
              </Button>
              
              <Button
                variant="outline"
                size="icon"
                onClick={sendTextMessage}
                disabled={!userMessage.trim() || recording || processingMessage}
                className="bg-robot-blue text-white hover:bg-robot-purple cyber-button"
              >
                <Send />
              </Button>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
      
      {!isTextExpanded && (
        <div className="mt-4 flex items-center justify-center">
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => setRecording(prevRecording => !prevRecording)}
            disabled={processingMessage}
            className={`rounded-full p-6 ${recording ? 'bg-red-500 text-white hover:bg-red-600 pulse-red' : 'bg-robot-blue text-white hover:bg-robot-purple'}`}
          >
            {recording ? <MicOff className="h-8 w-8" /> : <Mic className="h-8 w-8" />}
          </Button>
        </div>
      )}
      
      <Button
        variant="outline"
        onClick={onBackToBuilder}
        className="w-full mt-4 border-robot-blue text-robot-blue hover:bg-robot-blue hover:text-white cyber-button"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        <span className="text-sm">Back to Builder</span>
      </Button>
      
      <ApiKeyConfig open={apiConfigOpen} onOpenChange={setApiConfigOpen} />
    </div>
  );
};

export default RobotChat;
