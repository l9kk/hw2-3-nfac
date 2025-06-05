import { useRef, useEffect } from 'react';
import { useChatMessages } from '../features/chat/hooks/useChatMessages';
import MessageBubble from './MessageBubble';
import { Spinner } from './ui/Spinner';
import { motion, AnimatePresence } from 'framer-motion';

interface MessageListProps {
    chatId: string;
    isDarkMode?: boolean;
}

export function MessageList({ chatId, isDarkMode }: MessageListProps) {
    const { data, isLoading, isError } = useChatMessages(chatId);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        if (scrollRef.current && data?.messages) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [data?.messages]);

    if (isLoading) {
        return (
            <div className={`flex-1 overflow-auto p-4 flex items-center justify-center ${
                isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
            }`}>
                <Spinner />
            </div>
        );
    }

    if (isError || !data) {
        return (
            <div className={`flex-1 overflow-auto p-4 flex items-center justify-center ${
                isDarkMode ? 'bg-gray-900 text-red-400' : 'bg-gray-50 text-red-600'
            }`}>
                <div className="text-center">                    <div className="text-4xl mb-2 emoji">⚠️</div>
                    <div>Error loading messages</div>
                </div>
            </div>
        );
    }

    if (data.messages.length === 0) {
        return (
            <div className={`flex-1 overflow-auto p-4 flex items-center justify-center ${
                isDarkMode ? 'bg-gray-900 text-gray-400' : 'bg-gray-50 text-gray-500'
            }`}>
                <div className="text-center">                    <div className="text-4xl mb-2 emoji">💬</div>
                    <div>No messages yet</div>
                    <div className="text-sm mt-1">Start a conversation!</div>
                </div>
            </div>
        );
    }

    return (
        <div 
            ref={scrollRef} 
            className={`flex-1 overflow-auto p-4 flex flex-col space-y-2 ${
                isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
            }`}
        >
            <AnimatePresence initial={false}>
                {data.messages.map((msg) => (
                    <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                    >
                        <MessageBubble message={msg} isDarkMode={isDarkMode} />
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}
