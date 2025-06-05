import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createNewChat } from '../api/chatAPI';
import { CHAT_LIST_KEY } from '../../../services/queryKeys';
import type { Chat } from '../types/Chat';

export function useCreateChat() {
    const queryClient = useQueryClient();

    return useMutation<Chat, Error, { title: string; type: 'user' | 'assistant' }>({
        mutationFn: ({ title, type }) => createNewChat(title, type),
        onSuccess: (newChat) => {
            // Update the chats list in the cache
            queryClient.setQueryData<Chat[]>(CHAT_LIST_KEY, (old) => {
                if (!old) return [newChat];
                return [newChat, ...old];
            });

            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: CHAT_LIST_KEY });
        },
        onError: (error) => {
            console.error('Failed to create new chat:', error);
        },
    });
}