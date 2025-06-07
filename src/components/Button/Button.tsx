import { FC, ReactNode } from "react";
import classNames from "classnames";

export interface ButtonProps {
    /** The content of the button */
    children: ReactNode;

    /** Click handler function */
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;

    /** HTML button type attribute */
    type?: "button" | "submit" | "reset";

    /** Size of the button */
    size?: "small" | "medium" | "large" | "sm" | "md" | "lg";

    /** Visual style variant */
    variant?: "primary" | "secondary" | "dark" | "neutral";

    /** Disabled state of the button */
    disabled?: boolean;

    /** Additional CSS classes */
    className?: string;

    /** Optional icon to display before text */
    icon?: ReactNode;

    /** Loading state - shows spinner */
    loading?: boolean;

    /** Outline style instead of solid */
    outline?: boolean;

    /** Position of the icon relative to text */
    iconPosition?: "left" | "right";
}

const Button: FC<ButtonProps> = ({
                                     children,
                                     onClick,
                                     type = "button",
                                     size = "medium",
                                     variant = "primary",
                                     disabled = false,
                                     className,
                                     icon,
                                     loading = false,
                                     outline = false,
    iconPosition = "left",
                                 }) => {
    const baseClasses =
        "rounded-xl text-sm transition-all font-semibold duration-300 inline-flex items-center justify-center ease-in-out";
    const sizeClasses = {
        small: "px-5 py-2 text-sm",
        sm: "px-5 py-2 text-sm",
        medium: "px-6 py-3 text-md",
        md: "px-6 py-3 text-md",
        large: "px-8 py-4 text-lg",
        lg: "px-8 py-4 text-lg",
    };

    const variantClasses = {
        primary: {
            solid: "bg-primary text-white hover:bg-white hover:text-primary border border-primary",
            outline: "bg-transparent text-primary hover:bg-primary hover:text-white border border-primary"
        },
        secondary: {
            solid: "bg-secondary text-white hover:bg-white hover:text-secondary border border-secondary",
            outline: "bg-transparent text-secondary hover:bg-secondary hover:text-white border border-secondary"
        },
        dark: {
            solid: "bg-dark text-white hover:bg-primary hover:border-primary border border-dark",
            outline: "bg-transparent text-dark hover:bg-dark hover:text-white border border-dark"
        },
        neutral: {
            solid: "bg-white text-gray-700 hover:bg-gray-700 hover:text-white border border-gray-300",
            outline: "bg-transparent text-gray-700 hover:bg-gray-200 border border-gray-300"
        }
    };

    const spinnerClasses = classNames(
        "animate-spin -ml-1 mr-3",
        {
            "h-4 w-4": size === "small",
            "h-5 w-5": size === "medium",
            "h-6 w-6": size === "large",
        },
        variant === "primary" ? "text-white" : "text-primary"
    );

    const classes = classNames(
        baseClasses,
        sizeClasses[size],
        variantClasses[variant][outline ? 'outline' : 'solid'],
        disabled ? "opacity-50 cursor-not-allowed" : "hover:shadow-lg",
        className,
        {
            "flex-row-reverse": iconPosition === "right"
        }
    );

    const iconSpacingClass = iconPosition === "left" ? "mr-2" : "ml-2";

    return (
        <button type={type} onClick={onClick} disabled={disabled} className={classes}>
            {loading ? (
                <>
                    <svg
                        className={spinnerClasses}
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                    >
                        <circle
                            className='opacity-25'
                            cx='12'
                            cy='12'
                            r='10'
                            stroke='currentColor'
                            strokeWidth='4'
                        ></circle>
                        <path
                            className='opacity-75'
                            fill='currentColor'
                            d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                        ></path>
                    </svg>
                    {children}
                </>
            ) : (
                <>
                    {icon && <span className={iconSpacingClass}>{icon}</span>}
                    {children}
                </>
            )}
        </button>
    );
};


/**
 * A customizable button component with multiple variants, sizes, and states.
 *
 * @example
 * <Button
 *   variant="primary"
 *   size="large"
 *   onClick={() => console.log('Clicked!')}
 * >
 *   Click Me
 * </Button>
 *
 * @param {ButtonProps} props - The component props
 * @returns {JSX.Element} A styled button element
 */
export default Button;