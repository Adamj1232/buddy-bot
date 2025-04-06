import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RobotBuilder, { RobotConfig } from "@/components/RobotBuilder";
import RobotChat from "@/components/RobotChat";
import { Toaster } from "@/components/ui/toaster";
import { useIsMobile } from "@/hooks/use-mobile";
import { useApiKeys } from "@/hooks/use-api-keys";
import ApiKeyConfig from "@/components/ApiKeyConfig";
import buddyBotWebSocketService, {
  WebSocketStatus,
} from "@/services/buddyBotWebSocketService";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [robotComplete, setRobotComplete] = useState(false);
  const [robotConfig, setRobotConfig] = useState<RobotConfig | null>(null);
  const [showApiConfig, setShowApiConfig] = useState(false);
  const { isConfigured, apiKeys } = useApiKeys();
  const [connectionStatus, setConnectionStatus] = useState<WebSocketStatus>(
    buddyBotWebSocketService.getStatus()
  );
  const { logout } = useAuth();

  // Check if API keys are configured when user completes robot
  useEffect(() => {
    if (robotComplete && !isConfigured) {
      setShowApiConfig(true);
    }
  }, [robotComplete, isConfigured]);

  // Monitor WebSocket connection status
  useEffect(() => {
    const checkConnectionStatus = () => {
      setConnectionStatus(buddyBotWebSocketService.getStatus());
    };

    // Check connection status every 2 seconds
    const interval = setInterval(checkConnectionStatus, 2000);

    // Set up a listener for connection status changes
    buddyBotWebSocketService.onStatusChange((status) => {
      setConnectionStatus(status);
    });

    // Connect to WebSocket if using default server
    if (apiKeys.useDefaultServer || isConfigured) {
      console.log("Attempting to connect to WebSocket server...");
      buddyBotWebSocketService.connect().catch((err) => {
        console.error("Failed to connect to WebSocket server:", err);
      });
    }

    return () => {
      clearInterval(interval);
    };
  }, [apiKeys.useDefaultServer, isConfigured]);

  // Add an effect to log when Index component mounts
  useEffect(() => {
    console.log("Index component mounted");
    return () => {
      console.log("Index component unmounted");
    };
  }, []);

  const handleRobotComplete = (config: RobotConfig) => {
    setRobotConfig(config);
    setRobotComplete(true);
  };

  const handleBackToBuilder = () => {
    setRobotComplete(false);
  };

  const handleLogout = () => {
    console.log("Logout button clicked");
    logout();
    navigate("/login", { replace: true });
  };

  // Function to get color class based on connection status
  const getStatusColor = (status: WebSocketStatus) => {
    switch (status) {
      case "connected":
        return "bg-yellow-400";
      case "authenticated":
        return "bg-green-400";
      case "connecting":
        return "bg-blue-400 animate-pulse";
      case "error":
        return "bg-red-500";
      case "disconnected":
      default:
        return "bg-gray-400";
    }
  };

  // Function to get status title
  const getStatusTitle = (status: WebSocketStatus) => {
    switch (status) {
      case "connected":
        return "Connected (not authenticated)";
      case "authenticated":
        return "Connected and authenticated";
      case "connecting":
        return "Connecting...";
      case "error":
        return "Connection error";
      case "disconnected":
      default:
        return "Disconnected";
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-robot-dark text-white relative">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="steampunk-cog w-64 h-64 top-0 left-0 opacity-5 absolute animate-radar-scan-slow"></div>
        <div className="steampunk-cog w-48 h-48 bottom-0 right-0 opacity-5 absolute animate-radar-scan-reverse-slow"></div>
      </div>

      {/* {!robotComplete && (
        <header className="p-2 sm:p-4 bg-robot-dark border-b-2 border-robot-metal relative">
          <div className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 bg-robot-blue rounded-full glow animate-pulse"></div>
          <div className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 bg-robot-purple rounded-full glow animate-pulse"></div>
          
          <div className="flex justify-between items-center">
            <div className="w-10"> */}
      {/* Empty div for layout balance */}
      {/* </div>
            
            <h1 className={`${isMobile ? 'text-xl' : 'text-3xl'} font-bold text-center steampunk-title relative inline-block mx-auto`}>
              Buddy Bot
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
      )} */}

      <div
        className={`connection-status ${getStatusColor(connectionStatus)}`}
        title={getStatusTitle(connectionStatus)}
      ></div>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleLogout}
        className="w-10 h-10 absolute top-2 right-2 rounded-full bg-robot-dark border border-robot-metal/50 hover:bg-robot-metal/20"
        title="Logout"
      >
        <LogOut className="h-5 w-5 text-robot-light" />
      </Button>
      <main className={`flex-grow ${robotComplete ? "pt-2 sm:pt-4" : ""}`}>
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
