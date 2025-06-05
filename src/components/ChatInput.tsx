import React, { useState, useRef, useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useAiResponse } from '../features/aiBot/hooks/useAiResponse';
import { motion, AnimatePresence } from 'framer-motion';
import { themeClasses } from '../utils/theme';

interface FormValues { 
    content: string; 
}

interface ChatInputProps {
    chatId: string;
    isDarkMode?: boolean;
}

export function ChatInput({ chatId, isDarkMode }: ChatInputProps) {
    const { register, handleSubmit, reset, watch, setValue } = useForm<FormValues>({
        defaultValues: {
            content: ''
        },
        mode: 'onChange'
    });
    const [isTyping, setIsTyping] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    
    const mutation = useAiResponse(chatId);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const emojiPickerRef = useRef<HTMLDivElement>(null);
    
    const messageContent = watch('content');

    const emojis = [
        '😊', '😂', '🤣', '😍', '😘', '😎', '🤗', '🤔',
        '😢', '😭', '😡', '😤', '😱', '😴', '🤤', '🙄',
        '👍', '👎', '👏', '🙏', '💪', '🤝', '✌️', '🤞',
        '❤️', '💕', '💖', '💯', '🔥', '✨', '🎉', '🎊',
        '🚀', '⭐', '🌟', '💫', '🎯', '💎', '🏆', '🎪'
    ];    const handleEmojiSelect = (emoji: string) => {
        const currentContent = messageContent || '';
        setValue('content', currentContent + emoji);
        setShowEmojiPicker(false);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
                setShowEmojiPicker(false);
            }
        };

        if (showEmojiPicker) {
            document.addEventListener('mousedown', handleClickOutside);
        }        return () => {
            document.removeEventListener('mousedown', handleClickOutside);        };
    }, [showEmojiPicker]);    const onSubmit: SubmitHandler<FormValues> = ({ content }) => {
        if (!content?.trim()) {
            return;
        }
        setIsTyping(true);
        mutation.mutate(content, { 
            onSettled: () => {
                setIsTyping(false);
            }
        });
        reset();
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    const removeSelectedFile = () => {
        setSelectedFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';        }
    };    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(onSubmit)();
        }
    };    const canSend = Boolean(messageContent?.trim()) && !mutation.isPending && !isTyping;    return (
        <motion.div
            className={themeClasses.chat.input.container(isDarkMode || false)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            {/* Typing indicator */}
            <AnimatePresence>
                {isTyping && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className={`px-4 py-2 ${
                            isDarkMode ? 'text-gray-400' : 'text-gray-600'
                        } text-sm border-b ${
                            isDarkMode ? 'border-gray-700' : 'border-gray-200'
                        }`}
                    >
                        <div className="flex items-center">
                            <div className="flex space-x-1 mr-2">
                                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                            </div>
                            AI is typing...
                        </div>
                    </motion.div>                )}
            </AnimatePresence>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col" data-testid="chat-form">
                {/* File preview */}
                <AnimatePresence>
                    {selectedFile && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className={`px-4 py-2 border-b ${
                                isDarkMode ? 'border-gray-700' : 'border-gray-200'
                            }`}
                        >
                            <div className={`flex items-center justify-between p-2 rounded-lg ${
                                isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                            }`}>
                                <div className="flex items-center">                                    <div className="w-8 h-8 flex items-center justify-center rounded bg-blue-500 text-white mr-2">
                                        <span className="emoji">{selectedFile.type.startsWith('image/') ? '🖼️' : '📄'}</span>
                                    </div>
                                    <div>
                                        <p className={`text-sm font-medium ${
                                            isDarkMode ? 'text-white' : 'text-gray-900'
                                        }`}>
                                            {selectedFile.name}
                                        </p>
                                        <p className={`text-xs ${
                                            isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                        }`}>
                                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                        </p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={removeSelectedFile}                                    className={`p-1 rounded transition-colors ${
                                        isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'
                                    }`}
                                >
                                    <span className="emoji">✕</span>
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="flex items-end p-4 space-x-3">
                    {/* Hidden file input */}
                    <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        onChange={handleFileSelect}
                        accept="image/*,application/pdf,.doc,.docx,.txt"
                    />
                    
                    {/* Attachment button */}
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className={`p-2 rounded-lg transition-colors ${
                            isDarkMode 
                                ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'                        }`}
                        title="Attach file"
                    >
                        <span className="emoji">📎</span>
                    </button>

                    {/* Text input */}
                <div className="flex-1 relative">                    <textarea
                        {...register('content', { 
                            maxLength: 4000,
                            required: false 
                        })}
                        className={themeClasses.chat.input.textarea(isDarkMode || false)}
                        placeholder="Type a message..."
                        rows={1}
                        onKeyDown={handleKeyDown}
                        style={{ minHeight: '48px' }}
                    />
                    
                    {/* Character count */}
                    {messageContent && messageContent.length > 3500 && (
                        <div className={`absolute bottom-2 right-3 text-xs ${
                            messageContent.length > 4000 ? 'text-red-500' : 'text-gray-400'
                        }`}>
                            {messageContent.length}/4000
                        </div>                    )}
                </div>

                {/* Emoji button */}
                <div className="relative" ref={emojiPickerRef}>                    <button
                        type="button"
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        className={`p-2 rounded-lg transition-colors ${
                            isDarkMode 
                                ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                        }`}
                        title="Add emoji"
                    >
                        <span className="emoji text-lg">😊</span>
                    </button>

                    {/* Emoji Picker */}
                    <AnimatePresence>
                        {showEmojiPicker && (                            <motion.div
                                ref={emojiPickerRef}
                                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.8, y: 10 }}
                                className={themeClasses.emojiPicker.container(isDarkMode || false)}
                                style={{ width: '280px', maxHeight: '200px' }}
                            >
                                <div className={themeClasses.emojiPicker.grid}>
                                    {emojis.map((emoji, index) => (
                                        <button
                                            key={index}
                                            type="button"
                                            onClick={() => handleEmojiSelect(emoji)}
                                            className={themeClasses.emojiPicker.button(isDarkMode || false)}
                                            title={emoji}
                                        >
                                            {emoji}
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}                    </AnimatePresence>
                </div>                {/* Send button */}                <button
                    type="submit"
                    disabled={!canSend}
                    className={`p-3 rounded-full transition-all flex-shrink-0 ${
                        canSend
                            ? themeClasses.button.primary
                            : themeClasses.button.disabled(isDarkMode || false)
                    }`}
                    title="Send message"
                    style={{ zIndex: 10 }}
                >{mutation.isPending ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />                    ) : (
                        <span className="text-lg emoji">🚀</span>
                    )}
                </button>
                </div>
            </form>
        </motion.div>
    );
}
