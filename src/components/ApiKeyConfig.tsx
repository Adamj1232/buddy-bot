
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApiKeys } from '@/hooks/use-api-keys';

interface ApiKeyConfigProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ApiKeyConfig: React.FC<ApiKeyConfigProps> = ({ open, onOpenChange }) => {
  const { apiKeys, updateKey } = useApiKeys();
  
  const [openaiKey, setOpenaiKey] = useState(apiKeys.openai || '');
  const [elevenlabsKey, setElevenlabsKey] = useState(apiKeys.elevenlabs || '');

  const saveKeys = () => {
    updateKey('openai', openaiKey);
    updateKey('elevenlabs', elevenlabsKey);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-robot-dark text-white border-2 border-robot-metal steampunk-panel">
        <DialogHeader>
          <DialogTitle className="steampunk-title">API Keys Configuration</DialogTitle>
          <DialogDescription className="text-robot-metal">
            Enter your API keys to activate the robot's AI capabilities.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="openai" className="text-right col-span-1">
              OpenAI
            </Label>
            <Input
              id="openai"
              value={openaiKey}
              onChange={(e) => setOpenaiKey(e.target.value)}
              placeholder="sk-..."
              className="col-span-3 bg-robot-dark border-robot-metal text-white"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="elevenlabs" className="text-right col-span-1">
              ElevenLabs
            </Label>
            <Input
              id="elevenlabs"
              value={elevenlabsKey}
              onChange={(e) => setElevenlabsKey(e.target.value)}
              placeholder="xi-..."
              className="col-span-3 bg-robot-dark border-robot-metal text-white"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            onClick={saveKeys}
            className="border-robot-blue text-robot-blue hover:bg-robot-blue hover:text-white cyber-button"
          >
            Save Configuration
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ApiKeyConfig;
