// SkeletonLoader.tsx
import React from 'react';
import Card from "../Cards/Card";

// Internal CSS styles
const skeletonStyles = `
  @keyframes wave {
    0% { transform: translateX(-100%); }
    50% { transform: translateX(100%); }
    100% { transform: translateX(100%); }
  }

  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }

  .skeleton-wave {
    animation: wave 1.6s linear infinite;
    position: relative;
    overflow: hidden;
  }

  .skeleton-shimmer {
    animation: shimmer 2s ease-in-out infinite;
    background-size: 200% 100%;
  }

  .skeleton-wave::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.6),
      transparent
    );
    animation: wave 1.6s linear infinite;
  }
`;

// Inject styles into head if not already present
const injectStyles = () => {
    if (typeof document !== 'undefined' && !document.getElementById('skeleton-loader-styles')) {
        const styleElement = document.createElement('style');
        styleElement.id = 'skeleton-loader-styles';
        styleElement.textContent = skeletonStyles;
        document.head.appendChild(styleElement);
    }
};

export type SkeletonVariant =
    | 'text'
    | 'rectangular'
    | 'circular'
    | 'rounded'
    | 'card'
    | 'avatar'
    | 'button'
    | 'image'
    | 'line';

export type SkeletonAnimation = 'pulse' | 'wave' | 'none';

export type SkeletonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface SkeletonLoaderProps {
    /** Variant of the skeleton */
    variant?: SkeletonVariant;
    /** Animation type */
    animation?: SkeletonAnimation;
    /** Predefined size (overridden by width/height if provided) */
    size?: SkeletonSize;
    /** Custom width */
    width?: string | number;
    /** Custom height */
    height?: string | number;
    /** Number of skeleton items to render */
    count?: number;
    /** Additional CSS classes */
    className?: string;
    /** Whether to show shimmer effect */
    shimmer?: boolean;
    /** Custom border radius */
    borderRadius?: string;
    /** Background color intensity */
    intensity?: 'light' | 'medium' | 'dark';
    /** Delay before showing skeleton (in ms) */
    delay?: number;
}

// Predefined size configurations
const sizeConfig = {
    xs: { width: '4rem', height: '1rem' },
    sm: { width: '6rem', height: '1.25rem' },
    md: { width: '8rem', height: '1.5rem' },
    lg: { width: '12rem', height: '2rem' },
    xl: { width: '16rem', height: '2.5rem' },
};

// Variant-specific configurations
const variantConfig = {
    text: {
        baseClasses: 'rounded',
        defaultSize: { width: '100%', height: '1rem' }
    },
    rectangular: {
        baseClasses: '',
        defaultSize: { width: '100%', height: '8rem' }
    },
    circular: {
        baseClasses: 'rounded-full aspect-square',
        defaultSize: { width: '3rem', height: '3rem' }
    },
    rounded: {
        baseClasses: 'rounded-lg',
        defaultSize: { width: '100%', height: '6rem' }
    },
    card: {
        baseClasses: 'rounded-lg',
        defaultSize: { width: '100%', height: '12rem' }
    },
    avatar: {
        baseClasses: 'rounded-full aspect-square',
        defaultSize: { width: '2.5rem', height: '2.5rem' }
    },
    button: {
        baseClasses: 'rounded-md',
        defaultSize: { width: '5rem', height: '2.25rem' }
    },
    image: {
        baseClasses: 'rounded',
        defaultSize: { width: '100%', height: '10rem' }
    },
    line: {
        baseClasses: 'rounded-full',
        defaultSize: { width: '100%', height: '0.25rem' }
    },
};

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
                                                           variant = 'text',
                                                           animation = 'pulse',
                                                           size,
                                                           width,
                                                           height,
                                                           count = 1,
                                                           className = '',
                                                           shimmer = false,
                                                           borderRadius,
                                                           intensity = 'medium',
                                                           delay = 0,
                                                       }) => {
    const [shouldShow, setShouldShow] = React.useState(delay === 0);

    React.useEffect(() => {
        injectStyles();
    }, []);

    // Get variant configuration
    const config = variantConfig[variant];

    // Determine dimensions
    const dimensions = React.useMemo(() => {
        let finalWidth: string;
        let finalHeight: string;

        if (width !== undefined) {
            finalWidth = typeof width === 'number' ? `${width}px` : width;
        } else if (size) {
            finalWidth = sizeConfig[size].width;
        } else {
            finalWidth = config.defaultSize.width;
        }

        if (height !== undefined) {
            finalHeight = typeof height === 'number' ? `${height}px` : height;
        } else if (size) {
            finalHeight = sizeConfig[size].height;
        } else {
            finalHeight = config.defaultSize.height;
        }

        return { width: finalWidth, height: finalHeight };
    }, [width, height, size, config]);

    React.useEffect(() => {
        if (delay > 0) {
            const timer = setTimeout(() => setShouldShow(true), delay);
            return () => clearTimeout(timer);
        }
    }, [delay]);

    if (!shouldShow) {
        return null;
    }

    // Build CSS classes
    const getSkeletonClasses = () => {
        const baseClasses = [
            'block',
            'bg-gray-200',
            config.baseClasses,
        ];

        // Animation classes
        if (animation === 'pulse') {
            baseClasses.push('animate-pulse');
        } else if (animation === 'wave') {
            baseClasses.push('animate-wave');
        }

        // Intensity classes
        switch (intensity) {
            case 'light':
                baseClasses.push('bg-gray-100');
                break;
            case 'medium':
                baseClasses.push('bg-gray-200');
                break;
            case 'dark':
                baseClasses.push('bg-gray-300');
                break;
        }

        // Shimmer effect
        if (shimmer) {
            baseClasses.push('bg-gradient-to-r', 'from-gray-200', 'via-gray-100', 'to-gray-200', 'bg-200%', 'animate-shimmer');
        }

        return baseClasses.join(' ');
    };

    // Build inline styles
    const getSkeletonStyles = (): React.CSSProperties => {
        const styles: React.CSSProperties = {
            width: dimensions.width,
            height: dimensions.height,
        };

        if (borderRadius) {
            styles.borderRadius = borderRadius;
        }

        return styles;
    };

    // Render single skeleton
    const renderSkeleton = (index: number) => (
        <div
            key={index}
            className={`${getSkeletonClasses()} ${className}`}
            style={getSkeletonStyles()}
            aria-hidden="true"
        />
    );

    // Render multiple skeletons
    if (count > 1) {
        return (
            <div className="space-y-2">
                {Array.from({ length: count }, (_, index) => renderSkeleton(index))}
            </div>
        );
    }

    return renderSkeleton(0);
};

export default SkeletonLoader;

// Preset Components for common use cases
export const SkeletonText: React.FC<Omit<SkeletonLoaderProps, 'variant'>> = (props) => (
    <SkeletonLoader {...props} variant="text" />
);

export const SkeletonAvatar: React.FC<Omit<SkeletonLoaderProps, 'variant'>> = (props) => (
    <SkeletonLoader {...props} variant="avatar" />
);

export const SkeletonButton: React.FC<Omit<SkeletonLoaderProps, 'variant'>> = (props) => (
    <SkeletonLoader {...props} variant="button" />
);

export const SkeletonCard: React.FC<Omit<SkeletonLoaderProps, 'variant'>> = (props) => (
    <SkeletonLoader {...props} variant="card" />
);

export const SkeletonImage: React.FC<Omit<SkeletonLoaderProps, 'variant'>> = (props) => (
    <SkeletonLoader {...props} variant="image" />
);

// Compound Components for complex layouts
export const SkeletonProfile: React.FC<{ showBio?: boolean }> = ({ showBio = true }) => (
    <div className="flex items-start space-x-4">
        <SkeletonAvatar size="lg" />
        <div className="flex-1 space-y-2">
            <SkeletonText width="60%" height="1.25rem" />
            <SkeletonText width="40%" height="1rem" intensity="light" />
            {showBio && (
                <div className="space-y-1 pt-2">
                    <SkeletonText width="100%" />
                    <SkeletonText width="80%" />
                    <SkeletonText width="90%" />
                </div>
            )}
        </div>
    </div>
);

export const SkeletonList: React.FC<{
    itemCount?: number;
    showAvatar?: boolean;
    showMeta?: boolean;
}> = ({
          itemCount = 3,
          showAvatar = true,
          showMeta = true
      }) => (
    <div className="space-y-4">
        {Array.from({ length: itemCount }, (_, index) => (
            <div key={index} className="flex items-start space-x-3">
                {showAvatar && <SkeletonAvatar />}
                <div className="flex-1 space-y-2">
                    <SkeletonText width="75%" height="1.125rem" />
                    <SkeletonText width="100%" height="0.875rem" intensity="light" />
                    {showMeta && (
                        <div className="flex space-x-4">
                            <SkeletonText width="3rem" height="0.75rem" intensity="light" />
                            <SkeletonText width="4rem" height="0.75rem" intensity="light" />
                        </div>
                    )}
                </div>
            </div>
        ))}
    </div>
);

export const SkeletonTable: React.FC<{
    rows?: number;
    columns?: number;
    showHeader?: boolean;
}> = ({
          rows = 5,
          columns = 4,
          showHeader = true
      }) => (
    <div className="space-y-3">
        {showHeader && (
            <div className="flex space-x-4">
                {Array.from({ length: columns }, (_, index) => (
                    <SkeletonText key={index} width="100%" height="1rem" intensity="dark" />
                ))}
            </div>
        )}
        <div className="space-y-2">
            {Array.from({ length: rows }, (_, rowIndex) => (
                <div key={rowIndex} className="flex space-x-4">
                    {Array.from({ length: columns }, (_, colIndex) => (
                        <SkeletonText key={colIndex} width="100%" height="0.875rem" />
                    ))}
                </div>
            ))}
        </div>
    </div>
);

export const CardStatsSkeleton = () => (
    <Card>
        <div className='mb-4'>
            <SkeletonText width='180px' height='28px' />
        </div>
        <div className='mt-4 grid grid-cols-1 gap-4'>
            <div className='rounded-lg bg-blue-50 p-4'>
                <SkeletonText width='40px' height='32px' className='mb-1' />
                <SkeletonText width='100px' height='16px' />
            </div>
            <div className='rounded-lg bg-green-50 p-4'>
                <SkeletonText width='40px' height='32px' className='mb-1' />
                <SkeletonText width='110px' height='16px' />
            </div>
            <div className='rounded-lg bg-yellow-50 p-4'>
                <SkeletonText width='40px' height='32px' className='mb-1' />
                <SkeletonText width='120px' height='16px' />
            </div>
        </div>
    </Card>
);

export const SkeletonLoaderExample = () => {
    return (
        <div className="bg-white p-5">
            <SkeletonLoader variant="text" width="200px" />

            <SkeletonLoader variant="text" count={3} />

            <SkeletonAvatar size="lg" />
            <SkeletonButton animation="wave" />

            <SkeletonProfile showBio={true} />
            <SkeletonList itemCount={5} showAvatar={true} />
            <SkeletonTable rows={5} columns={4} />

            <SkeletonLoader
                variant="card"
                shimmer={true}
                intensity="dark"
                borderRadius="12px"
                className="custom-skeleton"
            />
        </div>
    )
}