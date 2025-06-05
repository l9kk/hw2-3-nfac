export const CHAT_LIST_KEY = ['chatList'] as const;
export const CHAT_MESSAGES_KEY = (chatId: string) => ['chatMessages', chatId] as const;
export const SEND_AI_MESSAGE_KEY = (chatId: string) => ['sendAiMessage', chatId] as const;
