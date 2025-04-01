
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Send } from 'lucide-react';
import RobotHead from './RobotHead';
import { useToast } from '@/components/ui/use-toast';
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
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // For demo purposes, let's simulate the LLM responses
  const demoResponses = [
    "The moon orbits around the Earth due to the gravitational pull between the two bodies.",
    "The process of photosynthesis allows plants to convert sunlight into energy.",
    "Dinosaurs lived during the Mesozoic Era, which includes the Triassic, Jurassic, and Cretaceous periods.",
    "Atoms are made up of protons, neutrons, and electrons, which are the building blocks of matter.",
    "The water cycle is the continuous movement of water through the Earth's atmosphere.",
  ];

  // Function to get a random response
  const getRandomResponse = () => {
    return demoResponses[Math.floor(Math.random() * demoResponses.length)];
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
      
      // Simulate robot response
      setTimeout(() => {
        setIsSpeaking(false);
        const response = getRandomResponse();
        addMessage(response, false);
      }, 1500);
      
      setUserMessage('');
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

  return (
    <div className="p-4 max-w-md mx-auto flex flex-col h-[80vh]">
      <h1 className="text-2xl font-bold text-center mb-4 text-robot-blue">
        Chat with {robotConfig.name}
      </h1>
      
      <div className="robot-container mb-4">
        <div className="robot-preview mb-2">
          <RobotHead
            headType={robotConfig.headType}
            eyeType={robotConfig.eyeType}
            mouthType={robotConfig.mouthType}
            antennaType={robotConfig.antennaType}
            headColor={robotConfig.headColor}
            eyeColor={robotConfig.eyeColor}
            isAnimated={true}
            isSpeaking={isSpeaking}
          />
        </div>
      </div>
      
      <div className="flex-grow overflow-auto mb-4 robot-message-container">
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
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type your question..."
            className="flex-grow p-2 bg-robot-dark border border-robot-metal rounded-lg text-white"
            disabled={recording}
          />
          
          <Button
            variant="outline"
            size="icon"
            onClick={recording ? stopRecording : startRecording}
            className={recording ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-robot-blue text-white hover:bg-robot-purple'}
          >
            {recording ? <MicOff /> : <Mic />}
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            onClick={sendTextMessage}
            disabled={!userMessage.trim() || recording}
            className="bg-robot-blue text-white hover:bg-robot-purple"
          >
            <Send />
          </Button>
        </div>
        
        <Button
          variant="outline"
          onClick={onBackToBuilder}
          className="w-full mt-4 border-robot-blue text-robot-blue hover:bg-robot-blue hover:text-white"
        >
          Back to Builder
        </Button>
      </div>
    </div>
  );
};

export default RobotChat;
