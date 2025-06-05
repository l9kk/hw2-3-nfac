export interface BaseMessage {
    id: string;
    chatId: string;
    senderId: 'user' | 'ai';
    status: 'sending' | 'sent' | 'delivered' | 'read';
    createdAt: string;
}

export interface TextMessage extends BaseMessage {
    type: 'text';
    content: string;
}

export interface ImageMessage extends BaseMessage {
    type: 'image';
    imageUrl: string;
    caption?: string;
}

export interface FileMessage extends BaseMessage {
    type: 'file';
    fileName: string;
    fileUrl: string;
    fileSize: number;
    mimeType: string;
}

export type Message = TextMessage | ImageMessage | FileMessage;
