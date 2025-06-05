/**
 * Centralized theme utilities for consistent styling across the application
 */

export const themeClasses = {
    // Container classes
    container: 'flex h-screen',

    // Background classes
    bg: {
        primary: (isDark: boolean) => isDark ? 'bg-gray-900' : 'bg-gray-50',
        secondary: (isDark: boolean) => isDark ? 'bg-gray-800' : 'bg-white',
        tertiary: (isDark: boolean) => isDark ? 'bg-gray-700' : 'bg-gray-100',
    },

    // Text classes
    text: {
        primary: (isDark: boolean) => isDark ? 'text-white' : 'text-gray-900',
        secondary: (isDark: boolean) => isDark ? 'text-gray-400' : 'text-gray-500',
        muted: (isDark: boolean) => isDark ? 'text-gray-500' : 'text-gray-400',
    },

    // Border classes
    border: {
        primary: (isDark: boolean) => isDark ? 'border-gray-700' : 'border-gray-200',
        secondary: (isDark: boolean) => isDark ? 'border-gray-600' : 'border-gray-300',
    },

    // Sidebar classes
    sidebar: {
        container: (isDark: boolean, isCollapsed: boolean) =>
            `${isCollapsed ? 'w-16' : 'w-80'} ${isDark ? 'bg-gray-800' : 'bg-white'} border-r ${isDark ? 'border-gray-700' : 'border-gray-200'} flex flex-col transition-all duration-300`,
        header: (isDark: boolean) =>
            `p-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'} flex items-center justify-between`,
        title: (isDark: boolean) =>
            `font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`,
    },

    // Chat classes
    chat: {
        header: (isDark: boolean) =>
            `px-4 py-3 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b flex items-center justify-between`,
        input: {
            container: (isDark: boolean) =>
                `border-t ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`,
            textarea: (isDark: boolean) =>
                `w-full px-4 py-3 rounded-2xl border resize-none transition-colors ${isDark
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500'
                    : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20`,
        },
        list: (isDark: boolean) =>
            `flex-1 overflow-auto p-4 flex flex-col space-y-2 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`,
    },

    // Message classes
    message: {
        bubble: {
            user: (isDark: boolean) =>
                `${isDark ? 'bg-blue-600' : 'bg-blue-500'} text-white rounded-br-md`,
            ai: (isDark: boolean) =>
                `${isDark ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'} rounded-bl-md shadow-sm border ${isDark ? 'border-gray-600' : 'border-gray-200'}`,
        },
        metadata: {
            user: 'text-blue-100',
            ai: (isDark: boolean) => isDark ? 'text-gray-400' : 'text-gray-500',
        }
    },

    // Button classes
    button: {
        primary: 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl',
        secondary: (isDark: boolean) =>
            isDark ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-600',
        icon: (isDark: boolean) =>
            `p-2 rounded-lg transition-colors ${isDark ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`,
        disabled: (isDark: boolean) =>
            isDark ? 'bg-gray-700 text-gray-500' : 'bg-gray-200 text-gray-400',
    },

    // Form classes
    form: {
        input: (isDark: boolean) =>
            `w-full px-3 py-2 rounded-lg border ${isDark
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
            } focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`,
    },

    // Emoji picker classes
    emojiPicker: {
        container: (isDark: boolean) =>
            `absolute bottom-12 right-0 p-3 rounded-lg shadow-lg border z-50 ${
                isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`,
        grid: 'grid grid-cols-8 gap-2 overflow-y-auto',
        button: (isDark: boolean) =>
            `w-8 h-8 flex items-center justify-center rounded text-lg emoji transition-colors ${
                isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            }`,
    },

    // State classes
    state: {
        loading: (isDark: boolean) =>
            `flex-1 overflow-auto p-4 flex items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`,
        error: (isDark: boolean) =>
            `flex-1 overflow-auto p-4 flex items-center justify-center ${isDark ? 'bg-gray-900 text-red-400' : 'bg-gray-50 text-red-600'}`,
        empty: (isDark: boolean) =>
            `flex-1 overflow-auto p-4 flex items-center justify-center ${isDark ? 'bg-gray-900 text-gray-400' : 'bg-gray-50 text-gray-500'}`,
    },

    // Animation classes
    animation: {
        fadeIn: 'animate-in fade-in duration-300',
        slideIn: 'animate-in slide-in-from-right duration-300',
        scale: 'animate-in zoom-in duration-200',
    }
};

/**
 * Helper function to combine theme classes
 */
export function cn(...classes: (string | undefined | false)[]): string {
    return classes.filter(Boolean).join(' ');
}

/**
 * Get consistent status colors for message states
 */
export function getStatusColor(status: string, isDark: boolean): string {
    switch (status) {
        case 'sending': return isDark ? 'text-yellow-400' : 'text-yellow-600';
        case 'sent': return isDark ? 'text-gray-400' : 'text-gray-500';
        case 'delivered': return isDark ? 'text-gray-400' : 'text-gray-500';
        case 'read': return isDark ? 'text-blue-400' : 'text-blue-600';
        default: return isDark ? 'text-gray-400' : 'text-gray-500';
    }
}

/**
 * Get consistent status icons for message states
 */
export function getStatusIcon(status: string): string {
    switch (status) {
        case 'sending': return '⏳';
        case 'sent': return '✓';
        case 'delivered': return '✓✓';
        case 'read': return '✓✓';
        default: return '';
    }
}
