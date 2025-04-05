
import { useState, useEffect } from 'react';

// Defines structure for API keys
export interface ApiKeys {
  openai?: string;
  elevenlabs?: string;
}

// Hook to manage API keys - stores them in localStorage
export function useApiKeys() {
  const [apiKeys, setApiKeys] = useState<ApiKeys>(() => {
    const savedKeys = localStorage.getItem('api-keys');
    return savedKeys ? JSON.parse(savedKeys) : {};
  });

  const [isConfigured, setIsConfigured] = useState<boolean>(false);

  useEffect(() => {
    // Save to localStorage whenever keys change
    localStorage.setItem('api-keys', JSON.stringify(apiKeys));
    
    // Check if all required keys are present
    setIsConfigured(!!apiKeys.openai && !!apiKeys.elevenlabs);
  }, [apiKeys]);

  // Update specific key
  const updateKey = (keyName: keyof ApiKeys, value: string) => {
    setApiKeys(prev => ({
      ...prev,
      [keyName]: value
    }));
  };

  return {
    apiKeys,
    updateKey,
    isConfigured
  };
}
