
import React, { useState, useEffect } from 'react';
import RobotHead from './RobotHead';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';

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
  name: string;
};

const RobotBuilder: React.FC<RobotBuilderProps> = ({ onRobotComplete }) => {
  const { toast } = useToast();
  const [robotName, setRobotName] = useState('');
  const [robotConfig, setRobotConfig] = useState<RobotConfig>({
    headType: 'square',
    eyeType: 'round',
    mouthType: 'smile',
    antennaType: 'single',
    headColor: '#8E9196', // Default metal color
    eyeColor: '#0EA5E9', // Default blue color
    name: '',
  });

  // Options for each part
  const headOptions = ['square', 'round', 'hex'];
  const eyeOptions = ['round', 'square', 'visor'];
  const mouthOptions = ['smile', 'grid', 'line'];
  const antennaOptions = ['single', 'double', 'satellite', 'none'];
  
  // Color options
  const headColors = [
    { name: 'Metal', color: '#8E9196' },
    { name: 'Blue', color: '#0EA5E9' },
    { name: 'Purple', color: '#8B5CF6' },
    { name: 'Red', color: '#F43F5E' },
    { name: 'Green', color: '#10B981' },
    { name: 'Yellow', color: '#FCD34D' },
  ];
  
  const eyeColors = [
    { name: 'Blue', color: '#0EA5E9' },
    { name: 'Red', color: '#F43F5E' },
    { name: 'Green', color: '#10B981' },
    { name: 'Yellow', color: '#FCD34D' },
    { name: 'Purple', color: '#8B5CF6' },
    { name: 'White', color: '#FFFFFF' },
  ];
  
  // Play sound effect
  const playSound = (type: string) => {
    // In a real app, we would implement actual sound effects here
    console.log(`Playing ${type} sound effect`);
    // Placeholder for sound implementation
  };
  
  // Update robot config
  const updateRobotPart = (part: keyof RobotConfig, value: string) => {
    console.log(`Updating ${part} to ${value}`);
    setRobotConfig(prev => ({ ...prev, [part]: value }));
    playSound('click');
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
    playSound('complete');
    onRobotComplete(completeConfig);
  };
  
  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-center mb-4 text-robot-blue">Build Your Robot Assistant</h1>
      
      <div className="robot-container mb-4">
        <div className="robot-preview mb-6">
          <RobotHead
            headType={robotConfig.headType}
            eyeType={robotConfig.eyeType}
            mouthType={robotConfig.mouthType}
            antennaType={robotConfig.antennaType}
            headColor={robotConfig.headColor}
            eyeColor={robotConfig.eyeColor}
            isAnimated={true}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-4 mb-8">
        <div>
          <label className="block text-sm font-medium text-robot-blue mb-2">Robot Name</label>
          <Input
            type="text"
            value={robotName}
            onChange={(e) => setRobotName(e.target.value)}
            placeholder="Enter robot name..."
            className="w-full p-2 bg-robot-dark border border-robot-metal rounded-lg text-white"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-robot-blue mb-2">Head Shape</label>
          <div className="flex gap-2 flex-wrap">
            {headOptions.map(option => (
              <button
                key={option}
                className={`robot-part-button flex-1 ${robotConfig.headType === option ? 'bg-robot-blue text-black' : ''}`}
                onClick={() => updateRobotPart('headType', option)}
              >
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </button>
            ))}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-robot-blue mb-2">Eyes</label>
          <div className="flex gap-2 flex-wrap">
            {eyeOptions.map(option => (
              <button
                key={option}
                className={`robot-part-button flex-1 ${robotConfig.eyeType === option ? 'bg-robot-blue text-black' : ''}`}
                onClick={() => updateRobotPart('eyeType', option)}
              >
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </button>
            ))}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-robot-blue mb-2">Mouth</label>
          <div className="flex gap-2 flex-wrap">
            {mouthOptions.map(option => (
              <button
                key={option}
                className={`robot-part-button flex-1 ${robotConfig.mouthType === option ? 'bg-robot-blue text-black' : ''}`}
                onClick={() => updateRobotPart('mouthType', option)}
              >
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </button>
            ))}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-robot-blue mb-2">Antenna</label>
          <div className="flex gap-2 flex-wrap">
            {antennaOptions.map(option => (
              <button
                key={option}
                className={`robot-part-button flex-1 ${robotConfig.antennaType === option ? 'bg-robot-blue text-black' : ''}`}
                onClick={() => updateRobotPart('antennaType', option)}
              >
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </button>
            ))}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-robot-blue mb-2">Head Color</label>
          <div className="flex gap-2 flex-wrap">
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
        
        <div>
          <label className="block text-sm font-medium text-robot-blue mb-2">Eye Color</label>
          <div className="flex gap-2 flex-wrap">
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
      </div>
      
      <button
        className="build-finish-btn w-full"
        onClick={finishRobot}
      >
        Build Robot!
      </button>
    </div>
  );
};

export default RobotBuilder;
