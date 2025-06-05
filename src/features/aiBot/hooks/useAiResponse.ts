import { useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchAiStream } from '../api/aiBotAPI';
import { postUserMessage } from '../../chat/api/chatAPI';
import { CHAT_MESSAGES_KEY, SEND_AI_MESSAGE_KEY } from '../../../services/queryKeys';
import type { Message } from '../../chat/types/Message';

export function useAiResponse(chatId: string) {
    const queryClient = useQueryClient();

    return useMutation<ReadableStream, Error, string>({
        mutationKey: SEND_AI_MESSAGE_KEY(chatId),
        mutationFn: async (content) => {
            await postUserMessage(chatId, content);    // Add user message to mock store
            return fetchAiStream(chatId, content);      // Return AI streaming (mock or future real)
        },
        onMutate: async (content) => {
            await queryClient.cancelQueries({ queryKey: CHAT_MESSAGES_KEY(chatId) });
            const previous = queryClient.getQueryData<{ messages: Message[] }>(CHAT_MESSAGES_KEY(chatId));
            queryClient.setQueryData<{ messages: Message[] }>(CHAT_MESSAGES_KEY(chatId), (old) => {
                if (!old) return old!;
                const newMessage: Message = {
                    id: Date.now().toString(),
                    chatId,
                    senderId: 'user',
                    content,
                    type: 'text',
                    status: 'sending',
                    createdAt: new Date().toISOString()
                };
                return { messages: [...old.messages, newMessage] };
            });
            return { previous };
        },
        onError: (_err, _content, context: any) => {
            if (context?.previous) {
                queryClient.setQueryData(CHAT_MESSAGES_KEY(chatId), context.previous);
            }
        }, onSuccess: async (stream: ReadableStream) => {
            // Handle AI response streaming
            const reader = stream.getReader();
            const decoder = new TextDecoder();
            let aiResponse = '';

            try {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    const chunk = decoder.decode(value);
                    aiResponse += chunk;
                }

                // Add AI response to messages
                queryClient.setQueryData<{ messages: Message[] }>(CHAT_MESSAGES_KEY(chatId), (old) => {
                    if (!old) return old!;
                    const aiMessage: Message = {
                        id: (Date.now() + 1).toString(),
                        chatId,
                        senderId: 'ai',
                        content: aiResponse,
                        type: 'text',
                        status: 'read',
                        createdAt: new Date().toISOString()
                    };
                    // Update user message status to 'sent' and add AI response
                    const updatedMessages = old.messages.map(msg =>
                        msg.senderId === 'user' && msg.status === 'sending'
                            ? { ...msg, status: 'sent' as const }
                            : msg
                    );
                    return { messages: [...updatedMessages, aiMessage] };
                });
            } catch (error) {
                console.error('Error reading AI stream:', error);
            }
            // Note: Removed queryClient.invalidateQueries to prevent AI message from disappearing
        },
    });
}
