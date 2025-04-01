
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Send, Maximize, Minimize, MessageCircle } from 'lucide-react';
import RobotHead from './RobotHead';
import { useToast } from '@/components/ui/use-toast';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import type { RobotConfig } from './RobotBuilder';

type RobotChatProps = {
  robotConfig: RobotConfig;
  onBackToBuilder: () => void;
};

type Message = {
  content: string;
  isUser: boolean;
};

const RobotChat: React.FC<RobotChatProps> = ({ robotConfig, onBackToBuilder }) => {
  const { toast } = useToast();
  const [recording, setRecording] = useState(false);
  const [userMessage, setUserMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { content: `Hi! I'm ${robotConfig.name}. Ask me any educational question!`, isUser: false }
  ]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isTextExpanded, setIsTextExpanded] = useState(true);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // For demo purposes, let's simulate the LLM responses
  const demoResponses = [
    "The moon orbits around the Earth due to the gravitational pull between the two bodies. This gravitational interaction is what keeps the moon in its elliptical orbit and is the same force that keeps Earth orbiting the sun.",
    "The process of photosynthesis allows plants to convert sunlight into energy. Plants use chlorophyll to capture sunlight and convert carbon dioxide and water into glucose and oxygen, which is essential for all life on Earth.",
    "Dinosaurs lived during the Mesozoic Era, which includes the Triassic, Jurassic, and Cretaceous periods. They were the dominant terrestrial vertebrates for over 160 million years until their extinction 65 million years ago.",
    "Atoms are made up of protons, neutrons, and electrons, which are the building blocks of matter. Protons and neutrons form the nucleus of an atom, while electrons orbit around the nucleus in specific energy levels.",
    "The water cycle is the continuous movement of water through the Earth's atmosphere. It includes processes like evaporation, condensation, precipitation, infiltration, and transpiration, cycling water from the oceans to the land and back.",
  ];

  // Function to get a random response
  const getRandomResponse = () => {
    return demoResponses[Math.floor(Math.random() * demoResponses.length)];
  };

  // Simulate text-to-speech
  const speakText = (text: string) => {
    setIsSpeaking(true);
    
    // Split text into sentences for more natural speaking animation
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    let currentIndex = 0;
    
    const speakNextSentence = () => {
      if (currentIndex < sentences.length) {
        // Simulate speaking each sentence
        const speakTime = sentences[currentIndex].length * 50; // Adjust time based on sentence length
        
        setTimeout(() => {
          currentIndex++;
          speakNextSentence();
        }, speakTime);
      } else {
        // Done speaking
        setIsSpeaking(false);
      }
    };
    
    speakNextSentence();
  };

  // Start recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        // For demo purposes, we're not actually processing audio
        // In a real app, we would send the audio to a speech-to-text service
        setIsSpeaking(true);
        
        // Simulate processing delay
        setTimeout(() => {
          setIsSpeaking(false);
          
          // For demonstration, just set a placeholder message
          const placeholderText = "How do plants make their own food?";
          setUserMessage(placeholderText);
          addMessage(placeholderText, true);
          
          // Simulate robot response
          setTimeout(() => {
            const response = getRandomResponse();
            addMessage(response, false);
            speakText(response);
          }, 1000);
        }, 1500);
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

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
      
      // Stop all microphone streams
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      
      toast({
        title: "Recording Stopped",
        description: "Processing your question...",
      });
    }
  };

  // Send text message
  const sendTextMessage = () => {
    if (userMessage.trim()) {
      addMessage(userMessage, true);
      setIsSpeaking(true);
      
      // Clear input field
      setUserMessage('');
      
      // Simulate robot response
      setTimeout(() => {
        const response = getRandomResponse();
        addMessage(response, false);
        speakText(response);
      }, 1500);
    }
  };

  // Add message to chat
  const addMessage = (content: string, isUser: boolean) => {
    setMessages(prev => [...prev, { content, isUser }]);
  };

  // Handle keyboard enter to send message
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendTextMessage();
    }
  };

  // Scroll to bottom of chat when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="p-4 max-w-md mx-auto flex flex-col h-[80vh]">
      <h1 className="text-2xl font-bold text-center mb-4 text-transparent bg-clip-text bg-gradient-to-r from-robot-blue to-robot-purple">
        Chat with {robotConfig.name}
      </h1>
      
      <div className="robot-container mb-4 neo-glow">
        <div className="robot-preview mb-2">
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
      
      <Collapsible
        open={isTextExpanded}
        onOpenChange={setIsTextExpanded}
        className="flex-grow flex flex-col"
      >
        <div className="flex items-center justify-between mb-2">
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="flex gap-1 text-robot-blue hover:text-robot-purple hover:bg-transparent">
              {isTextExpanded ? (
                <>
                  <Minimize className="h-4 w-4" />
                  <span>Hide Chat</span>
                </>
              ) : (
                <>
                  <Maximize className="h-4 w-4" />
                  <span>Show Chat</span>
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
          <div 
            ref={chatContainerRef}
            className="flex-grow overflow-auto mb-4 robot-message-container neo-blur"
          >
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`mb-2 p-2 rounded-lg ${message.isUser ? 
                  'bg-robot-blue/20 border border-robot-blue text-white ml-auto max-w-[80%]' : 
                  'bg-robot-dark border border-robot-metal text-white mr-auto max-w-[80%]'
                }`}
              >
                <p>{message.content}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-auto">
            <div className="flex items-center gap-2 cyber-input-container">
              <input
                type="text"
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type your question..."
                className="flex-grow p-2 bg-robot-dark border border-robot-metal rounded-lg text-white cyber-input"
                disabled={recording}
              />
              
              <Button
                variant="outline"
                size="icon"
                onClick={recording ? stopRecording : startRecording}
                className={recording ? 'bg-red-500 text-white hover:bg-red-600 cyber-button pulse-red' : 'bg-robot-blue text-white hover:bg-robot-purple cyber-button'}
              >
                {recording ? <MicOff /> : <Mic />}
              </Button>
              
              <Button
                variant="outline"
                size="icon"
                onClick={sendTextMessage}
                disabled={!userMessage.trim() || recording}
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
        Back to Builder
      </Button>
    </div>
  );
};

export default RobotChat;
