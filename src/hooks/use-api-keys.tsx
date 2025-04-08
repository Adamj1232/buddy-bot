import { useState, useEffect } from 'react';

// Defines structure for API keys
export interface ApiKeys {
  openai?: string;
  elevenlabs?: string;
  claude?: string;
  useDefaultServer?: boolean;
}

// Hook to manage API keys - stores them in localStorage
export function useApiKeys() {
  const [apiKeys, setApiKeys] = useState<ApiKeys>(() => {
    const savedKeys = localStorage.getItem('api-keys');
    return savedKeys ? JSON.parse(savedKeys) : { useDefaultServer: true };
  });

  const [isConfigured, setIsConfigured] = useState<boolean>(false);

  useEffect(() => {
    // Save to localStorage whenever keys change
    localStorage.setItem('api-keys', JSON.stringify(apiKeys));
    
    // Check if all required keys are present or if using default server
    setIsConfigured(
      apiKeys.useDefaultServer || 
      (!!apiKeys.openai && !!apiKeys.elevenlabs && !!apiKeys.claude)
    );
  }, [apiKeys]);

  // Update specific key
  const updateKey = (keyName: keyof ApiKeys, value: string | boolean) => {
    setApiKeys(prev => ({
      ...prev,
      [keyName]: value
    }));
  };

  // Toggle between default server and personal API keys
  const toggleDefaultServer = (useDefault: boolean) => {
    setApiKeys(prev => ({
      ...prev,
      useDefaultServer: useDefault
    }));
  };

  return {
    apiKeys,
    updateKey,
    toggleDefaultServer,
    isConfigured
  };
}
