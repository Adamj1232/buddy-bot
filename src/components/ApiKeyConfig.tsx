import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useApiKeys } from '@/hooks/use-api-keys';

interface ApiKeyConfigProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ApiKeyConfig: React.FC<ApiKeyConfigProps> = ({ open, onOpenChange }) => {
  const { apiKeys, updateKey } = useApiKeys();
  
  const [openaiKey, setOpenaiKey] = useState(apiKeys.openai || '');
  const [elevenlabsKey, setElevenlabsKey] = useState(apiKeys.elevenlabs || '');
  const [claudeKey, setClaudeKey] = useState(apiKeys.claude || '');
  const [useDefaultServer, setUseDefaultServer] = useState(apiKeys.useDefaultServer ?? true);

  // Update local state when apiKeys changes
  useEffect(() => {
    setOpenaiKey(apiKeys.openai || '');
    setElevenlabsKey(apiKeys.elevenlabs || '');
    setClaudeKey(apiKeys.claude || '');
    setUseDefaultServer(apiKeys.useDefaultServer ?? true);
  }, [apiKeys]);

  const saveKeys = () => {
    updateKey('openai', openaiKey);
    updateKey('elevenlabs', elevenlabsKey);
    updateKey('claude', claudeKey);
    updateKey('useDefaultServer', useDefaultServer);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-robot-dark text-white border-2 border-robot-metal steampunk-panel">
        <DialogHeader>
          <DialogTitle className="steampunk-title">API Keys Configuration</DialogTitle>
          <DialogDescription className="text-robot-metal">
            Configure how your robot communicates with AI services.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="useDefaultServer"
              checked={useDefaultServer}
              onCheckedChange={setUseDefaultServer}
            />
            <Label htmlFor="useDefaultServer" className="text-white">
              Use secure proxy server (recommended)
            </Label>
          </div>
          
          <div className="text-xs text-robot-metal mb-2">
            {useDefaultServer 
              ? "Using our secure proxy server to handle AI requests. Your usage is limited to the free tier."
              : "Using your personal API keys. You are responsible for any costs incurred."}
          </div>
          
          <div className={`grid gap-4 transition-opacity duration-300 ${useDefaultServer ? 'opacity-50' : 'opacity-100'}`}>
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
                disabled={useDefaultServer}
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
                disabled={useDefaultServer}
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="claude" className="text-right col-span-1">
                Anthropic (Claude)
              </Label>
              <Input
                id="claude"
                value={claudeKey}
                onChange={(e) => setClaudeKey(e.target.value)}
                placeholder="sk-ant-..."
                className="col-span-3 bg-robot-dark border-robot-metal text-white"
                disabled={useDefaultServer}
              />
            </div>
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
