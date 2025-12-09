/**
 * CSS Animation Utilities
 * Add smooth transitions and micro-interactions throughout the site
 */

// Add to globals.css or use in Tailwind config

export const animations = {
  // Fade animations
  fadeIn: 'animate-fadeIn',
  fadeOut: 'animate-fadeOut',
  fadeInUp: 'animate-fadeInUp',
  fadeInDown: 'animate-fadeInDown',
  
  // Slide animations
  slideInLeft: 'animate-slideInLeft',
  slideInRight: 'animate-slideInRight',
  slideInUp: 'animate-slideInUp',
  slideInDown: 'animate-slideInDown',
  
  // Scale animations
  scaleIn: 'animate-scaleIn',
  scaleOut: 'animate-scaleOut',
  pulse: 'animate-pulse',
  
  // Bounce animations
  bounce: 'animate-bounce',
  bounceIn: 'animate-bounceIn',
  
  // Shake animation
  shake: 'animate-shake',
  
  // Spin animation
  spin: 'animate-spin',
};

// Tailwind animation classes to add to tailwind.config.ts:
export const tailwindAnimations = {
  extend: {
    keyframes: {
      fadeIn: {
        '0%': { opacity: '0' },
        '100%': { opacity: '1' },
      },
      fadeOut: {
        '0%': { opacity: '1' },
        '100%': { opacity: '0' },
      },
      fadeInUp: {
        '0%': { opacity: '0', transform: 'translateY(20px)' },
        '100%': { opacity: '1', transform: 'translateY(0)' },
      },
      fadeInDown: {
        '0%': { opacity: '0', transform: 'translateY(-20px)' },
        '100%': { opacity: '1', transform: 'translateY(0)' },
      },
      slideInLeft: {
        '0%': { transform: 'translateX(-100%)' },
        '100%': { transform: 'translateX(0)' },
      },
      slideInRight: {
        '0%': { transform: 'translateX(100%)' },
        '100%': { transform: 'translateX(0)' },
      },
      slideInUp: {
        '0%': { transform: 'translateY(100%)' },
        '100%': { transform: 'translateY(0)' },
      },
      slideInDown: {
        '0%': { transform: 'translateY(-100%)' },
        '100%': { transform: 'translateY(0)' },
      },
      scaleIn: {
        '0%': { transform: 'scale(0)', opacity: '0' },
        '100%': { transform: 'scale(1)', opacity: '1' },
      },
      scaleOut: {
        '0%': { transform: 'scale(1)', opacity: '1' },
        '100%': { transform: 'scale(0)', opacity: '0' },
      },
      bounceIn: {
        '0%': { transform: 'scale(0.3)', opacity: '0' },
        '50%': { transform: 'scale(1.05)' },
        '70%': { transform: 'scale(0.9)' },
        '100%': { transform: 'scale(1)', opacity: '1' },
      },
      shake: {
        '0%, 100%': { transform: 'translateX(0)' },
        '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-5px)' },
        '20%, 40%, 60%, 80%': { transform: 'translateX(5px)' },
      },
    },
    animation: {
      fadeIn: 'fadeIn 0.5s ease-in-out',
      fadeOut: 'fadeOut 0.5s ease-in-out',
      fadeInUp: 'fadeInUp 0.6s ease-out',
      fadeInDown: 'fadeInDown 0.6s ease-out',
      slideInLeft: 'slideInLeft 0.5s ease-out',
      slideInRight: 'slideInRight 0.5s ease-out',
      slideInUp: 'slideInUp 0.5s ease-out',
      slideInDown: 'slideInDown 0.5s ease-out',
      scaleIn: 'scaleIn 0.3s ease-out',
      scaleOut: 'scaleOut 0.3s ease-out',
      bounceIn: 'bounceIn 0.6s ease-out',
      shake: 'shake 0.5s ease-in-out',
    },
  },
};

// Usage example in components:
// <div className="animate-fadeInUp hover:animate-pulse transition-all duration-300">
//   Content here
// </div>
