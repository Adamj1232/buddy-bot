
import React from 'react';
import { cn } from '@/lib/utils';

type RobotHeadProps = {
  headType: string;
  eyeType: string;
  mouthType: string;
  antennaType: string;
  headColor: string;
  eyeColor: string;
  headTexture?: string;
  mouthAnimation?: string;
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
  headTexture = 'smooth',
  mouthAnimation = 'standard',
  isAnimated = true,
  isSpeaking = false,
}) => {
  // Generate texture pattern based on headTexture
  const getTextureStyle = () => {
    switch (headTexture) {
      case 'metallic':
        return {
          backgroundImage: `linear-gradient(45deg, ${headColor} 25%, ${adjustColor(headColor, -15)} 25%, ${adjustColor(headColor, -15)} 50%, ${headColor} 50%, ${headColor} 75%, ${adjustColor(headColor, -15)} 75%, ${adjustColor(headColor, -15)} 100%)`,
          backgroundSize: '4px 4px'
        };
      case 'rusty':
        return {
          backgroundImage: `radial-gradient(circle at 30% 40%, ${adjustColor(headColor, -20)} 5%, transparent 5%), radial-gradient(circle at 70% 60%, ${adjustColor(headColor, -25)} 5%, transparent 5%), radial-gradient(circle at 50% 50%, ${adjustColor(headColor, -10)} 8%, transparent 8%)`,
          backgroundColor: headColor
        };
      case 'digital':
        return {
          backgroundImage: `linear-gradient(to right, ${adjustColor(headColor, 10)} 1px, transparent 1px), linear-gradient(to bottom, ${adjustColor(headColor, 10)} 1px, transparent 1px)`,
          backgroundSize: '8px 8px',
          backgroundColor: headColor
        };
      case 'holographic':
        return {
          backgroundImage: `linear-gradient(135deg, ${adjustColor(headColor, 30)} 0%, ${headColor} 25%, ${adjustColor(headColor, -20)} 50%, ${adjustColor(headColor, 20)} 75%, ${adjustColor(headColor, 40)} 100%)`,
          backgroundSize: '200% 200%',
          animation: 'holographic-shift 3s ease infinite'
        };
      default: // smooth
        return { backgroundColor: headColor };
    }
  };

  // Utility function to adjust color brightness
  const adjustColor = (color: string, amount: number) => {
    // Parse the hex color to RGB
    let r = parseInt(color.substring(1, 3), 16);
    let g = parseInt(color.substring(3, 5), 16);
    let b = parseInt(color.substring(5, 7), 16);

    // Adjust the brightness
    r = Math.max(0, Math.min(255, r + amount));
    g = Math.max(0, Math.min(255, g + amount));
    b = Math.max(0, Math.min(255, b + amount));

    // Convert back to hex
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  };

  // Get the animation class for the mouth based on the animation type
  const getMouthAnimationClass = () => {
    if (!isSpeaking) return '';
    
    switch (mouthAnimation) {
      case 'robotic':
        return 'animate-robot-speak-mechanical';
      case 'pulse':
        return 'animate-robot-speak-pulse';
      case 'wave':
        return 'animate-robot-speak-wave';
      case 'glitch':
        return 'animate-robot-speak-glitch';
      default: // standard
        return 'animate-robot-speak';
    }
  };

  // Head shapes with enhanced 3D effect
  const renderHead = () => {
    const baseHeadStyle = {
      ...getTextureStyle(),
      boxShadow: `0 4px 12px rgba(0, 0, 0, 0.5), inset 0 -3px 8px ${adjustColor(headColor, -40)}, inset 0 3px 8px ${adjustColor(headColor, 40)}`,
    };

    switch (headType) {
      case 'square':
        return (
          <div 
            className={cn("w-48 h-56 rounded-lg relative", isAnimated && "animate-float")}
            style={baseHeadStyle}
          ></div>
        );
      case 'round':
        return (
          <div 
            className={cn("w-48 h-56 rounded-full relative", isAnimated && "animate-float")}
            style={baseHeadStyle}
          ></div>
        );
      case 'hex':
        return (
          <div 
            className={cn("w-48 h-56 relative", isAnimated && "animate-float")}
            style={{ 
              ...baseHeadStyle,
              clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)'
            }}
          ></div>
        );
      case 'triangular':
        return (
          <div 
            className={cn("w-48 h-56 relative", isAnimated && "animate-float")}
            style={{ 
              ...baseHeadStyle,
              clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)'
            }}
          ></div>
        );
      case 'octagon':
        return (
          <div 
            className={cn("w-48 h-56 relative", isAnimated && "animate-float")}
            style={{ 
              ...baseHeadStyle,
              clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)'
            }}
          ></div>
        );
      default:
        return (
          <div 
            className={cn("w-48 h-56 rounded-lg relative", isAnimated && "animate-float")}
            style={baseHeadStyle}
          ></div>
        );
    }
  };

  // Eye types
  const renderEyes = () => {
    const baseEyeStyle = {
      backgroundColor: eyeColor,
      boxShadow: `0 0 10px ${eyeColor}, 0 0 20px ${eyeColor}`,
    };

    switch (eyeType) {
      case 'round':
        return (
          <div className="absolute top-1/4 left-0 right-0 flex justify-center gap-8">
            <div 
              className={cn("w-8 h-8 rounded-full", isAnimated && "animate-pulse-glow")} 
              style={baseEyeStyle}
            ></div>
            <div 
              className={cn("w-8 h-8 rounded-full", isAnimated && "animate-pulse-glow")} 
              style={baseEyeStyle}
            ></div>
          </div>
        );
      case 'square':
        return (
          <div className="absolute top-1/4 left-0 right-0 flex justify-center gap-8">
            <div 
              className={cn("w-8 h-8 rounded-sm", isAnimated && "animate-pulse-glow")} 
              style={baseEyeStyle}
            ></div>
            <div 
              className={cn("w-8 h-8 rounded-sm", isAnimated && "animate-pulse-glow")} 
              style={baseEyeStyle}
            ></div>
          </div>
        );
      case 'visor':
        return (
          <div className="absolute top-1/4 left-0 right-0 flex justify-center">
            <div 
              className={cn("w-32 h-6 rounded-full", isAnimated && "animate-pulse-glow")} 
              style={baseEyeStyle}
            ></div>
          </div>
        );
      case 'scanner':
        return (
          <div className="absolute top-1/4 left-0 right-0 flex justify-center">
            <div 
              className={cn("w-28 h-4 rounded-full overflow-hidden", isAnimated && "animate-pulse-glow")}
              style={{ backgroundColor: '#111', padding: '2px' }}
            >
              <div
                className="h-full w-4 rounded-full animate-scanning-eye"
                style={baseEyeStyle}
              ></div>
            </div>
          </div>
        );
      case 'alien':
        return (
          <div className="absolute top-1/4 left-0 right-0 flex justify-center gap-10">
            <div 
              className={cn("w-6 h-10 rounded-full transform rotate-45", isAnimated && "animate-pulse-glow")} 
              style={baseEyeStyle}
            ></div>
            <div 
              className={cn("w-6 h-10 rounded-full transform -rotate-45", isAnimated && "animate-pulse-glow")} 
              style={baseEyeStyle}
            ></div>
          </div>
        );
      default:
        return (
          <div className="absolute top-1/4 left-0 right-0 flex justify-center gap-8">
            <div 
              className={cn("w-8 h-8 rounded-full", isAnimated && "animate-pulse-glow")} 
              style={baseEyeStyle}
            ></div>
            <div 
              className={cn("w-8 h-8 rounded-full", isAnimated && "animate-pulse-glow")} 
              style={baseEyeStyle}
            ></div>
          </div>
        );
    }
  };

  // Mouth types
  const renderMouth = () => {
    const animationClass = getMouthAnimationClass();
    
    switch (mouthType) {
      case 'smile':
        return (
          <div className="absolute bottom-1/4 left-0 right-0 flex justify-center">
            <div className={cn("w-16 h-8 border-2 border-robot-metal rounded-b-full", animationClass)}></div>
          </div>
        );
      case 'grid':
        return (
          <div className="absolute bottom-1/4 left-0 right-0 flex justify-center">
            <div className={cn("w-16 h-8 bg-robot-dark border-2 border-robot-metal rounded-sm grid grid-cols-3 grid-rows-2", animationClass)}>
              {[...Array(6)].map((_, i) => (
                <div key={i} className="border border-robot-metal"></div>
              ))}
            </div>
          </div>
        );
      case 'line':
        return (
          <div className="absolute bottom-1/4 left-0 right-0 flex justify-center">
            <div className={cn("w-16 h-2 bg-robot-metal rounded-full", animationClass)}></div>
          </div>
        );
      case 'speaker':
        return (
          <div className="absolute bottom-1/4 left-0 right-0 flex justify-center">
            <div className={cn("w-20 h-10 rounded-md bg-robot-dark border-2 border-robot-metal overflow-hidden", animationClass)}>
              {[...Array(5)].map((_, i) => (
                <div 
                  key={i} 
                  className={cn(
                    "h-1 bg-robot-metal my-1 mx-auto",
                    isSpeaking ? "animate-sound-wave" : ""
                  )}
                  style={{ 
                    width: `${12 - i * 2}px`,
                    animationDelay: `${i * 0.1}s`
                  }}
                ></div>
              ))}
            </div>
          </div>
        );
      case 'vent':
        return (
          <div className="absolute bottom-1/4 left-0 right-0 flex justify-center">
            <div className={cn("w-24 h-6 bg-robot-dark border-2 border-robot-metal flex items-center justify-evenly rounded-sm", animationClass)}>
              {[...Array(6)].map((_, i) => (
                <div key={i} className="w-1 h-4 bg-robot-metal rounded-sm"></div>
              ))}
            </div>
          </div>
        );
      default:
        return (
          <div className="absolute bottom-1/4 left-0 right-0 flex justify-center">
            <div className={cn("w-16 h-8 border-2 border-robot-metal rounded-b-full", animationClass)}></div>
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
      case 'radar':
        return (
          <div className="absolute -top-12 left-0 right-0 flex justify-center">
            <div className="w-2 h-8 bg-robot-metal rounded-full">
              <div className="w-10 h-10 absolute -top-5 left-1/2 -translate-x-1/2">
                <div className="w-10 h-5 border-2 border-robot-metal border-b-0 rounded-t-full absolute top-0"></div>
                <div className="w-8 h-1 bg-robot-red absolute top-2 left-1 animate-radar-scan origin-bottom"></div>
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
