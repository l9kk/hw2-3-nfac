import { useState } from 'react';
import { useChatList } from '../features/chat/hooks/useChatList';
import { useCreateChat } from '../features/chat/hooks/useCreateChat';
import { fetchChatMessages } from '../features/chat/api/chatAPI';
import { CHAT_MESSAGES_KEY } from '../services/queryKeys';
import { useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { themeClasses } from '../utils/theme';

interface SidebarProps {
    selectedChat: string;
    setSelectedChat: (id: string) => void;
    isDarkMode?: boolean;
    onToggleDarkMode?: () => void;
}

export function Sidebar({ selectedChat, setSelectedChat, isDarkMode, onToggleDarkMode }: SidebarProps) {
    const { data: chats, isLoading, isError } = useChatList();
    const createChatMutation = useCreateChat();
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState('');
    const [isCollapsed, setIsCollapsed] = useState(false);

    const handleNewAIChat = async () => {
        try {
            const newChat = await createChatMutation.mutateAsync({
                title: `AI Assistant ${new Date().toLocaleTimeString()}`,
                type: 'assistant'
            });
            
            // Select the new chat
            setSelectedChat(newChat.id);
        } catch (error) {
            console.error('Failed to create new AI chat:', error);
        }
    };

    if (isLoading) {
        return (
            <div className={`${isCollapsed ? 'w-16' : 'w-80'} ${isDarkMode ? 'bg-gray-800' : 'bg-white'} border-r ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} flex flex-col transition-all duration-300`}>
                <div className="p-4 flex justify-center items-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                </div>
            </div>
        );
    }

    if (isError || !chats) {
        return (
            <div className={`${isCollapsed ? 'w-16' : 'w-80'} ${isDarkMode ? 'bg-gray-800' : 'bg-white'} border-r ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} flex flex-col transition-all duration-300`}>
                <div className={`p-4 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>
                    {isCollapsed ? '!' : 'Error loading chats.'}
                </div>
            </div>
        );
    }    const filteredChats = chats.filter(chat =>
        chat.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Group chats by type
    const peopleChats = filteredChats.filter(chat => chat.type !== 'assistant');
    const aiChats = filteredChats.filter(chat => chat.type === 'assistant');    return (
        <motion.div
            className={themeClasses.sidebar.container(isDarkMode || false, isCollapsed)}
            initial={false}
            animate={{ width: isCollapsed ? 64 : 320 }}
            transition={{ duration: 0.3 }}
        >
            {/* Header */}
            <div className={themeClasses.sidebar.header(isDarkMode || false)}>
                <AnimatePresence>
                    {!isCollapsed && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className={themeClasses.sidebar.title(isDarkMode || false)}
                        >
                            Chats
                        </motion.div>
                    )}
                </AnimatePresence>
                
                <div className="flex items-center gap-2">
                    {/* Dark mode toggle */}
                    <button
                        onClick={onToggleDarkMode}
                        className={`p-2 rounded-lg transition-colors ${
                            isDarkMode 
                                ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' 
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}                        title="Toggle dark mode"
                    >
                        <span className="emoji">{isDarkMode ? '☀️' : '🌙'}</span>
                    </button>
                    
                    {/* Collapse toggle */}
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className={`p-2 rounded-lg transition-colors ${
                            isDarkMode 
                                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                        title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                    >
                        {isCollapsed ? '→' : '←'}
                    </button>
                </div>
            </div>            {/* Search and New Chat Buttons */}
            <AnimatePresence>
                {!isCollapsed && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="p-4 space-y-3"
                    >
                        <input
                            type="text"
                            placeholder="Search chats..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={`w-full px-3 py-2 rounded-lg border ${
                                isDarkMode
                                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                                    : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                            } focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
                        />                        {/* New AI Chat Button */}
                        <button
                            onClick={handleNewAIChat}
                            disabled={createChatMutation.isPending}
                            className={`w-full px-4 py-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center ${
                                isDarkMode
                                    ? 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-700 disabled:text-gray-500'
                                    : 'bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-300 disabled:text-gray-500'
                            }`}
                            title="Create new AI chat"
                        >
                            {createChatMutation.isPending ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                    Creating...
                                </>                            ) : (
                                <><span className="emoji">🤖</span> New AI Chat</>
                            )}
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>            {/* Chat List */}
            <div className="flex-1 overflow-auto">
                {/* People Category */}
                {peopleChats.length > 0 && (
                    <div className="px-4 py-2">
                        <h3 className={`text-xs font-semibold uppercase tracking-wide ${
                            isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                            People
                        </h3>
                        <AnimatePresence>
                            {peopleChats.map((chat) => (
                                <motion.div
                                    key={chat.id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className={`flex items-center p-3 mt-1 rounded-lg cursor-pointer transition-colors ${
                                        selectedChat === chat.id 
                                            ? isDarkMode ? 'bg-gray-700' : 'bg-blue-50'
                                            : isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                                    }`}
                                    onClick={() => {
                                        setSelectedChat(chat.id);
                                        // Prefetch messages for better UX
                                        queryClient.prefetchQuery({
                                            queryKey: CHAT_MESSAGES_KEY(chat.id),
                                            queryFn: () => fetchChatMessages(chat.id)
                                        });
                                    }}
                                >
                                    {/* Avatar */}
                                    <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3 bg-gradient-to-br from-green-500 to-blue-500">                                        <span className="text-white font-medium text-sm emoji">
                                            👤
                                        </span>
                                    </div>

                                    <AnimatePresence>
                                        {!isCollapsed && (
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className="flex-1 min-w-0"
                                            >
                                                <div className={`font-medium ${
                                                    isDarkMode ? 'text-white' : 'text-gray-900'
                                                } truncate`}>
                                                    {chat.title}
                                                </div>
                                                <div className={`text-sm ${
                                                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                                }`}>
                                                    Human Chat
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* Unread badge */}
                                    {chat.unreadCount > 0 && !isCollapsed && (
                                        <motion.span
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="ml-2 bg-primary text-white text-xs px-2 py-1 rounded-full min-w-[20px] text-center"
                                        >
                                            {chat.unreadCount}
                                        </motion.span>
                                    )}
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}

                {/* AI Assistants Category */}
                {aiChats.length > 0 && (
                    <div className="px-4 py-2">
                        <h3 className={`text-xs font-semibold uppercase tracking-wide ${
                            isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                            AI Assistants
                        </h3>
                        <AnimatePresence>
                            {aiChats.map((chat) => (
                                <motion.div
                                    key={chat.id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className={`flex items-center p-3 mt-1 rounded-lg cursor-pointer transition-colors ${
                                        selectedChat === chat.id 
                                            ? isDarkMode ? 'bg-gray-700' : 'bg-blue-50'
                                            : isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                                    }`}
                                    onClick={() => {
                                        setSelectedChat(chat.id);
                                        // Prefetch messages for better UX
                                        queryClient.prefetchQuery({
                                            queryKey: CHAT_MESSAGES_KEY(chat.id),
                                            queryFn: () => fetchChatMessages(chat.id)
                                        });
                                    }}
                                >
                                    {/* Avatar */}
                                    <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3 bg-gradient-to-br from-blue-500 to-purple-600">                                        <span className="text-white font-medium text-sm emoji">
                                            🤖
                                        </span>
                                    </div>

                                    <AnimatePresence>
                                        {!isCollapsed && (
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className="flex-1 min-w-0"
                                            >
                                                <div className={`font-medium ${
                                                    isDarkMode ? 'text-white' : 'text-gray-900'
                                                } truncate`}>
                                                    {chat.title}
                                                </div>
                                                <div className={`text-sm ${
                                                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                                }`}>
                                                    AI Assistant
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* Unread badge */}
                                    {chat.unreadCount > 0 && !isCollapsed && (
                                        <motion.span
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="ml-2 bg-primary text-white text-xs px-2 py-1 rounded-full min-w-[20px] text-center"
                                        >
                                            {chat.unreadCount}
                                        </motion.span>
                                    )}

                                    {/* Online indicator for AI */}
                                    <div className={`${isCollapsed ? 'absolute top-2 right-2' : 'ml-2'} w-3 h-3 bg-green-500 rounded-full border-2 border-white`} />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}

                {/* Empty state */}
                {filteredChats.length === 0 && (
                    <div className={`p-8 text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>                        <div className="text-4xl mb-2 emoji">💬</div>
                        <p>No chats found</p>
                        {searchTerm && (
                            <p className="text-sm mt-1">Try adjusting your search</p>
                        )}
                    </div>
                )}
            </div>
        </motion.div>
    );
}
