import { useEffect } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from './services/queryClient';
import { Sidebar } from './components/Sidebar';
import { ChatHeader } from './components/ChatHeader';
import { MessageList } from './components/MessageList';
import { ChatInput } from './components/ChatInput';
import { useLocalStorage, useDarkMode } from './utils/localStorage';
import { useChatList } from './features/chat/hooks/useChatList';
import { motion, AnimatePresence } from 'framer-motion';

function AppContent() {
    const [selectedChat, setSelectedChat] = useLocalStorage<string>('selectedChat', 'ai');
    const [isDarkMode, toggleDarkMode] = useDarkMode();
    const { data: chats } = useChatList();

    const currentChat = chats?.find(chat => chat.id === selectedChat);

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDarkMode]);

    useEffect(() => {
        if (chats && chats.length > 0 && !currentChat) {
            setSelectedChat(chats[0].id);
        }
    }, [chats, currentChat, setSelectedChat]);

    if (!currentChat) {
        return (
            <div className={`flex h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
                <Sidebar 
                    selectedChat={selectedChat} 
                    setSelectedChat={setSelectedChat}
                    isDarkMode={isDarkMode}
                    onToggleDarkMode={toggleDarkMode}
                />
                <div className={`flex-1 flex items-center justify-center ${
                    isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
                }`}>
                    <div className="text-center">
                        <div className="text-6xl mb-4 emoji">💬</div>
                        <div className="text-xl mb-2">Welcome to AI Messenger</div>
                        <div className="text-gray-500">Select a chat to start messaging</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`flex h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
            <Sidebar 
                selectedChat={selectedChat} 
                setSelectedChat={setSelectedChat}
                isDarkMode={isDarkMode}
                onToggleDarkMode={toggleDarkMode}
            />
            
            <div className="flex flex-col flex-1 min-w-0">
                {/* Chat Area */}
                <AnimatePresence mode="wait">
                    <motion.div 
                        key={selectedChat}
                        className="flex flex-col flex-1 min-h-0"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        <ChatHeader chat={currentChat} isDarkMode={isDarkMode} />
                        <MessageList chatId={selectedChat} isDarkMode={isDarkMode} />
                        <ChatInput chatId={selectedChat} isDarkMode={isDarkMode} />
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}

export default function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <AppContent />
            <ReactQueryDevtools 
                initialIsOpen={false} 
                buttonPosition="bottom-right"
            />
        </QueryClientProvider>
    );
}
