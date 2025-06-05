export interface Chat {
    id: string;
    title: string;
    type: 'user' | 'assistant';
    unreadCount: number;
    createdAt: string;
}
