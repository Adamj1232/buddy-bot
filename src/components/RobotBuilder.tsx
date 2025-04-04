import React, { useState, useEffect } from 'react';
import RobotHead from './RobotHead';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { ChevronDown } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useIsMobile } from '@/hooks/use-mobile';

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

const RobotBuilder: React.FC<RobotBuilderProps> = ({ onRobotComplete }) => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [robotName, setRobotName] = useState('');
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
  const textureOptions = ['smooth', 'metallic', 'rusty', 'digital', 'holographic', 'plated', 'armored'];
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
  
  // Complete robot building
  const finishRobot = () => {
    if (!robotName.trim()) {
      toast({
        title: "Name Required",
        description: "Please give your robot a name",
        variant: "destructive"
      });
      return;
    }
    
    const completeConfig = { ...robotConfig, name: robotName };
    setRobotConfig(completeConfig);
    onRobotComplete(completeConfig);
  };
  
  return (
    <div className="p-2 sm:p-4 max-w-md mx-auto relative">
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
      
      <Accordion type="single" collapsible className="mb-4 rounded-lg overflow-hidden border-2 border-robot-metal/50 steampunk-panel">
        <AccordionItem value="robotName" className="border-none">
          <AccordionTrigger className="bg-robot-dark/80 p-3 hover:bg-robot-dark/90 text-robot-blue">
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 bg-robot-blue rounded-full animate-pulse"></span>
              <span className="text-base sm:text-lg font-semibold">Robot Name</span>
            </span>
          </AccordionTrigger>
          <AccordionContent className="bg-robot-dark/60 p-3">
            <div className="cyber-input-container">
              <Input
                type="text"
                value={robotName}
                onChange={(e) => setRobotName(e.target.value)}
                placeholder="Enter robot name..."
                className="w-full p-2 bg-robot-dark border border-robot-metal rounded-lg text-white cyber-input"
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="headSection" className="border-none">
          <AccordionTrigger className="bg-robot-dark/80 p-3 hover:bg-robot-dark/90 text-robot-blue">
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 bg-robot-blue rounded-full animate-pulse"></span>
              <span className="text-base sm:text-lg font-semibold">Head Design</span>
            </span>
          </AccordionTrigger>
          <AccordionContent className="bg-robot-dark/60 p-3">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-robot-blue mb-2">Head Shape</label>
                <div className={`flex gap-2 flex-wrap ${isMobile ? 'justify-center' : ''}`}>
                  {headOptions.map(option => (
                    <button
                      key={option}
                      className={`robot-part-button ${isMobile ? 'text-sm flex-grow min-w-[45%]' : 'flex-1'} ${robotConfig.headType === option ? 'bg-robot-blue text-black' : ''}`}
                      onClick={() => updateRobotPart('headType', option)}
                    >
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-robot-blue mb-2">Texture</label>
                <div className={`flex gap-2 flex-wrap ${isMobile ? 'justify-center' : ''}`}>
                  {textureOptions.map(option => (
                    <button
                      key={option}
                      className={`robot-part-button ${isMobile ? 'text-sm flex-grow min-w-[45%]' : 'flex-1'} ${robotConfig.headTexture === option ? 'bg-robot-blue text-black' : ''}`}
                      onClick={() => updateRobotPart('headTexture', option)}
                    >
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-robot-blue mb-2">Head Color</label>
                <div className="flex gap-2 flex-wrap justify-center">
                  {headColors.map(({ name, color }) => (
                    <button
                      key={color}
                      className="color-button relative"
                      style={{ backgroundColor: color }}
                      title={name}
                      onClick={() => updateRobotPart('headColor', color)}
                    >
                      {robotConfig.headColor === color && (
                        <span className="absolute inset-0 flex items-center justify-center">
                          <span className="w-2 h-2 bg-white rounded-full"></span>
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="featuresSection" className="border-none">
          <AccordionTrigger className="bg-robot-dark/80 p-3 hover:bg-robot-dark/90 text-robot-blue">
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 bg-robot-blue rounded-full animate-pulse"></span>
              <span className="text-base sm:text-lg font-semibold">Face Features</span>
            </span>
          </AccordionTrigger>
          <AccordionContent className="bg-robot-dark/60 p-3">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-robot-blue mb-2">Eyes</label>
                <div className={`flex gap-2 flex-wrap ${isMobile ? 'justify-center' : ''}`}>
                  {eyeOptions.map(option => (
                    <button
                      key={option}
                      className={`robot-part-button ${isMobile ? 'text-sm flex-grow min-w-[45%]' : 'flex-1'} ${robotConfig.eyeType === option ? 'bg-robot-blue text-black' : ''}`}
                      onClick={() => updateRobotPart('eyeType', option)}
                    >
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-robot-blue mb-2">Eye Color</label>
                <div className="flex gap-2 flex-wrap justify-center">
                  {eyeColors.map(({ name, color }) => (
                    <button
                      key={color}
                      className="color-button relative"
                      style={{ backgroundColor: color }}
                      title={name}
                      onClick={() => updateRobotPart('eyeColor', color)}
                    >
                      {robotConfig.eyeColor === color && (
                        <span className="absolute inset-0 flex items-center justify-center">
                          <span className="w-2 h-2 bg-robot-dark rounded-full"></span>
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-robot-blue mb-2">Mouth</label>
                <div className={`flex gap-2 flex-wrap ${isMobile ? 'justify-center' : ''}`}>
                  {mouthOptions.map(option => (
                    <button
                      key={option}
                      className={`robot-part-button ${isMobile ? 'text-sm flex-grow min-w-[45%]' : 'flex-1'} ${robotConfig.mouthType === option ? 'bg-robot-blue text-black' : ''}`}
                      onClick={() => updateRobotPart('mouthType', option)}
                    >
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-robot-blue mb-2">Mouth Animation</label>
                <div className={`flex gap-2 flex-wrap ${isMobile ? 'justify-center' : ''}`}>
                  {mouthAnimOptions.map(option => (
                    <button
                      key={option}
                      className={`robot-part-button ${isMobile ? 'text-sm flex-grow min-w-[45%]' : 'flex-1'} ${robotConfig.mouthAnimation === option ? 'bg-robot-blue text-black' : ''}`}
                      onClick={() => updateRobotPart('mouthAnimation', option)}
                    >
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="antennaSection" className="border-none">
          <AccordionTrigger className="bg-robot-dark/80 p-3 hover:bg-robot-dark/90 text-robot-blue">
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 bg-robot-blue rounded-full animate-pulse"></span>
              <span className="text-base sm:text-lg font-semibold">Antenna</span>
            </span>
          </AccordionTrigger>
          <AccordionContent className="bg-robot-dark/60 p-3">
            <div>
              <div className={`flex gap-2 flex-wrap ${isMobile ? 'justify-center' : ''}`}>
                {antennaOptions.map(option => (
                  <button
                    key={option}
                    className={`robot-part-button ${isMobile ? 'text-sm flex-grow min-w-[45%]' : 'flex-1'} ${robotConfig.antennaType === option ? 'bg-robot-blue text-black' : ''}`}
                    onClick={() => updateRobotPart('antennaType', option)}
                  >
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      
      <button
        className="build-finish-btn w-full cyber-button"
        onClick={finishRobot}
      >
        <span className="relative z-10">Build Robot!</span>
      </button>
    </div>
  );
};

export default RobotBuilder;
