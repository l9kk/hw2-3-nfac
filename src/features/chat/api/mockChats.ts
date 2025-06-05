import type { Chat } from '../types/Chat';
import type { Message } from '../types/Message';
import { v4 as uuidv4 } from 'uuid';
import { delay } from '../../mocks/delay';

let chats: Chat[] = [
    {
        id: 'human',
        title: 'Human Chat',
        type: 'user',
        unreadCount: 0,
        createdAt: new Date().toISOString()
    },
    {
        id: 'ai',
        title: 'AI Assistant',
        type: 'assistant',
        unreadCount: 0,
        createdAt: new Date().toISOString()
    },
    {
        id: 'support',
        title: 'Customer Support',
        type: 'user',
        unreadCount: 2,
        createdAt: new Date().toISOString()
    },
    {
        id: 'gemini',
        title: 'Gemini AI',
        type: 'assistant',
        unreadCount: 0,
        createdAt: new Date().toISOString()
    }
];

let messagesByChat: Record<string, Message[]> = {
    human: [
        {
            id: uuidv4(),
            chatId: 'human',
            senderId: 'user',
            content: 'Hey, how are you?',
            type: 'text',
            status: 'read',
            createdAt: new Date().toISOString()
        },
        {
            id: uuidv4(),
            chatId: 'human',
            senderId: 'user',
            content: 'Let\'s talk.',
            type: 'text',
            status: 'read',
            createdAt: new Date().toISOString()
        }
    ],
    ai: [
        {
            id: uuidv4(),
            chatId: 'ai',
            senderId: 'ai',
            content: 'Welcome! Ask me anything.',
            type: 'text',
            status: 'read',
            createdAt: new Date().toISOString()
        }
    ],
    support: [{
        id: uuidv4(),
        chatId: 'support',
        senderId: 'ai',
        content: 'I need help with my account',
        type: 'text',
        status: 'read',
        createdAt: new Date().toISOString()
    },
    {
        id: uuidv4(),
        chatId: 'support',
        senderId: 'ai',
        content: 'Can someone assist me?',
        type: 'text',
        status: 'sent',
        createdAt: new Date().toISOString()
    }
    ],
    gemini: [
        {
            id: uuidv4(),
            chatId: 'gemini',
            senderId: 'ai',
            content: 'Hello! I\'m powered by Gemini AI. How can I help you today?',
            type: 'text',
            status: 'read',
            createdAt: new Date().toISOString()
        }
    ]
};

export async function fetchChats(): Promise<Chat[]> {
    await delay(200);
    return chats;
}

export async function fetchChatMessages(chatId: string): Promise<{ messages: Message[] }> {
    await delay(200);
    return { messages: messagesByChat[chatId] || [] };
}

export async function postUserMessage(chatId: string, content: string): Promise<Message> {
    await delay(100);
    const newMessage: Message = {
        id: uuidv4(),
        chatId,
        senderId: 'user',
        content,
        type: 'text',
        status: 'sent',
        createdAt: new Date().toISOString()
    };
    if (!messagesByChat[chatId]) messagesByChat[chatId] = [];
    messagesByChat[chatId].push(newMessage);
    return newMessage;
}

export async function createNewChat(title: string, type: 'user' | 'assistant'): Promise<Chat> {
    await delay(100);
    const newChat: Chat = {
        id: uuidv4(),
        title,
        type,
        unreadCount: 0,
        createdAt: new Date().toISOString()
    };

    chats.unshift(newChat); // Add to beginning of array
    messagesByChat[newChat.id] = []; // Initialize empty messages array

    return newChat;
}
