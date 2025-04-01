
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
      case 'plated':
        return {
          backgroundImage: `
            linear-gradient(90deg, transparent 50%, ${adjustColor(headColor, -30)} 50%),
            linear-gradient(90deg, ${adjustColor(headColor, 20)} 50%, transparent 50%)
          `,
          backgroundSize: '20px 100%, 20px 100%',
          backgroundPosition: '0 0, 10px 0',
          backgroundColor: headColor
        };
      case 'armored':
        return {
          backgroundImage: `
            repeating-linear-gradient(45deg, ${headColor} 0px, ${headColor} 10px, ${adjustColor(headColor, -20)} 10px, ${adjustColor(headColor, -20)} 11px),
            repeating-linear-gradient(-45deg, ${headColor} 0px, ${headColor} 10px, ${adjustColor(headColor, -20)} 10px, ${adjustColor(headColor, -20)} 11px)
          `,
          backgroundColor: headColor
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

  // Head shapes with enhanced 3D effect and mechanical details
  const renderHead = () => {
    const baseHeadStyle = {
      ...getTextureStyle(),
      boxShadow: `0 4px 12px rgba(0, 0, 0, 0.5), inset 0 -3px 8px ${adjustColor(headColor, -40)}, inset 0 3px 8px ${adjustColor(headColor, 40)}`,
    };

    // Common element for panel lines and details
    const renderPanelLines = (className: string) => (
      <div className={className}>
        <div className="absolute top-1/4 left-0 w-full h-px bg-black/20"></div>
        <div className="absolute top-3/4 left-0 w-full h-px bg-black/20"></div>
        <div className="absolute top-0 left-1/4 w-px h-full bg-black/20"></div>
        <div className="absolute top-0 right-1/4 w-px h-full bg-black/20"></div>
        <div className="absolute top-1/3 left-0 w-6 h-4 border border-robot-metal/50 rounded-sm"></div>
        <div className="absolute top-1/3 right-0 w-6 h-4 border border-robot-metal/50 rounded-sm"></div>
        <div className="absolute top-2/3 left-8 w-4 h-4 border-2 border-robot-metal/30 rounded-full"></div>
        <div className="absolute top-2/3 right-8 w-4 h-4 border-2 border-robot-metal/30 rounded-full"></div>
      </div>
    );

    switch (headType) {
      case 'square':
        return (
          <div className="relative">
            <div 
              className={cn("w-48 h-56 rounded-lg relative", isAnimated && "animate-float")}
              style={baseHeadStyle}
            >
              <div className="absolute inset-0 rounded-lg overflow-hidden bg-gradient-to-b from-transparent via-black/5 to-black/20"></div>
              <div className="absolute inset-0 rounded-lg border-2 border-robot-metal/30"></div>
              <div className="absolute inset-0 rounded-lg flex items-center justify-center overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-r from-robot-metal/40 via-transparent to-robot-metal/40"></div>
                <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-r from-robot-metal/40 via-transparent to-robot-metal/40"></div>
              </div>
              {renderPanelLines("absolute inset-0")}
            </div>
            <div className="absolute -left-2 top-1/3 bottom-1/3 w-2 bg-robot-metal rounded-l-lg border-t-2 border-b-2 border-l-2 border-robot-metal/50"></div>
            <div className="absolute -right-2 top-1/3 bottom-1/3 w-2 bg-robot-metal rounded-r-lg border-t-2 border-b-2 border-r-2 border-robot-metal/50"></div>
          </div>
        );
      case 'round':
        return (
          <div className="relative">
            <div 
              className={cn("w-48 h-56 rounded-full relative", isAnimated && "animate-float")}
              style={baseHeadStyle}
            >
              <div className="absolute inset-0 rounded-full overflow-hidden bg-gradient-to-b from-transparent via-black/5 to-black/20"></div>
              <div className="absolute inset-0 rounded-full border-2 border-robot-metal/30"></div>
              <div className="absolute top-4 left-1/4 right-1/4 h-2 bg-robot-metal/40 rounded-full"></div>
              <div className="absolute bottom-4 left-1/4 right-1/4 h-2 bg-robot-metal/40 rounded-full"></div>
              <div className="absolute top-1/3 left-3 w-6 h-2 bg-robot-metal/40 rounded-full"></div>
              <div className="absolute top-1/3 right-3 w-6 h-2 bg-robot-metal/40 rounded-full"></div>
              <div className="absolute bottom-1/3 left-3 w-6 h-2 bg-robot-metal/40 rounded-full"></div>
              <div className="absolute bottom-1/3 right-3 w-6 h-2 bg-robot-metal/40 rounded-full"></div>
            </div>
            <div className="absolute -left-1 top-1/3 bottom-1/3 w-3 bg-robot-metal rounded-l-lg">
              <div className="absolute top-0 bottom-0 right-0 w-1 bg-robot-metal/30"></div>
            </div>
            <div className="absolute -right-1 top-1/3 bottom-1/3 w-3 bg-robot-metal rounded-r-lg">
              <div className="absolute top-0 bottom-0 left-0 w-1 bg-robot-metal/30"></div>
            </div>
          </div>
        );
      case 'hex':
        return (
          <div className="relative">
            <div 
              className={cn("w-48 h-56 relative", isAnimated && "animate-float")}
              style={{ 
                ...baseHeadStyle,
                clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)'
              }}
            >
              <div className="absolute inset-0 overflow-hidden bg-gradient-to-b from-transparent via-black/5 to-black/20"
                   style={{ clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)' }}></div>
              <div className="absolute inset-2 flex items-center justify-center"
                   style={{ clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)' }}>
                <div className="absolute inset-4 border border-robot-metal/30"
                     style={{ clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)' }}></div>
              </div>
              {renderPanelLines("absolute inset-0")}
            </div>
            <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-10 bg-robot-metal rounded-l-lg flex items-center">
              <div className="w-2 h-6 border-t border-b border-l border-robot-metal/40 rounded-l-sm"></div>
            </div>
            <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-10 bg-robot-metal rounded-r-lg flex items-center justify-end">
              <div className="w-2 h-6 border-t border-b border-r border-robot-metal/40 rounded-r-sm"></div>
            </div>
          </div>
        );
      case 'triangular':
        return (
          <div className="relative">
            <div 
              className={cn("w-48 h-56 relative", isAnimated && "animate-float")}
              style={{ 
                ...baseHeadStyle,
                clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)'
              }}
            >
              <div className="absolute inset-0 overflow-hidden bg-gradient-to-b from-transparent via-black/5 to-black/20"
                   style={{ clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)' }}></div>
              <div className="absolute inset-4 border-2 border-robot-metal/30"
                   style={{ clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)' }}></div>
              <div className="absolute top-[40%] left-[20%] right-[20%] h-px bg-robot-metal/40"></div>
              <div className="absolute top-[70%] left-[10%] right-[10%] h-px bg-robot-metal/40"></div>
              <div className="absolute bottom-6 left-1/2 w-10 h-6 -translate-x-1/2 bg-robot-metal/20 border border-robot-metal/30 rounded-sm"></div>
            </div>
            <div className="absolute left-1/2 -translate-x-1/2 bottom-2 w-16 h-4 bg-robot-metal rounded-lg flex justify-center items-center">
              <div className="w-10 h-2 bg-black/20 rounded-full"></div>
            </div>
          </div>
        );
      case 'octagon':
        return (
          <div className="relative">
            <div 
              className={cn("w-48 h-56 relative", isAnimated && "animate-float")}
              style={{ 
                ...baseHeadStyle,
                clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)'
              }}
            >
              <div className="absolute inset-0 overflow-hidden bg-gradient-to-b from-transparent via-black/5 to-black/20"
                   style={{ clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)' }}></div>
              <div className="absolute inset-4 border-2 border-robot-metal/30"
                   style={{ clipPath: 'polygon(32% 2%, 68% 2%, 98% 32%, 98% 68%, 68% 98%, 32% 98%, 2% 68%, 2% 32%)' }}></div>
              {renderPanelLines("absolute inset-0")}
            </div>
            <div className="absolute -left-2 top-1/3 bottom-1/3 w-4 bg-robot-metal flex items-center justify-start">
              <div className="h-10 w-2 ml-0.5 rounded-l-sm bg-black/10"></div>
            </div>
            <div className="absolute -right-2 top-1/3 bottom-1/3 w-4 bg-robot-metal flex items-center justify-end">
              <div className="h-10 w-2 mr-0.5 rounded-r-sm bg-black/10"></div>
            </div>
          </div>
        );
      case 'transformer':
        // Inspired by the Bumblebee Transformer image
        return (
          <div className="relative">
            <div 
              className={cn("w-48 h-56 relative", isAnimated && "animate-float")}
              style={baseHeadStyle}
            >
              {/* Main head shape */}
              <div className="absolute inset-0 rounded-t-2xl rounded-b-lg overflow-hidden bg-gradient-to-b from-transparent via-black/5 to-black/20">
                {/* Center ridge */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-full bg-robot-metal/20 border-l border-r border-robot-metal/40"></div>
                
                {/* Side panels */}
                <div className="absolute top-4 left-3 bottom-8 w-10 bg-robot-metal/10 border border-robot-metal/30 rounded-md transform -rotate-2"></div>
                <div className="absolute top-4 right-3 bottom-8 w-10 bg-robot-metal/10 border border-robot-metal/30 rounded-md transform rotate-2"></div>

                {/* Detail lines */}
                <div className="absolute top-1/3 left-0 right-0 h-px bg-robot-metal/40"></div>
                <div className="absolute top-2/3 left-0 right-0 h-px bg-robot-metal/40"></div>
                
                {/* Bottom grille section */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-20 h-8 bg-robot-metal/20 rounded-md border border-robot-metal/40 flex items-center justify-evenly">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-1.5 h-4 bg-black/20 rounded-sm"></div>
                  ))}
                </div>
              </div>
              
              {/* Head crest */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-16 h-4 rounded-t-md bg-robot-metal/80 border-t-2 border-l-2 border-r-2 border-robot-metal/40"></div>
              
              {/* Side ear-like pieces */}
              <div className="absolute -left-4 top-10 w-4 h-12 rounded-l-lg bg-robot-metal flex items-center justify-start">
                <div className="w-2 h-8 rounded-l-sm bg-black/10"></div>
              </div>
              <div className="absolute -right-4 top-10 w-4 h-12 rounded-r-lg bg-robot-metal flex items-center justify-end">
                <div className="w-2 h-8 rounded-r-sm bg-black/10"></div>
              </div>
              
              {/* Cheek pieces */}
              <div className="absolute bottom-10 -left-2 w-6 h-8 rounded-l-md bg-robot-metal/80 border-l border-t border-b border-robot-metal/40"></div>
              <div className="absolute bottom-10 -right-2 w-6 h-8 rounded-r-md bg-robot-metal/80 border-r border-t border-b border-robot-metal/40"></div>
            </div>
          </div>
        );
      case 'mecha':
        return (
          <div className="relative">
            <div 
              className={cn("w-48 h-56 rounded-lg relative", isAnimated && "animate-float")}
              style={baseHeadStyle}
            >
              {/* Central v-fin */}
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-20 h-6">
                <div className="absolute left-0 top-0 w-10 h-6 bg-robot-metal transform rotate-12 origin-bottom-left"></div>
                <div className="absolute right-0 top-0 w-10 h-6 bg-robot-metal transform -rotate-12 origin-bottom-right"></div>
              </div>
              
              {/* Face plate cutout */}
              <div className="absolute top-12 left-1/2 -translate-x-1/2 w-36 h-32 bg-black/10 rounded-lg border border-robot-metal/50"></div>
              
              {/* Vents */}
              <div className="absolute top-1/4 -left-4 w-4 h-16 bg-robot-metal/80 rounded-l-md flex flex-col justify-evenly items-center">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-2 h-1.5 bg-black/30 rounded-sm"></div>
                ))}
              </div>
              <div className="absolute top-1/4 -right-4 w-4 h-16 bg-robot-metal/80 rounded-r-md flex flex-col justify-evenly items-center">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-2 h-1.5 bg-black/30 rounded-sm"></div>
                ))}
              </div>
              
              {/* Forehead detail */}
              <div className="absolute top-8 left-1/2 -translate-x-1/2 w-20 h-3 bg-robot-metal/50 rounded-md"></div>
              
              {/* Chin guard */}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-20 h-6 bg-robot-metal/80 rounded-b-md border-b-2 border-l-2 border-r-2 border-robot-metal/40"></div>
              
              {renderPanelLines("absolute inset-0")}
            </div>
          </div>
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

  // Enhanced Eye types with more depth and mechanical details
  const renderEyes = () => {
    const baseEyeStyle = {
      backgroundColor: eyeColor,
      boxShadow: `0 0 10px ${eyeColor}, 0 0 20px ${eyeColor}`,
    };
    const eyeGlassStyle = {
      boxShadow: `inset 0 0 10px rgba(0,0,0,0.4), 0 0 5px ${eyeColor}`,
      background: `radial-gradient(circle at 40% 40%, ${eyeColor} 0%, ${adjustColor(eyeColor, -40)} 90%)`,
    };

    switch (eyeType) {
      case 'round':
        return (
          <div className="absolute top-1/4 left-0 right-0 flex justify-center gap-8">
            <div className="relative">
              <div className="absolute inset-0 rounded-full border-2 border-robot-metal/70"></div>
              <div 
                className={cn("w-8 h-8 rounded-full", isAnimated && "animate-pulse-glow")} 
                style={eyeGlassStyle}
              >
                <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/60 rounded-full"></div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 rounded-full border-2 border-robot-metal/70"></div>
              <div 
                className={cn("w-8 h-8 rounded-full", isAnimated && "animate-pulse-glow")} 
                style={eyeGlassStyle}
              >
                <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/60 rounded-full"></div>
              </div>
            </div>
          </div>
        );
      case 'square':
        return (
          <div className="absolute top-1/4 left-0 right-0 flex justify-center gap-8">
            <div className="relative">
              <div className="absolute inset-0 rounded-sm border-2 border-robot-metal/70"></div>
              <div 
                className={cn("w-8 h-8 rounded-sm", isAnimated && "animate-pulse-glow")} 
                style={eyeGlassStyle}
              >
                <div className="grid grid-cols-2 grid-rows-2 gap-px h-full w-full p-1">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-black/10 rounded-sm"></div>
                  ))}
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 rounded-sm border-2 border-robot-metal/70"></div>
              <div 
                className={cn("w-8 h-8 rounded-sm", isAnimated && "animate-pulse-glow")} 
                style={eyeGlassStyle}
              >
                <div className="grid grid-cols-2 grid-rows-2 gap-px h-full w-full p-1">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-black/10 rounded-sm"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      case 'visor':
        return (
          <div className="absolute top-1/4 left-0 right-0 flex justify-center">
            <div className="relative">
              <div className="absolute -inset-1 rounded-full border-2 border-robot-metal/70"></div>
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-robot-metal/30"></div>
              <div 
                className={cn("w-32 h-6 rounded-full overflow-hidden", isAnimated && "animate-pulse-glow")} 
                style={{
                  background: `linear-gradient(to bottom, ${eyeColor} 0%, ${adjustColor(eyeColor, -40)} 100%)`,
                  boxShadow: `0 0 15px ${eyeColor}, inset 0 0 5px rgba(0,0,0,0.5)`
                }}
              >
                <div className="absolute inset-0 flex justify-center items-center">
                  <div className="w-full h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'scanner':
        return (
          <div className="absolute top-1/4 left-0 right-0 flex justify-center">
            <div className="relative">
              <div className="absolute -inset-1 rounded-lg border-2 border-robot-metal/70"></div>
              <div 
                className={cn("w-28 h-6 rounded-lg overflow-hidden", isAnimated && "animate-pulse-glow")}
                style={{ 
                  backgroundColor: '#111', 
                  padding: '2px',
                  boxShadow: `inset 0 0 5px rgba(0,0,0,0.8), 0 0 10px ${eyeColor}`
                }}
              >
                <div className="absolute inset-0.5 border border-robot-metal/30 rounded-md"></div>
                <div
                  className="h-full w-6 rounded-md animate-scanning-eye"
                  style={{
                    background: `linear-gradient(to right, transparent 0%, ${eyeColor} 30%, ${eyeColor} 70%, transparent 100%)`,
                    boxShadow: `0 0 10px ${eyeColor}`
                  }}
                ></div>
              </div>
            </div>
          </div>
        );
      case 'alien':
        return (
          <div className="absolute top-1/4 left-0 right-0 flex justify-center gap-10">
            <div className="relative">
              <div className="absolute inset-0 rounded-full border-2 border-robot-metal/70 transform rotate-45"></div>
              <div 
                className={cn("w-6 h-10 rounded-full transform rotate-45", isAnimated && "animate-pulse-glow")} 
                style={{
                  background: `radial-gradient(ellipse at center, ${eyeColor} 0%, ${adjustColor(eyeColor, -60)} 90%)`,
                  boxShadow: `0 0 15px ${eyeColor}, inset 0 0 8px rgba(0,0,0,0.8)`
                }}
              >
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-1 h-4 bg-black rounded-full"></div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 rounded-full border-2 border-robot-metal/70 transform -rotate-45"></div>
              <div 
                className={cn("w-6 h-10 rounded-full transform -rotate-45", isAnimated && "animate-pulse-glow")} 
                style={{
                  background: `radial-gradient(ellipse at center, ${eyeColor} 0%, ${adjustColor(eyeColor, -60)} 90%)`,
                  boxShadow: `0 0 15px ${eyeColor}, inset 0 0 8px rgba(0,0,0,0.8)`
                }}
              >
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-1 h-4 bg-black rounded-full"></div>
              </div>
            </div>
          </div>
        );
      case 'optical':
        return (
          <div className="absolute top-1/4 left-0 right-0 flex justify-center gap-8">
            <div className="relative">
              <div className="absolute -inset-1 rounded-full border-2 border-robot-metal"></div>
              <div className="absolute -inset-2 rounded-full border border-robot-metal/40"></div>
              <div 
                className={cn("w-8 h-8 rounded-full relative", isAnimated && "animate-pulse-glow")} 
                style={{
                  background: `conic-gradient(from 0deg, ${adjustColor(eyeColor, -40)}, ${eyeColor}, ${adjustColor(eyeColor, -40)})`,
                  boxShadow: `0 0 15px ${eyeColor}`
                }}
              >
                <div className="absolute inset-2 rounded-full bg-black"></div>
                <div className="absolute inset-3 rounded-full bg-gradient-to-br from-white/10 to-white/30"></div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-1 rounded-full border-2 border-robot-metal"></div>
              <div className="absolute -inset-2 rounded-full border border-robot-metal/40"></div>
              <div 
                className={cn("w-8 h-8 rounded-full relative", isAnimated && "animate-pulse-glow")} 
                style={{
                  background: `conic-gradient(from 0deg, ${adjustColor(eyeColor, -40)}, ${eyeColor}, ${adjustColor(eyeColor, -40)})`,
                  boxShadow: `0 0 15px ${eyeColor}`
                }}
              >
                <div className="absolute inset-2 rounded-full bg-black"></div>
                <div className="absolute inset-3 rounded-full bg-gradient-to-br from-white/10 to-white/30"></div>
              </div>
            </div>
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

  // Enhanced Mouth types with mechanical details
  const renderMouth = () => {
    const animationClass = getMouthAnimationClass();
    
    switch (mouthType) {
      case 'smile':
        return (
          <div className="absolute bottom-1/4 left-0 right-0 flex justify-center">
            <div className="relative">
              <div className="absolute -inset-1 border-2 border-robot-metal/70 rounded-b-full"></div>
              <div className={cn("w-16 h-8 border-2 border-robot-metal rounded-b-full overflow-hidden", animationClass)}>
                <div className="absolute bottom-0 left-0 right-0 h-3 bg-gradient-to-r from-black/20 via-transparent to-black/20"></div>
              </div>
            </div>
          </div>
        );
      case 'grid':
        return (
          <div className="absolute bottom-1/4 left-0 right-0 flex justify-center">
            <div className="relative">
              <div className="absolute -inset-1 border-2 border-robot-metal/70 rounded-sm"></div>
              <div className={cn("w-16 h-8 bg-robot-dark border-2 border-robot-metal rounded-sm grid grid-cols-3 grid-rows-2 p-0.5 gap-0.5", animationClass)}>
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="border border-robot-metal bg-black/20"></div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'line':
        return (
          <div className="absolute bottom-1/4 left-0 right-0 flex justify-center">
            <div className="relative">
              <div className="absolute top-1/2 left-0 right-0 h-6 -translate-y-1/2 border-t-2 border-b-2 border-robot-metal/40"></div>
              <div className={cn("w-20 h-2 bg-robot-metal rounded-full relative z-10", animationClass)}>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
              </div>
            </div>
          </div>
        );
      case 'speaker':
        return (
          <div className="absolute bottom-1/4 left-0 right-0 flex justify-center">
            <div className="relative">
              <div className="absolute -inset-1 rounded-md border-2 border-robot-metal/70"></div>
              <div className={cn("w-20 h-10 rounded-md bg-robot-dark/90 border-2 border-robot-metal overflow-hidden", animationClass)}>
                <div className="absolute inset-0.5 border border-robot-metal/30 rounded-sm bg-gradient-to-b from-transparent to-black/20"></div>
                <div className="flex flex-col items-center justify-center h-full">
                  {[...Array(5)].map((_, i) => (
                    <div 
                      key={i} 
                      className={cn(
                        "h-1 bg-robot-metal my-0.5 mx-auto",
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
            </div>
          </div>
        );
      case 'vent':
        return (
          <div className="absolute bottom-1/4 left-0 right-0 flex justify-center">
            <div className="relative">
              <div className="absolute -inset-1 rounded-sm border-2 border-robot-metal/70"></div>
              <div className={cn("w-24 h-6 bg-robot-dark/90 border-2 border-robot-metal flex items-center justify-evenly rounded-sm", animationClass)}>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20"></div>
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="w-1 h-4 bg-robot-metal rounded-sm relative z-10">
                    <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'mask':
        return (
          <div className="absolute bottom-1/4 left-0 right-0 flex justify-center">
            <div className="relative">
              <div className="absolute -inset-1 rounded-md border-2 border-robot-metal/70"></div>
              <div className={cn("w-24 h-10 bg-robot-metal/80 rounded-md overflow-hidden", animationClass)}>
                <div className="absolute inset-0 border border-robot-metal"></div>
                <div className="absolute top-1 left-1 right-1 h-2 bg-robot-dark/60 rounded-sm"></div>
                <div className="absolute bottom-1 left-3 right-3 h-6 flex justify-evenly items-center">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="w-2 h-4 bg-robot-dark border border-robot-metal/50 rounded-sm"></div>
                  ))}
                </div>
              </div>
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

  // Enhanced Antenna types with more mechanical details
  const renderAntenna = () => {
    switch (antennaType) {
      case 'single':
        return (
          <div className="absolute -top-10 left-0 right-0 flex justify-center">
            <div className="w-2 h-12 bg-robot-metal rounded-full relative">
              <div className="absolute top-1/3 left-0 right-0 h-1 bg-black/20"></div>
              <div className="absolute top-2/3 left-0 right-0 h-1 bg-black/20"></div>
              <div className="w-4 h-4 rounded-full bg-robot-red animate-pulse-glow absolute -top-2 left-1/2 -translate-x-1/2 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-white/30"></div>
              </div>
            </div>
          </div>
        );
      case 'double':
        return (
          <div className="absolute -top-8 left-0 right-0 flex justify-center gap-12">
            <div className="w-2 h-10 bg-robot-metal rounded-full -rotate-12 relative">
              <div className="absolute top-0 bottom-0 left-1/2 w-px bg-black/20 -translate-x-1/2"></div>
              <div className="w-3 h-3 rounded-full bg-robot-yellow animate-pulse-glow absolute -top-2 left-1/2 -translate-x-1/2 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-white/30"></div>
              </div>
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-2 bg-robot-metal/60 rounded-full"></div>
            </div>
            <div className="w-2 h-10 bg-robot-metal rounded-full rotate-12 relative">
              <div className="absolute top-0 bottom-0 left-1/2 w-px bg-black/20 -translate-x-1/2"></div>
              <div className="w-3 h-3 rounded-full bg-robot-green animate-pulse-glow absolute -top-2 left-1/2 -translate-x-1/2 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-white/30"></div>
              </div>
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-2 bg-robot-metal/60 rounded-full"></div>
            </div>
          </div>
        );
      case 'satellite':
        return (
          <div className="absolute -top-10 left-0 right-0 flex justify-center">
            <div className="w-2 h-12 bg-robot-metal rounded-full relative">
              <div className="absolute top-0 bottom-0 left-1/2 w-px bg-black/20 -translate-x-1/2"></div>
              <div className="absolute top-1/3 left-0 right-0 h-1 bg-black/20"></div>
              <div className="absolute top-2/3 left-0 right-0 h-1 bg-black/20"></div>
              <div className="w-8 h-8 rounded-full border-2 border-robot-metal absolute -top-4 left-1/2 -translate-x-1/2 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 border border-robot-metal/30"></div>
                <div className="w-4 h-4 bg-robot-blue rounded-full animate-pulse-glow relative">
                  <div className="absolute top-1/2 left-0 right-0 h-px bg-black/20"></div>
                  <div className="absolute left-1/2 top-0 bottom-0 w-px bg-black/20"></div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'radar':
        return (
          <div className="absolute -top-12 left-0 right-0 flex justify-center">
            <div className="w-2 h-8 bg-robot-metal rounded-full relative">
              <div className="absolute top-0 bottom-0 left-1/2 w-px bg-black/20 -translate-x-1/2"></div>
              <div className="w-10 h-10 absolute -top-5 left-1/2 -translate-x-1/2">
                <div className="w-10 h-5 border-2 border-robot-metal border-b-0 rounded-t-full absolute top-0 overflow-hidden">
                  <div className="absolute inset-0 border-b border-robot-metal/30 rounded-t-full"></div>
                </div>
                <div className="w-8 h-1 bg-robot-red absolute top-2 left-1 animate-radar-scan origin-bottom flex items-center">
                  <div className="w-2 h-2 bg-white/40 rounded-full ml-auto mr-0.5"></div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'combat':
        return (
          <div className="absolute -top-10 left-0 right-0 flex justify-center">
            <div className="relative w-24 h-6">
              <div className="absolute left-0 w-8 h-6 bg-robot-metal transform skew-x-12 rounded-l-md"></div>
              <div className="absolute right-0 w-8 h-6 bg-robot-metal transform -skew-x-12 rounded-r-md"></div>
              <div className="absolute left-1/2 -translate-x-1/2 top-0 w-4 h-4 bg-robot-red rounded-full animate-pulse-glow z-10"></div>
              <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 h-2 bg-robot-dark/60 z-10 flex items-center justify-evenly">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="w-1 h-1 bg-robot-red rounded-full"></div>
                ))}
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
