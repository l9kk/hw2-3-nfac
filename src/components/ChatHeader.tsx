import type { Chat } from '../features/chat/types/Chat';
import { motion } from 'framer-motion';

interface ChatHeaderProps {
    chat: Chat;
    isDarkMode?: boolean;
}

export function ChatHeader({ chat, isDarkMode }: ChatHeaderProps) {
    return (
        <motion.div
            className={`px-4 py-3 ${
                isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            } border-b flex items-center justify-between`}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <div className="flex items-center">
                {/* Chat avatar */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                    chat.type === 'assistant' 
                        ? 'bg-gradient-to-br from-blue-500 to-purple-600' 
                        : 'bg-gradient-to-br from-green-500 to-blue-500'
                }`}>                    <span className="text-white font-medium text-sm emoji">
                        {chat.type === 'assistant' ? '🤖' : '👤'}
                    </span>
                </div>

                <div>
                    <span className={`text-lg font-semibold ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                        {chat.title}
                    </span>
                    
                    {/* Online indicator for AI */}
                    {chat.type === 'assistant' && (
                        <div className="flex items-center mt-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-1" />
                            <span className={`text-xs ${
                                isDarkMode ? 'text-green-400' : 'text-green-600'
                            }`}>
                                Online
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
