import type { Message } from '../features/chat/types/Message';
import ReactMarkdown from 'react-markdown';
import { getStatusColor, getStatusIcon } from '../utils/theme';

interface MessageBubbleProps {
    message: Message;
    isDarkMode?: boolean;
}

export default function MessageBubble({ message, isDarkMode }: MessageBubbleProps) {
    const isUser = message.senderId === 'user';
    
    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };const renderMessageContent = () => {
        switch (message.type) {
            case 'text':
                // Use ReactMarkdown for AI messages, plain text for user messages
                if (message.senderId === 'ai') {
                    return (
                        <div className="text-sm leading-relaxed prose prose-sm max-w-none dark:prose-invert">
                            <ReactMarkdown>{message.content}</ReactMarkdown>
                        </div>
                    );
                } else {
                    return (
                        <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                            {message.content}
                        </p>
                    );
                }
            
            case 'image':
                return (
                    <div>
                        <img
                            src={message.imageUrl}
                            alt="Shared image"
                            className="max-w-full h-auto rounded-lg mb-2"
                            style={{ maxHeight: '300px' }}
                        />
                        {message.caption && (
                            <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                                {message.caption}
                            </p>
                        )}
                    </div>
                );
            
            case 'file':
                return (
                    <div className={`flex items-center p-3 rounded-lg ${
                        isDarkMode ? 'bg-gray-600' : 'bg-gray-100'
                    }`}>                        <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg bg-blue-500 text-white mr-3">
                            <span className="emoji">📄</span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                                {message.fileName}
                            </p>
                            <p className={`text-xs ${
                                isDarkMode ? 'text-gray-400' : 'text-gray-500'
                            }`}>
                                {formatFileSize(message.fileSize)} • {message.mimeType}
                            </p>
                        </div>                        <button className={`ml-2 p-2 rounded-lg transition-colors ${
                            isDarkMode ? 'hover:bg-gray-500' : 'hover:bg-gray-200'
                        }`}>
                            <span className="emoji">⬇️</span>
                        </button>
                    </div>
                );
            
            default:
                return <p className="text-sm">Unsupported message type</p>;
        }
    };    return (
        <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}>
            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                isUser 
                    ? `${isDarkMode ? 'bg-blue-600' : 'bg-blue-500'} text-white rounded-br-md`
                    : `${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'} rounded-bl-md shadow-sm border ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`
            }`}>
                {/* Message content */}
                {renderMessageContent()}
                
                {/* Message metadata */}
                <div className={`flex items-center justify-between mt-2 text-xs ${
                    isUser 
                        ? 'text-blue-100' 
                        : isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                    <span>
                        {new Date(message.createdAt).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                        })}
                    </span>
                      {isUser && (
                        <span className={`ml-2 ${getStatusColor(message.status, isDarkMode || false)}`}>
                            {getStatusIcon(message.status)}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
