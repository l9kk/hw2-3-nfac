import { useQuery } from '@tanstack/react-query';
import { fetchChatMessages } from '../api/chatAPI';
import { CHAT_MESSAGES_KEY } from '../../../services/queryKeys';
import type { Message } from '../types/Message';

export function useChatMessages(chatId: string) {
    return useQuery<{ messages: Message[] }, Error>({
        queryKey: CHAT_MESSAGES_KEY(chatId),
        queryFn: () => fetchChatMessages(chatId),
        staleTime: 1000 * 60 * 5,  // 5 minutes
        enabled: Boolean(chatId),
    });
}
