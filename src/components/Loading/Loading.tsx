import React from 'react';

export interface LoadingProps {
    size?: 'sm' | 'md' | 'lg' | 'xl';
    variant?: 'spinner' | 'dots' | 'pulse' | 'bars' | 'ripple';
    color?: string; // Hex color (e.g., "#3B82F6") or Tailwind class (e.g., "blue-500")
    fullScreen?: boolean;
    text?: string;
    className?: string;
}

const Loading: React.FC<LoadingProps> = ({
                                             size = 'md',
                                             variant = 'spinner',
                                             color = 'primary-color', // Default to Tailwind blue-500
                                             fullScreen = false,
                                             text,
                                             className = '',
                                         }) => {
    // Check if color is a hex value or Tailwind class
    const isHexColor = color.startsWith('#');

    // Generate Tailwind classes for non-hex colors
    const getColorClasses = (property: string) => {
        if (isHexColor) return '';
        return {
            text: `text-${color}`,
            bg: `bg-${color}`,
            border: `border-${color}`,
            borderTop: `border-t-${color}`,
            borderRight: `border-r-${color}`,
        }[property] || '';
    };

    // Get inline styles for hex colors
    const getColorStyle = (property: string) => {
        if (!isHexColor) return {};
        const styleMap: Record<string, string> = {
            color: 'color',
            backgroundColor: 'backgroundColor',
            borderColor: 'borderColor',
            borderTopColor: 'borderTopColor',
            borderRightColor: 'borderRightColor',
        };
        return { [styleMap[property]]: color };
    };
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-8 h-8',
        lg: 'w-12 h-12',
        xl: 'w-16 h-16',
    };

    const textSizeClasses = {
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-base',
        xl: 'text-lg',
    };

    const SpinnerLoader = () => (
        <div className="relative">
            <div
                className={`${sizeClasses[size]} border-4 border-gray-200 rounded-full animate-spin ${
                    !isHexColor ? getColorClasses('borderTop') : ''
                }`}
                style={isHexColor ? { borderTopColor: color } : {}}
            />
            <div
                className={`absolute inset-0 ${sizeClasses[size]} border-4 border-transparent rounded-full animate-spin ${
                    !isHexColor ? getColorClasses('borderRight') : ''
                }`}
                style={isHexColor ? { borderRightColor: color, animationDirection: 'reverse', animationDuration: '0.75s' } : { animationDirection: 'reverse', animationDuration: '0.75s' }}
            />
        </div>
    );

    const DotsLoader = () => (
        <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
                <div
                    key={i}
                    className={`${size === 'sm' ? 'w-2 h-2' : size === 'md' ? 'w-3 h-3' : size === 'lg' ? 'w-4 h-4' : 'w-5 h-5'} rounded-full animate-bounce ${
                        !isHexColor ? getColorClasses('bg') : ''
                    }`}
                    style={isHexColor ? {
                        backgroundColor: color,
                        animationDelay: `${i * 0.2}s`,
                        animationDuration: '1.4s'
                    } : {
                        animationDelay: `${i * 0.2}s`,
                        animationDuration: '1.4s'
                    }}
                />
            ))}
        </div>
    );

    const PulseLoader = () => (
        <div className="relative">
            <div
                className={`${sizeClasses[size]} rounded-full animate-pulse ${
                    !isHexColor ? getColorClasses('bg') : ''
                }`}
                style={isHexColor ? { backgroundColor: color } : {}}
            />
            <div
                className={`absolute inset-0 ${sizeClasses[size]} rounded-full animate-ping opacity-30 ${
                    !isHexColor ? getColorClasses('bg') : ''
                }`}
                style={isHexColor ? { backgroundColor: color } : {}}
            />
        </div>
    );

    const BarsLoader = () => (
        <div className="flex space-x-1 items-end">
            {[0, 1, 2, 3].map((i) => (
                <div
                    key={i}
                    className={`${size === 'sm' ? 'w-1' : size === 'md' ? 'w-1.5' : size === 'lg' ? 'w-2' : 'w-2.5'} rounded-sm animate-pulse ${
                        !isHexColor ? getColorClasses('bg') : ''
                    }`}
                    style={isHexColor ? {
                        backgroundColor: color,
                        height: `${20 + i * 10}px`,
                        animationDelay: `${i * 0.15}s`,
                        animationDuration: '1.2s'
                    } : {
                        height: `${20 + i * 10}px`,
                        animationDelay: `${i * 0.15}s`,
                        animationDuration: '1.2s'
                    }}
                />
            ))}
        </div>
    );

    const RippleLoader = () => (
        <div className="relative">
            <div
                className={`${sizeClasses[size]} border-4 rounded-full animate-ping ${
                    !isHexColor ? getColorClasses('border') : ''
                }`}
                style={isHexColor ? { borderColor: color } : {}}
            />
            <div
                className={`absolute inset-2 border-4 rounded-full animate-ping ${
                    !isHexColor ? getColorClasses('border') : ''
                }`}
                style={isHexColor ? {
                    borderColor: color,
                    animationDelay: '0.5s'
                } : {
                    animationDelay: '0.5s'
                }}
            />
        </div>
    );

    const getLoader = () => {
        switch (variant) {
            case 'dots':
                return <DotsLoader />;
            case 'pulse':
                return <PulseLoader />;
            case 'bars':
                return <BarsLoader />;
            case 'ripple':
                return <RippleLoader />;
            default:
                return <SpinnerLoader />;
        }
    };

    const content = (
        <div className={`flex flex-col items-center justify-center space-y-3 ${className}`}>
            {getLoader()}
            {text && (
                <p
                    className={`${textSizeClasses[size]} font-medium animate-pulse ${
                        !isHexColor ? getColorClasses('text') : ''
                    }`}
                    style={isHexColor ? { color } : {}}
                >
                    {text}
                </p>
            )}
        </div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
                {content}
            </div>
        );
    }

    return content;
};

export default Loading;
// Demo component to showcase different variants
export const LoadingDemo: React.FC = () => {
    const [selectedColor, setSelectedColor] = React.useState('blue-500');
    const [selectedVariant, setSelectedVariant] = React.useState<LoadingProps['variant']>('spinner');
    const [selectedSize, setSelectedSize] = React.useState<LoadingProps['size']>('md');
    const [showFullScreen, setShowFullScreen] = React.useState(false);

    const colors = [
        { name: 'Blue', value: 'blue-500', hex: '#3B82F6' },
        { name: 'Purple', value: 'purple-500', hex: '#8B5CF6' },
        { name: 'Green', value: 'green-500', hex: '#10B981' },
        { name: 'Red', value: 'red-500', hex: '#EF4444' },
        { name: 'Orange', value: 'orange-500', hex: '#F59E0B' },
        { name: 'Pink', value: 'pink-500', hex: '#EC4899' },
        { name: 'Indigo', value: 'indigo-500', hex: '#6366F1' },
        { name: 'Teal', value: 'teal-500', hex: '#14B8A6' },
    ];

    const variants: LoadingProps['variant'][] = ['spinner', 'dots', 'pulse', 'bars', 'ripple'];
    const sizes: LoadingProps['size'][] = ['sm', 'md', 'lg', 'xl'];

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
                Modern Loading Component
            </h1>

            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">Customization</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">Color</label>
                        <div className="flex flex-wrap gap-2">
                            {colors.map((colorOption) => (
                                <button
                                    key={colorOption.value}
                                    onClick={() => setSelectedColor(colorOption.value)}
                                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                                        selectedColor === colorOption.value ? 'border-gray-400 scale-110' : 'border-gray-200'
                                    }`}
                                    style={{ backgroundColor: colorOption.hex }}
                                    title={`${colorOption.name} (${colorOption.value})`}
                                />
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">Variant</label>
                        <select
                            value={selectedVariant}
                            onChange={(e) => setSelectedVariant(e.target.value as LoadingProps['variant'])}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            {variants.map((variant) => (
                                <option key={variant} value={variant}>
                                    {variant && (variant?.charAt(0).toUpperCase() + variant?.slice(1))}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">Size</label>
                        <select
                            value={selectedSize}
                            onChange={(e) => setSelectedSize(e.target.value as LoadingProps['size'])}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            {sizes.map((size) => (
                                <option key={size} value={size}>
                                    {size?.toUpperCase()}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">Full Screen</label>
                        <button
                            onClick={() => setShowFullScreen(true)}
                            className="w-full p-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                        >
                            Demo Full Screen
                        </button>
                    </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-8 flex flex-col items-center justify-center min-h-32">
                    <Loading
                        variant={selectedVariant}
                        size={selectedSize}
                        color={selectedColor}
                        text="Loading..."
                    />
                    <div className="mt-4 p-3 bg-white rounded-md shadow-sm">
                        <code className="text-sm text-gray-600">
                            color="{selectedColor}"
                        </code>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">All Variants</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    {variants.map((variant) => (
                        <div key={variant} className="text-center">
                            <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-center h-24 mb-2">
                                <Loading variant={variant} color={selectedColor} />
                            </div>
                            <p className="text-sm text-gray-600 capitalize">{variant}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-semibold text-blue-800 mb-2">Usage Examples:</h3>
                    <div className="space-y-2 text-sm">
                        <div className="bg-white p-2 rounded border">
                            <code className="text-blue-600">{"// Tailwind CSS class"}</code><br/>
                            <code>{`<Loading color="primary-500" />`}</code>
                        </div>
                        <div className="bg-white p-2 rounded border">
                            <code className="text-blue-600">{"// Hex color"}</code><br/>
                            <code>{`<Loading color="#your-brand-color" />`}</code>
                        </div>
                        <div className="bg-white p-2 rounded border">
                            <code className="text-blue-600">{"// Custom Tailwind color"}</code><br/>
                            <code>{`<Loading color="emerald-400" variant="dots" />`}</code>
                        </div>
                    </div>
                </div>
            </div>

            {showFullScreen && (
                <Loading
                    variant={selectedVariant}
                    size={selectedSize}
                    color={selectedColor}
                    text="Loading in full screen..."
                    fullScreen
                />
            )}

            {showFullScreen && (
                <button
                    onClick={() => setShowFullScreen(false)}
                    className="fixed top-4 right-4 z-50 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
                >
                    Close Full Screen
                </button>
            )}
        </div>
    );
};