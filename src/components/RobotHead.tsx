
import React from 'react';
import { cn } from '@/lib/utils';

type RobotHeadProps = {
  headType: string;
  eyeType: string;
  mouthType: string;
  antennaType: string;
  headColor: string;
  eyeColor: string;
  isAnimated?: boolean;
  isSpeaking?: boolean;
};

const RobotHead: React.FC<RobotHeadProps> = ({
  headType,
  eyeType,
  mouthType,
  antennaType,
  headColor,
  eyeColor,
  isAnimated = true,
  isSpeaking = false,
}) => {
  // Head shapes
  const renderHead = () => {
    switch (headType) {
      case 'square':
        return (
          <div 
            className={cn("w-48 h-56 rounded-lg relative", isAnimated && "animate-float")}
            style={{ backgroundColor: headColor }}
          ></div>
        );
      case 'round':
        return (
          <div 
            className={cn("w-48 h-56 rounded-full relative", isAnimated && "animate-float")}
            style={{ backgroundColor: headColor }}
          ></div>
        );
      case 'hex':
        return (
          <div 
            className={cn("w-48 h-56 relative", isAnimated && "animate-float")}
            style={{ 
              backgroundColor: headColor,
              clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)'
            }}
          ></div>
        );
      default:
        return (
          <div 
            className={cn("w-48 h-56 rounded-lg relative", isAnimated && "animate-float")}
            style={{ backgroundColor: headColor }}
          ></div>
        );
    }
  };

  // Eye types
  const renderEyes = () => {
    switch (eyeType) {
      case 'round':
        return (
          <div className="absolute top-1/4 left-0 right-0 flex justify-center gap-8">
            <div 
              className={cn("w-8 h-8 rounded-full", isAnimated && "animate-pulse-glow")} 
              style={{ backgroundColor: eyeColor }}
            ></div>
            <div 
              className={cn("w-8 h-8 rounded-full", isAnimated && "animate-pulse-glow")} 
              style={{ backgroundColor: eyeColor }}
            ></div>
          </div>
        );
      case 'square':
        return (
          <div className="absolute top-1/4 left-0 right-0 flex justify-center gap-8">
            <div 
              className={cn("w-8 h-8 rounded-sm", isAnimated && "animate-pulse-glow")} 
              style={{ backgroundColor: eyeColor }}
            ></div>
            <div 
              className={cn("w-8 h-8 rounded-sm", isAnimated && "animate-pulse-glow")} 
              style={{ backgroundColor: eyeColor }}
            ></div>
          </div>
        );
      case 'visor':
        return (
          <div className="absolute top-1/4 left-0 right-0 flex justify-center">
            <div 
              className={cn("w-32 h-6 rounded-full", isAnimated && "animate-pulse-glow")} 
              style={{ backgroundColor: eyeColor }}
            ></div>
          </div>
        );
      default:
        return (
          <div className="absolute top-1/4 left-0 right-0 flex justify-center gap-8">
            <div 
              className={cn("w-8 h-8 rounded-full", isAnimated && "animate-pulse-glow")} 
              style={{ backgroundColor: eyeColor }}
            ></div>
            <div 
              className={cn("w-8 h-8 rounded-full", isAnimated && "animate-pulse-glow")} 
              style={{ backgroundColor: eyeColor }}
            ></div>
          </div>
        );
    }
  };

  // Mouth types
  const renderMouth = () => {
    switch (mouthType) {
      case 'smile':
        return (
          <div className="absolute bottom-1/4 left-0 right-0 flex justify-center">
            <div className={cn("w-16 h-8 border-2 border-robot-metal rounded-b-full", isSpeaking && "animate-robot-speak")}></div>
          </div>
        );
      case 'grid':
        return (
          <div className="absolute bottom-1/4 left-0 right-0 flex justify-center">
            <div className={cn("w-16 h-8 bg-robot-dark border-2 border-robot-metal rounded-sm grid grid-cols-3 grid-rows-2", isSpeaking && "animate-robot-speak")}>
              {[...Array(6)].map((_, i) => (
                <div key={i} className="border border-robot-metal"></div>
              ))}
            </div>
          </div>
        );
      case 'line':
        return (
          <div className="absolute bottom-1/4 left-0 right-0 flex justify-center">
            <div className={cn("w-16 h-2 bg-robot-metal rounded-full", isSpeaking && "animate-robot-speak")}></div>
          </div>
        );
      default:
        return (
          <div className="absolute bottom-1/4 left-0 right-0 flex justify-center">
            <div className={cn("w-16 h-8 border-2 border-robot-metal rounded-b-full", isSpeaking && "animate-robot-speak")}></div>
          </div>
        );
    }
  };

  // Antenna types
  const renderAntenna = () => {
    switch (antennaType) {
      case 'single':
        return (
          <div className="absolute -top-10 left-0 right-0 flex justify-center">
            <div className="w-2 h-12 bg-robot-metal rounded-full">
              <div className="w-4 h-4 rounded-full bg-robot-red animate-pulse-glow absolute -top-2 left-1/2 -translate-x-1/2"></div>
            </div>
          </div>
        );
      case 'double':
        return (
          <div className="absolute -top-8 left-0 right-0 flex justify-center gap-12">
            <div className="w-2 h-10 bg-robot-metal rounded-full -rotate-12">
              <div className="w-3 h-3 rounded-full bg-robot-yellow animate-pulse-glow absolute -top-2 left-1/2 -translate-x-1/2"></div>
            </div>
            <div className="w-2 h-10 bg-robot-metal rounded-full rotate-12">
              <div className="w-3 h-3 rounded-full bg-robot-green animate-pulse-glow absolute -top-2 left-1/2 -translate-x-1/2"></div>
            </div>
          </div>
        );
      case 'satellite':
        return (
          <div className="absolute -top-10 left-0 right-0 flex justify-center">
            <div className="w-2 h-12 bg-robot-metal rounded-full">
              <div className="w-8 h-8 rounded-full border-2 border-robot-metal absolute -top-4 left-1/2 -translate-x-1/2 flex items-center justify-center">
                <div className="w-4 h-4 bg-robot-blue rounded-full animate-pulse-glow"></div>
              </div>
            </div>
          </div>
        );
      case 'none':
        return null;
      default:
        return (
          <div className="absolute -top-10 left-0 right-0 flex justify-center">
            <div className="w-2 h-12 bg-robot-metal rounded-full">
              <div className="w-4 h-4 rounded-full bg-robot-red animate-pulse-glow absolute -top-2 left-1/2 -translate-x-1/2"></div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="relative">
      {renderHead()}
      {renderEyes()}
      {renderMouth()}
      {renderAntenna()}
    </div>
  );
};

export default RobotHead;
