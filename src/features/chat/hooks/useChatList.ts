import { useQuery } from '@tanstack/react-query';
import { fetchChats } from '../api/chatAPI';
import { CHAT_LIST_KEY } from '../../../services/queryKeys';
import type { Chat } from '../types/Chat';

export function useChatList() {
    return useQuery<Chat[], Error>({
        queryKey: CHAT_LIST_KEY,
        queryFn: () => fetchChats(),
        staleTime: 1000 * 60 * 2,  // 2 minutes
    });
}
