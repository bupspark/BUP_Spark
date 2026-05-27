import { useState, useCallback } from 'react';

export function useGemini() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateJSON = useCallback(async (prompt: string, system: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, system, isJson: true })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to fetch AI response');
      setIsLoading(false);
      return data.result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setIsLoading(false);
      throw err;
    }
  }, []);

  const generateText = useCallback(async (prompt: string, system: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, system, isJson: false })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to fetch AI response');
      setIsLoading(false);
      return data.result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setIsLoading(false);
      throw err;
    }
  }, []);

  return { isLoading, error, generateJSON, generateText };
}
