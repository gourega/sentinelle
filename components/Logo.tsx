
import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
  animated?: boolean;
}

const Logo: React.FC<LogoProps> = ({ className = "", size = 48, animated = false }) => {
  return (
    <div 
      className={`relative flex items-center justify-center ${className}`} 
      style={{ width: size, height: size }}
    >
      <svg 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className={`w-full h-full ${animated ? 'animate-pulse-slow' : ''}`}
      >
        {/* Outer Shield / Leaf Shape */}
        <path 
          d="M50 5C30 5 10 25 10 50C10 75 30 95 50 95C70 95 90 75 90 50C90 25 70 5 50 5Z" 
          fill="url(#logo-gradient)" 
          className="drop-shadow-[0_0_10px_rgba(19,236,109,0.5)]"
        />
        
        {/* Inner Leaf Detail */}
        <path 
          d="M50 15C65 15 80 30 80 50C80 70 65 85 50 85C35 85 20 70 20 50C20 30 35 15 50 15Z" 
          fill="#102218" 
          fillOpacity="0.4"
        />

        {/* The "Eye" / Lens Center */}
        <circle cx="50" cy="50" r="12" fill="white" fillOpacity="0.9" />
        <circle cx="50" cy="50" r="6" fill="#102218" />
        
        {/* Glint */}
        <circle cx="53" cy="47" r="2" fill="white" />

        <defs>
          <linearGradient id="logo-gradient" x1="10" y1="5" x2="90" y2="95" gradientUnits="userSpaceOnUse">
            <stop stopColor="#13ec6d" />
            <stop offset="1" stopColor="#0ea34d" />
          </linearGradient>
        </defs>
      </svg>
      
      {animated && (
        <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl animate-pulse"></div>
      )}
    </div>
  );
};

export default Logo;
