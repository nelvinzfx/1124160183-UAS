tailwind.config = {
    darkMode: 'class', // Enable class-based dark mode
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#eff6ff',
                    500: '#3B82F6',
                    600: '#2563eb',
                    700: '#1d4ed8'
                },
                secondary: {
                    500: '#10B981',
                    600: '#059669'
                },
                accent: {
                    500: '#8B5CF6',
                    600: '#7c3aed'
                },
                dark: {
                    bg: {
                        primary: '#111827',
                        secondary: '#1F2937',
                        tertiary: '#374151'
                    },
                    text: {
                        primary: '#F9FAFB',
                        secondary: '#D1D5DB',
                        tertiary: '#9CA3AF'
                    },
                    border: '#374151'
                }
            },
            animation: {
                'slide-up': 'slideUp 0.3s ease-out',
                'fade-in': 'fadeIn 0.2s ease-in',
                'pulse-success': 'pulseSuccess 2s infinite',
                'bounce-in': 'bounceIn 0.5s ease-out',
                'scale-in': 'scaleIn 0.3s ease-out'
            },
            keyframes: {
                slideUp: {
                    '0%': { 
                        transform: 'translateY(20px)', 
                        opacity: '0' 
                    },
                    '100%': { 
                        transform: 'translateY(0)', 
                        opacity: '1' 
                    }
                },
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' }
                },
                pulseSuccess: {
                    '0%, 100%': { transform: 'scale(1)' },
                    '50%': { transform: 'scale(1.05)' }
                },
                bounceIn: {
                    '0%': { 
                        transform: 'scale(0.3)', 
                        opacity: '0' 
                    },
                    '50%': { 
                        transform: 'scale(1.05)' 
                    },
                    '70%': { 
                        transform: 'scale(0.9)' 
                    },
                    '100%': { 
                        transform: 'scale(1)', 
                        opacity: '1' 
                    }
                },
                scaleIn: {
                    '0%': { 
                        transform: 'scale(0)', 
                        opacity: '0' 
                    },
                    '100%': { 
                        transform: 'scale(1)', 
                        opacity: '1' 
                    }
                }
            },
            fontFamily: {
                'sans': ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
            },
            backdropBlur: {
                xs: '2px',
            },
            boxShadow: {
                'dark': '0 10px 25px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.15)',
                'dark-lg': '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
            }
        }
    },
    plugins: [
        // Custom plugin for dark mode utilities
        function({ addUtilities, theme }) {
            addUtilities({
                '.dark-card': {
                    backgroundColor: theme('colors.gray.800'),
                    borderColor: theme('colors.gray.600'),
                    color: theme('colors.gray.100'),
                },
                '.dark-input': {
                    backgroundColor: theme('colors.gray.700'),
                    borderColor: theme('colors.gray.600'),
                    color: theme('colors.white'),
                    '&::placeholder': {
                        color: theme('colors.gray.400'),
                    },
                    '&:focus': {
                        borderColor: theme('colors.blue.500'),
                        boxShadow: `0 0 0 1px ${theme('colors.blue.500')}`,
                    }
                },
                '.glass-effect': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                },
                '.dark-glass-effect': {
                    backgroundColor: 'rgba(0, 0, 0, 0.2)',
                    backdropFilter: 'blur(10px)',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                }
            })
        }
    ]
}
