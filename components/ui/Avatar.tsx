'use client';

/**
 * Avatar component
 * Displays user image or initials with colored background
 */

export interface AvatarProps {
  name: string;
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  imageUrl?: string | null;
  className?: string;
}

const sizeClasses = {
  small: 'w-8 h-8 text-xs',
  medium: 'w-12 h-12 text-sm',
  large: 'w-16 h-16 text-base',
  xlarge: 'w-24 h-24 text-xl',
};

/**
 * Generate initials from name
 */
function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}

/**
 * Generate color based on name hash
 */
function getColorFromName(name: string): string {
  const colors = [
    'bg-primary text-white',
    'bg-secondary text-primary',
    'bg-purple-500 text-white',
    'bg-pink-500 text-white',
    'bg-blue-500 text-white',
    'bg-green-500 text-white',
    'bg-orange-500 text-white',
    'bg-red-500 text-white',
  ];

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

export default function Avatar({ name, size = 'medium', imageUrl, className = '' }: AvatarProps) {
  const initials = getInitials(name);
  const colorClass = getColorFromName(name);
  const sizeClass = sizeClasses[size];

  if (imageUrl) {
    return (
      <div className={`${sizeClass} rounded-full overflow-hidden ${className}`}>
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback to initials if image fails to load
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            const parent = target.parentElement;
            if (parent) {
              parent.innerHTML = `<div class="w-full h-full flex items-center justify-center ${colorClass} rounded-full">${initials}</div>`;
            }
          }}
        />
      </div>
    );
  }

  return (
    <div
      className={`${sizeClass} ${colorClass} rounded-full flex items-center justify-center font-semibold ${className}`}
    >
      {initials}
    </div>
  );
}


