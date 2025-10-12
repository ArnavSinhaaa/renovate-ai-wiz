/**
 * Fixfy Logo component
 * Displays the Fixfy brand logo image
 */

import React from 'react';

interface FixfyLogoProps {
  /** Size of the logo */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Whether to show the text along with the icon */
  showText?: boolean;
  /** CSS classes for styling */
  className?: string;
  /** Color theme */
  variant?: 'light' | 'dark' | 'primary';
}

/**
 * Fixfy Logo component
 * @param props - Component props
 * @returns JSX element containing the Fixfy logo
 */
export const FixfyLogo: React.FC<FixfyLogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
  variant = 'primary'
}) => {
  // Size configurations
  const sizeConfig = {
    sm: { container: 'w-16 h-16', text: 'text-sm' },
    md: { container: 'w-20 h-20', text: 'text-lg' },
    lg: { container: 'w-24 h-24', text: 'text-2xl' },
    xl: { container: 'w-32 h-32', text: 'text-4xl' }
  };

  // Color configurations for text
  const colorConfig = {
    light: 'text-gray-600',
    dark: 'text-gray-300',
    primary: 'text-cyan-500'
  };

  const containerSize = sizeConfig[size].container;
  const textSize = sizeConfig[size].text;
  const textColor = colorConfig[variant];

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Fixfy Logo - Using the exact image */}
      <div className={`${containerSize} relative flex-shrink-0`}>
        <img
          src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSJibGFjayIvPgo8cGF0aCBkPSJNNTAgNTBMMTAwIDI1TDE1MCA1MFYxMjVIMTI1VjEwMEg3NVYxMjVINTVWNTBaIiBzdHJva2U9IiMwNmI2ZDQiIHN0cm9rZS13aWR0aD0iNCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBmaWxsPSJub25lIi8+CjxwYXRoIGQ9Ik03NSAxMDBDODUgOTAgOTUgODAgMTA1IDcwIiBzdHJva2U9IiMwNmI2ZDQiIHN0cm9rZS13aWR0aD0iMyIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+CjxjaXJjbGUgY3g9IjEwNSIgY3k9IjcwIiByPSI0IiBmaWxsPSIjMDZiNmQ0Ii8+CjxwYXRoIGQ9Ik0xMjUgMTAwQzEzNSA5MCAxNDUgODAgMTU1IDcwIiBzdHJva2U9IiMwNmI2ZDQiIHN0cm9rZS13aWR0aD0iMyIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+CjxjaXJjbGUgY3g9IjE1NSIgY3k9IjcwIiByPSI0IiBmaWxsPSIjMDZiNmQ0Ii8+CjxwYXRoIGQ9Ik0xNDUgODBDMTU1IDkwIDE2NSAxMDAgMTc1IDExMCIgc3Ryb2tlPSIjMDZiNmQ0IiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgo8Y2lyY2xlIGN4PSIxNzUiIGN5PSIxMTAiIHI9IjMiIGZpbGw9IiMwNmI2ZDQiLz4KPHRleHQgeD0iMTAwIiB5PSIxNjAiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIyNCIgZmlsbD0iI2ZmZmZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+Rml4Znk8L3RleHQ+Cjwvc3ZnPgo="
          alt="Fixfy Logo"
          className="w-full h-full object-contain"
          onError={(e) => {
            // Fallback to SVG if image fails to load
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            const fallback = document.createElement('div');
            fallback.className = 'w-full h-full flex items-center justify-center';
            fallback.innerHTML = `
              <svg viewBox="0 0 200 200" class="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="200" height="200" fill="black"/>
                <path d="M50 50L100 25L150 50V125H125V100H75V125H55V50Z" stroke="#06b6d4" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
                <path d="M75 100C85 90 95 80 105 70" stroke="#06b6d4" stroke-width="3" stroke-linecap="round"/>
                <circle cx="105" cy="70" r="4" fill="#06b6d4"/>
                <path d="M125 100C135 90 145 80 155 70" stroke="#06b6d4" stroke-width="3" stroke-linecap="round"/>
                <circle cx="155" cy="70" r="4" fill="#06b6d4"/>
                <path d="M145 80C155 90 165 100 175 110" stroke="#06b6d4" stroke-width="2" stroke-linecap="round"/>
                <circle cx="175" cy="110" r="3" fill="#06b6d4"/>
                <text x="100" y="160" font-family="Arial, sans-serif" font-size="24" fill="#ffffff" text-anchor="middle">Fixfy</text>
              </svg>
            `;
            target.parentNode?.appendChild(fallback);
          }}
        />
      </div>

      {/* Brand Text */}
      {showText && (
        <span className={`font-bold font-sans ${textSize} ${textColor}`}>
          Fixfy
        </span>
      )}
    </div>
  );
};

export default FixfyLogo;
