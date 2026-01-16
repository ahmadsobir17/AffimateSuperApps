/**
 * React hooks for OpenRouter LLM API
 * Easy-to-use hooks for chat, text generation, and image analysis
 */

import { useState, useCallback } from 'react';

interface UseLLMOptions {
    model?: string;
    temperature?: number;
    maxTokens?: number;
    systemPrompt?: string;
}

interface LLMMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

interface UseLLMReturn {
    generate: (prompt: string) => Promise<string>;
    chat: (messages: LLMMessage[]) => Promise<string>;
    analyzeImage: (imageBase64: string, prompt: string) => Promise<string>;
    isLoading: boolean;
    error: string | null;
    lastResult: string | null;
}

/**
 * Hook for using OpenRouter LLM API
 * 
 * @example
 * ```tsx
 * const { generate, isLoading, error } = useLLM({ model: 'anthropic/claude-3.5-sonnet' });
 * 
 * const handleClick = async () => {
 *   const result = await generate('Write a tagline for a coffee brand');
 *   console.log(result);
 * };
 * ```
 */
export function useLLM(options?: UseLLMOptions): UseLLMReturn {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [lastResult, setLastResult] = useState<string | null>(null);

    const callAPI = useCallback(async (body: Record<string, unknown>): Promise<string> => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/llm', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...body,
                    model: options?.model,
                    temperature: options?.temperature,
                    maxTokens: options?.maxTokens,
                }),
            });

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.error || 'API request failed');
            }

            setLastResult(data.result);
            return data.result;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error';
            setError(errorMessage);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [options?.model, options?.temperature, options?.maxTokens]);

    const generate = useCallback(async (prompt: string): Promise<string> => {
        return callAPI({
            action: 'generate',
            prompt,
            systemPrompt: options?.systemPrompt,
        });
    }, [callAPI, options?.systemPrompt]);

    const chat = useCallback(async (messages: LLMMessage[]): Promise<string> => {
        return callAPI({
            action: 'chat',
            messages,
        });
    }, [callAPI]);

    const analyzeImage = useCallback(async (imageBase64: string, prompt: string): Promise<string> => {
        return callAPI({
            action: 'vision',
            imageBase64,
            prompt,
        });
    }, [callAPI]);

    return {
        generate,
        chat,
        analyzeImage,
        isLoading,
        error,
        lastResult,
    };
}

/**
 * Hook for managing chat conversation with history
 * 
 * @example
 * ```tsx
 * const { messages, sendMessage, isLoading, clearHistory } = useChatLLM({
 *   systemPrompt: 'You are a helpful marketing assistant.',
 * });
 * 
 * <button onClick={() => sendMessage('Help me write ad copy')}>Send</button>
 * ```
 */
export function useChatLLM(options?: UseLLMOptions & { systemPrompt?: string }) {
    const [messages, setMessages] = useState<LLMMessage[]>(() => {
        if (options?.systemPrompt) {
            return [{ role: 'system', content: options.systemPrompt }];
        }
        return [];
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const sendMessage = useCallback(async (content: string): Promise<string> => {
        setIsLoading(true);
        setError(null);

        const userMessage: LLMMessage = { role: 'user', content };
        const updatedMessages = [...messages, userMessage];
        setMessages(updatedMessages);

        try {
            const response = await fetch('/api/llm', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'chat',
                    messages: updatedMessages,
                    model: options?.model,
                    temperature: options?.temperature,
                    maxTokens: options?.maxTokens,
                }),
            });

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.error || 'API request failed');
            }

            const assistantMessage: LLMMessage = { role: 'assistant', content: data.result };
            setMessages(prev => [...prev, assistantMessage]);

            return data.result;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error';
            setError(errorMessage);
            // Remove the user message if failed
            setMessages(messages);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [messages, options?.model, options?.temperature, options?.maxTokens]);

    const clearHistory = useCallback(() => {
        if (options?.systemPrompt) {
            setMessages([{ role: 'system', content: options.systemPrompt }]);
        } else {
            setMessages([]);
        }
        setError(null);
    }, [options?.systemPrompt]);

    return {
        messages,
        sendMessage,
        clearHistory,
        isLoading,
        error,
    };
}

// Re-export model list for convenience
export { OPENROUTER_MODELS } from './openrouter';
