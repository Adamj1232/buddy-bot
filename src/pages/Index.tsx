
import React, { useState } from 'react';
import RobotBuilder, { RobotConfig } from '@/components/RobotBuilder';
import RobotChat from '@/components/RobotChat';
import { Toaster } from '@/components/ui/toaster';

const Index = () => {
  const [robotComplete, setRobotComplete] = useState(false);
  const [robotConfig, setRobotConfig] = useState<RobotConfig | null>(null);

  const handleRobotComplete = (config: RobotConfig) => {
    setRobotConfig(config);
    setRobotComplete(true);
  };

  const handleBackToBuilder = () => {
    setRobotComplete(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-robot-dark text-white">
      <header className="p-4 bg-robot-dark border-b border-robot-metal">
        <h1 className="text-3xl font-bold text-center text-robot-blue">Robo-Builder Communicator</h1>
      </header>
      
      <main className="flex-grow">
        {robotComplete && robotConfig ? (
          <RobotChat 
            robotConfig={robotConfig} 
            onBackToBuilder={handleBackToBuilder}
          />
        ) : (
          <RobotBuilder onRobotComplete={handleRobotComplete} />
        )}
      </main>
      
      <footer className="p-4 text-center text-robot-metal bg-robot-dark border-t border-robot-metal">
        <p>Educational Robot Builder - For young learners ages 7-12</p>
      </footer>

      <Toaster />
    </div>
  );
};

export default Index;
