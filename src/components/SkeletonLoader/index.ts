// Main component export
export { default as SkeletonLoader } from './SkeletonLoader';

// Preset component exports
export {
    SkeletonText,
    SkeletonAvatar,
    SkeletonButton,
    SkeletonCard,
    SkeletonImage,
} from './SkeletonLoader';

// Compound component exports
export {
    SkeletonProfile,
    SkeletonList,
    SkeletonTable,
} from './SkeletonLoader';

// Type exports
export type {
    SkeletonLoaderProps,
    SkeletonVariant,
    SkeletonAnimation,
    SkeletonSize,
} from './SkeletonLoader';

// Re-export everything as named exports for flexibility
export * from './SkeletonLoader';

// Default export for convenience
import SkeletonLoader from './SkeletonLoader';
export default SkeletonLoader;

// Version and metadata
export const SKELETON_LOADER_VERSION = '1.0.0';

// Utility types for consumers
export interface SkeletonLoaderModule {
    SkeletonLoader: typeof SkeletonLoader;
    SkeletonText: typeof import('./SkeletonLoader').SkeletonText;
    SkeletonAvatar: typeof import('./SkeletonLoader').SkeletonAvatar;
    SkeletonButton: typeof import('./SkeletonLoader').SkeletonButton;
    SkeletonCard: typeof import('./SkeletonLoader').SkeletonCard;
    SkeletonImage: typeof import('./SkeletonLoader').SkeletonImage;
    SkeletonProfile: typeof import('./SkeletonLoader').SkeletonProfile;
    SkeletonList: typeof import('./SkeletonLoader').SkeletonList;
    SkeletonTable: typeof import('./SkeletonLoader').SkeletonTable;
}

// Preset configurations for easy customization
export const SKELETON_PRESETS = {
    sizes: {
        xs: { width: '4rem', height: '1rem' },
        sm: { width: '6rem', height: '1.25rem' },
        md: { width: '8rem', height: '1.5rem' },
        lg: { width: '12rem', height: '2rem' },
        xl: { width: '16rem', height: '2.5rem' },
    },
    variants: [
        'text',
        'rectangular',
        'circular',
        'rounded',
        'card',
        'avatar',
        'button',
        'image',
        'line',
    ] as const,
    animations: [
        'pulse',
        'wave',
        'none',
    ] as const,
    intensities: [
        'light',
        'medium',
        'dark',
    ] as const,
} as const;


// Common skeleton patterns
export const SKELETON_PATTERNS = {
    userProfile: {
        variant: 'avatar' as const,
        size: 'lg' as const,
        animation: 'pulse' as const,
    },
    cardTitle: {
        variant: 'text' as const,
        width: '75%',
        height: '1.5rem',
    },
    cardDescription: {
        variant: 'text' as const,
        count: 2,
        width: '100%',
        height: '1rem',
        intensity: 'light' as const,
    },
    button: {
        variant: 'button' as const,
        animation: 'wave' as const,
    },
    image: {
        variant: 'image' as const,
        shimmer: true,
    },
} as const;