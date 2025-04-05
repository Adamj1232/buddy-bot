
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RobotBuilder, { RobotConfig } from '@/components/RobotBuilder';
import RobotChat from '@/components/RobotChat';
import { Toaster } from '@/components/ui/toaster';
import { useIsMobile } from '@/hooks/use-mobile';
import { useApiKeys } from '@/hooks/use-api-keys';
import ApiKeyConfig from '@/components/ApiKeyConfig';
import websocketService from '@/services/websocketService';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [robotComplete, setRobotComplete] = useState(false);
  const [robotConfig, setRobotConfig] = useState<RobotConfig | null>(null);
  const [showApiConfig, setShowApiConfig] = useState(false);
  const { isConfigured, apiKeys } = useApiKeys();
  const [connectionStatus, setConnectionStatus] = useState(websocketService.getStatus());

  // Check if API keys are configured when user completes robot
  useEffect(() => {
    if (robotComplete && !isConfigured) {
      setShowApiConfig(true);
    }
  }, [robotComplete, isConfigured]);

  // Monitor WebSocket connection status
  useEffect(() => {
    const checkConnectionStatus = () => {
      setConnectionStatus(websocketService.getStatus());
    };
    
    // Check connection status every 2 seconds
    const interval = setInterval(checkConnectionStatus, 2000);
    
    // Connect to WebSocket if using default server
    if (apiKeys.useDefaultServer) {
      websocketService.connect().catch(console.error);
    }
    
    return () => {
      clearInterval(interval);
    };
  }, [apiKeys.useDefaultServer]);

  const handleRobotComplete = (config: RobotConfig) => {
    setRobotConfig(config);
    setRobotComplete(true);
  };

  const handleBackToBuilder = () => {
    setRobotComplete(false);
  };

  const handleLogout = () => {
    // Clear session storage
    sessionStorage.removeItem('isLoggedIn');
    // Redirect to login page
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen flex flex-col bg-robot-dark text-white relative">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="steampunk-cog w-64 h-64 top-0 left-0 opacity-5 absolute animate-radar-scan-slow"></div>
        <div className="steampunk-cog w-48 h-48 bottom-0 right-0 opacity-5 absolute animate-radar-scan-reverse-slow"></div>
      </div>
      
      {!robotComplete && (
        <header className="p-2 sm:p-4 bg-robot-dark border-b-2 border-robot-metal relative">
          <div className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 bg-robot-blue rounded-full glow animate-pulse"></div>
          <div className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 bg-robot-purple rounded-full glow animate-pulse"></div>
          
          <div className="flex justify-between items-center">
            <div className="w-10">
              {/* Empty div for layout balance */}
            </div>
            
            <h1 className={`${isMobile ? 'text-xl' : 'text-3xl'} font-bold text-center steampunk-title relative inline-block mx-auto`}>
              Robo-Builder Communicator
            </h1>
            
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleLogout}
              className="w-10 h-10 rounded-full bg-robot-dark border border-robot-metal/50 hover:bg-robot-metal/20"
              title="Logout"
            >
              <LogOut className="h-5 w-5 text-robot-light" />
            </Button>
          </div>
        </header>
      )}
      
      {apiKeys.useDefaultServer && (
        <div 
          className={`connection-status ${connectionStatus}`}
          title={`Server connection: ${connectionStatus}`}
        ></div>
      )}
      
      <main className={`flex-grow ${robotComplete ? 'pt-2 sm:pt-4' : ''}`}>
        {robotComplete && robotConfig ? (
          <RobotChat 
            robotConfig={robotConfig} 
            onBackToBuilder={handleBackToBuilder}
          />
        ) : (
          <RobotBuilder onRobotComplete={handleRobotComplete} />
        )}
      </main>
      
      <footer className="p-2 sm:p-4 text-center text-robot-metal bg-robot-dark border-t-2 border-robot-metal relative">
        <div className="absolute left-4 top-0 w-16 h-px bg-gradient-to-r from-transparent via-robot-blue to-transparent"></div>
        <div className="absolute right-4 top-0 w-16 h-px bg-gradient-to-r from-robot-blue via-transparent to-transparent"></div>
        
        <p className="relative">
          <span className="inline-block px-2 sm:px-4 py-1 rounded bg-robot-dark border border-robot-metal text-robot-metal steampunk-panel text-xs sm:text-sm">
            Educational Robot Builder - For young learners ages 7-12
          </span>
        </p>
      </footer>

      <Toaster />
      <ApiKeyConfig open={showApiConfig} onOpenChange={setShowApiConfig} />
    </div>
  );
};

export default Index;
