import { useState, useCallback } from 'react';

function parseErrorMessage(errMessage: string): string {
  try {
    const parsed = JSON.parse(errMessage);
    if (parsed && parsed.error && parsed.error.message) {
      return parsed.error.message;
    }
  } catch {
    // If not JSON, return original message
  }
  return errMessage;
}

export function useGemini() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateJSON = useCallback(async (prompt: string, system: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, system, isJson: true })
      });
      
      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (err) {
        throw new Error(`Server Error (${response.status}): ${text.slice(0, 150) || 'Invalid server response'}`);
      }

      if (!response.ok) throw new Error(data.error || 'Failed to fetch AI response');
      setIsLoading(false);
      return data.result;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'An error occurred';
      setError(parseErrorMessage(msg));
      setIsLoading(false);
      throw err;
    }
  }, []);

  const generateText = useCallback(async (prompt: string, system: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, system, isJson: false })
      });
      
      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (err) {
        throw new Error(`Server Error (${response.status}): ${text.slice(0, 150) || 'Invalid server response'}`);
      }

      if (!response.ok) throw new Error(data.error || 'Failed to fetch AI response');
      setIsLoading(false);
      return data.result;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'An error occurred';
      setError(parseErrorMessage(msg));
      setIsLoading(false);
      throw err;
    }
  }, []);

  return { isLoading, error, generateJSON, generateText };
}
