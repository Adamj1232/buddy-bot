import React, { useState, useEffect } from 'react';
import RobotHead from './RobotHead';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { ChevronRight, ChevronLeft, ChevronDown, Check } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { motion, AnimatePresence } from 'framer-motion';

type RobotBuilderProps = {
  onRobotComplete: (robotConfig: RobotConfig) => void;
};

export type RobotConfig = {
  headType: string;
  eyeType: string;
  mouthType: string;
  antennaType: string;
  headColor: string;
  eyeColor: string;
  headTexture: string;
  mouthAnimation: string;
  name: string;
};

// Define steps for the builder process
type BuilderStep = {
  id: string;
  title: string;
  description: string;
};

const RobotBuilder: React.FC<RobotBuilderProps> = ({ onRobotComplete }) => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [robotName, setRobotName] = useState('');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right
  
  const steps: BuilderStep[] = [
    { id: 'name', title: 'Name Your Robot', description: 'Give your robot assistant a name' },
    { id: 'headShape', title: 'Head Shape', description: 'Select the overall shape of the head' },
    { id: 'headDetails', title: 'Head Details', description: 'Choose texture and color for the head' },
    { id: 'eyes', title: 'Eyes', description: 'Choose eye style and color' },
    { id: 'mouth', title: 'Mouth', description: 'Pick a mouth style and animation' },
    { id: 'antenna', title: 'Antenna', description: 'Add an antenna to your robot' },
    { id: 'complete', title: 'Complete', description: 'Your robot is ready!' },
  ];
  
  const [robotConfig, setRobotConfig] = useState<RobotConfig>({
    headType: 'square',
    eyeType: 'round',
    mouthType: 'smile',
    antennaType: 'single',
    headColor: '#8E9196', // Default metal color
    eyeColor: '#0EA5E9', // Default blue color
    headTexture: 'smooth',
    mouthAnimation: 'standard',
    name: '',
  });

  // Options for each part with enhanced mechanical options
  const headOptions = ['square', 'round', 'hex', 'triangular', 'octagon', 'transformer', 'mecha'];
  const eyeOptions = ['round', 'square', 'visor', 'scanner', 'alien', 'optical'];
  const mouthOptions = ['smile', 'grid', 'line', 'speaker', 'vent', 'mask'];
  const antennaOptions = ['single', 'double', 'satellite', 'radar', 'combat', 'none'];
  const textureOptions = ['smooth', 'metallic', 'digital', 'holographic', 'plated', 'armored'];
  const mouthAnimOptions = ['standard', 'robotic', 'pulse', 'wave', 'glitch'];
  
  // Color options
  const headColors = [
    { name: 'Metal', color: '#8E9196' },
    { name: 'Blue', color: '#0EA5E9' },
    { name: 'Purple', color: '#8B5CF6' },
    { name: 'Red', color: '#F43F5E' },
    { name: 'Green', color: '#10B981' },
    { name: 'Yellow', color: '#FCD34D' },
    { name: 'Cyan', color: '#22D3EE' },
    { name: 'Orange', color: '#F97316' },
    { name: 'Pink', color: '#EC4899' },
    { name: 'Teal', color: '#14B8A6' },
  ];
  
  const eyeColors = [
    { name: 'Blue', color: '#0EA5E9' },
    { name: 'Red', color: '#F43F5E' },
    { name: 'Green', color: '#10B981' },
    { name: 'Yellow', color: '#FCD34D' },
    { name: 'Purple', color: '#8B5CF6' },
    { name: 'White', color: '#FFFFFF' },
    { name: 'Orange', color: '#F97316' },
    { name: 'Neon', color: '#9BFB54' },
    { name: 'Pink', color: '#EC4899' },
    { name: 'Turquoise', color: '#5EEAD4' },
  ];
  
  // Update robot config
  const updateRobotPart = (part: keyof RobotConfig, value: string) => {
    console.log(`Updating ${part} to ${value}`);
    setRobotConfig(prev => ({ ...prev, [part]: value }));
  };
  
  // Navigation functions
  const goToNextStep = () => {
    // Validate name step
    if (currentStepIndex === 0 && !robotName.trim()) {
      toast({
        title: "Name Required",
        description: "Please give your robot a name",
        variant: "destructive"
      });
      return;
    }
    
    // If on name step, update the name in config
    if (currentStepIndex === 0) {
      setRobotConfig(prev => ({ ...prev, name: robotName }));
    }
    
    // If on last step, complete the build
    if (currentStepIndex === steps.length - 1) {
      finishRobot();
      return;
    }
    
    setDirection(1);
    setCurrentStepIndex(prev => Math.min(prev + 1, steps.length - 1));
  };
  
  const goToPrevStep = () => {
    setDirection(-1);
    setCurrentStepIndex(prev => Math.max(prev - 1, 0));
  };
  
  // Complete robot building
  const finishRobot = () => {
    onRobotComplete(robotConfig);
  };

  // Animation variants
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0
    })
  };
  
  // Render step content based on current step
  const renderStepContent = () => {
    const step = steps[currentStepIndex];
    
    switch (step.id) {
      case 'name':
        return (
          <div className="space-y-4">
            <div className="cyber-input-container">
              <Input
                type="text"
                value={robotName}
                onChange={(e) => setRobotName(e.target.value)}
                placeholder="Enter robot name..."
                className="w-full p-2 bg-robot-dark border border-robot-metal rounded-lg text-white cyber-input"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && robotName.trim()) {
                    e.preventDefault();
                    goToNextStep();
                  }
                }}
              />
            </div>
          </div>
        );
        
      case 'headShape':
        return (
          <div className="grid grid-cols-1 gap-6">
            <div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {headOptions.map(option => (
                  <button
                    key={option}
                    className={`robot-part-button text-sm min-h-[40px] ${robotConfig.headType === option ? 'bg-robot-blue text-black' : ''}`}
                    onClick={() => updateRobotPart('headType', option)}
                  >
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
        
      case 'headDetails':
        return (
          <div className="grid grid-cols-1 gap-6">
            <div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {textureOptions.map(option => (
                  <button
                    key={option}
                    className={`robot-part-button text-sm min-h-[40px] ${robotConfig.headTexture === option ? 'bg-robot-blue text-black' : ''}`}
                    onClick={() => updateRobotPart('headTexture', option)}
                  >
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-robot-blue mb-1">Head Color</label>
              <div className="flex overflow-x-auto space-x-3 py-2 scrollbar-thin scrollbar-thumb-robot-metal/50 scrollbar-track-transparent">
                {headColors.map(({ name, color }) => (
                  <button
                    key={color}
                    className="color-button relative w-8 h-8 rounded-full border-2 border-transparent hover:border-robot-accent focus:outline-none focus:border-robot-accent transition-colors duration-200 z-10 flex-shrink-0"
                    style={{ backgroundColor: color }}
                    title={name}
                    onClick={() => updateRobotPart('headColor', color)}
                  >
                    {robotConfig.headColor === color && (
                      <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <span className="w-3 h-3 bg-white rounded-full border border-robot-dark"></span>
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
        
      case 'eyes':
        return (
          <div className="grid grid-cols-1 gap-6">
            <div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {eyeOptions.map(option => (
                  <button
                    key={option}
                    className={`robot-part-button text-sm min-h-[40px] ${robotConfig.eyeType === option ? 'bg-robot-blue text-black' : ''}`}
                    onClick={() => updateRobotPart('eyeType', option)}
                  >
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-robot-blue mb-1">Eye Color</label>
              <div className="flex overflow-x-auto space-x-3 py-2 scrollbar-thin scrollbar-thumb-robot-metal/50 scrollbar-track-transparent">
                {eyeColors.map(({ name, color }) => (
                  <button
                    key={color}
                    className="color-button relative w-8 h-8 rounded-full border-2 border-transparent hover:border-robot-accent focus:outline-none focus:border-robot-accent transition-colors duration-200 z-10 flex-shrink-0"
                    style={{ backgroundColor: color }}
                    title={name}
                    onClick={() => updateRobotPart('eyeColor', color)}
                  >
                    {robotConfig.eyeColor === color && (
                      <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <span className="w-3 h-3 bg-robot-dark rounded-full border border-white"></span>
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
        
      case 'mouth':
        return (
          <div className="grid grid-cols-1 gap-6">
            <div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {mouthOptions.map(option => (
                  <button
                    key={option}
                    className={`robot-part-button text-sm min-h-[40px] ${robotConfig.mouthType === option ? 'bg-robot-blue text-black' : ''}`}
                    onClick={() => updateRobotPart('mouthType', option)}
                  >
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex overflow-x-auto space-x-3 py-2 scrollbar-thin scrollbar-thumb-robot-metal/50 scrollbar-track-transparent">
                {mouthAnimOptions.map(option => (
                  <button
                    key={option}
                    className={`robot-part-button rounded-full w-16 h-16 flex items-center justify-center flex-shrink-0 text-xs ${robotConfig.mouthAnimation === option ? 'bg-robot-blue text-black' : ''}`}
                    onClick={() => updateRobotPart('mouthAnimation', option)}
                  >
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
        
      case 'antenna':
        return (
          <div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {antennaOptions.map(option => (
                <button
                  key={option}
                  className={`robot-part-button text-sm min-h-[40px] ${robotConfig.antennaType === option ? 'bg-robot-blue text-black' : ''}`}
                  onClick={() => updateRobotPart('antennaType', option)}
                >
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </button>
              ))}
            </div>
          </div>
        );
        
      case 'complete':
        return (
          <div className="text-center space-y-4">
            <div className="text-robot-blue font-medium">
              <p>Your robot assistant is ready to go!</p>
              <p className="text-xl mt-2 font-bold">{robotConfig.name}</p>
            </div>
            <div className="w-full">
              <Button 
                className="w-full cyber-button" 
                onClick={finishRobot}
              >
                <Check className="mr-2 h-4 w-4" />
                <span className="relative z-10">Finish</span>
              </Button>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  // Progress indicators
  const renderProgressIndicators = () => {
    return (
      <div className="flex justify-center gap-2 mb-4">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={`h-2 w-2 rounded-full transition-all duration-300 ${
              index === currentStepIndex
                ? 'bg-robot-blue w-6'
                : index < currentStepIndex
                ? 'bg-robot-blue'
                : 'bg-robot-metal/50'
            }`}
          />
        ))}
      </div>
    );
  };
  
  return (
    <div className="p-2 sm:p-4 max-w-md mx-auto relative overflow-hidden">
      <div className="steampunk-cog w-32 h-32 top-0 right-0 rotate-12 opacity-10"></div>
      <div className="steampunk-cog w-24 h-24 bottom-0 left-0 -rotate-12 opacity-10"></div>
      
      <h1 className="text-xl sm:text-2xl font-bold text-center mb-4 sm:mb-6 steampunk-title relative">
        Build Your Robot Assistant
        <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-2 h-6 bg-robot-metal/70 rounded-full"></div>
        <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-2 h-6 bg-robot-metal/70 rounded-full"></div>
      </h1>
      
      <div className="robot-container mb-4 sm:mb-6 neo-glow">
        <div className="robot-preview">
          <RobotHead
            headType={robotConfig.headType}
            eyeType={robotConfig.eyeType}
            mouthType={robotConfig.mouthType}
            antennaType={robotConfig.antennaType}
            headColor={robotConfig.headColor}
            eyeColor={robotConfig.eyeColor}
            headTexture={robotConfig.headTexture}
            isAnimated={true}
          />
        </div>
      </div>
      
      {renderProgressIndicators()}
      
      <div className="mb-4 rounded-lg overflow-hidden border-2 border-robot-metal/50 steampunk-panel">
        <div className="bg-robot-dark/80 p-3 text-robot-blue">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 bg-robot-blue rounded-full animate-pulse"></span>
            <span className="text-base sm:text-lg font-semibold">{steps[currentStepIndex].title}</span>
          </div>
          <div className="text-xs text-robot-blue/70 mt-1">
            {steps[currentStepIndex].description}
          </div>
        </div>
        
        <div className="bg-robot-dark/60 p-4 relative overflow-hidden overflow-y-auto h-[280px]">
          <AnimatePresence custom={direction} initial={false}>
            <motion.div
              key={currentStepIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }}
              className="w-full absolute top-0 left-0 p-4"
            >
              {renderStepContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      
      <div className="flex gap-2">
        <Button
          variant="outline"
          className={`cyber-button-secondary ${currentStepIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={goToPrevStep}
          disabled={currentStepIndex === 0}
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          <span className="relative z-10">Back</span>
        </Button>
        
        <Button
          className="cyber-button flex-1"
          onClick={goToNextStep}
        >
          <span className="relative z-10">
            {currentStepIndex === steps.length - 1 ? 'Complete' : 'Next'}
          </span>
          {currentStepIndex < steps.length - 1 && <ChevronRight className="ml-1 h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
};

export default RobotBuilder;
