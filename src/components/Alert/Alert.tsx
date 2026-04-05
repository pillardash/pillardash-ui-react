import React, { ReactNode, useEffect, useRef, useState } from "react";

import { AlertCircle, AlertTriangle, CheckCircle, Info, X } from "lucide-react";

export type AlertType = "success" | "error" | "info" | "warning";

export interface AlertProps {
    message: ReactNode;
    description?: string;
    type?: AlertType;
    duration?: number;
    onClose?: () => void;
}

const ALERT_ICONS: Record<AlertType, React.ReactElement> = {
    success: <CheckCircle className="h-5 w-5" />,
    error: <AlertCircle className="h-5 w-5" />,
    info: <Info className="h-5 w-5" />,
    warning: <AlertTriangle className="h-5 w-5" />,
};

const ALERT_CONFIG: Record<
    AlertType,
    { bgColor: string; borderColor: string; textColor: string; iconColor: string; progressColor: string }
> = {
    success: {
        bgColor: "bg-green-50",
        borderColor: "border-green-300",
        textColor: "text-green-800",
        iconColor: "text-green-500",
        progressColor: "bg-green-500",
    },
    error: {
        bgColor: "bg-rose-50",
        borderColor: "border-rose-300",
        textColor: "text-rose-800",
        iconColor: "text-rose-500",
        progressColor: "bg-rose-500",
    },
    info: {
        bgColor: "bg-blue-50",
        borderColor: "border-blue-300",
        textColor: "text-blue-800",
        iconColor: "text-blue-500",
        progressColor: "bg-blue-500",
    },
    warning: {
        bgColor: "bg-amber-50",
        borderColor: "border-amber-300",
        textColor: "text-amber-800",
        iconColor: "text-amber-500",
        progressColor: "bg-amber-500",
    },
};

const Alert: React.FC<AlertProps> = ({
    message,
    description,
    type = "info",
    duration = 5000,
    onClose,
}) => {
    const [isVisible, setIsVisible] = useState(true);
    const [progressWidth, setProgressWidth] = useState(100);
    const onCloseRef = useRef(onClose);

    // Keep ref current without adding onClose to the timer effect's deps
    useEffect(() => {
        onCloseRef.current = onClose;
    });

    useEffect(() => {
        // Single rAF triggers the CSS width transition from 100% → 0
        const frame = requestAnimationFrame(() => setProgressWidth(0));

        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(() => {
                onCloseRef.current?.();
            }, 300);
        }, duration);

        return () => {
            cancelAnimationFrame(frame);
            clearTimeout(timer);
        };
    }, [duration]);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(() => {
            onCloseRef.current?.();
        }, 300);
    };

    const { bgColor, borderColor, textColor, iconColor, progressColor } = ALERT_CONFIG[type];

    return (
        <div
            className={`transform transition-all duration-300 ${
                isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
            }`}
        >
            <div
                className={`flex w-72 rounded-lg border shadow-lg md:w-96 ${borderColor} ${bgColor} p-4`}
            >
                <div className={`flex-shrink-0 ${iconColor}`}>{ALERT_ICONS[type]}</div>
                <div className="ml-3 w-full">
                    <div className="flex items-start justify-between">
                        <div className={`text-base font-semibold ${textColor}`}>{message}</div>
                        <button
                            onClick={handleClose}
                            aria-label="Close"
                            className="text-gray-600 hover:text-gray-800 focus:outline-none"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                    {description && (
                        <p className={`mt-1 text-sm ${textColor} opacity-80`}>{description}</p>
                    )}
                    <div className="mt-2 h-1 w-full rounded-full bg-gray-200">
                        <div
                            className={`${progressColor} h-1 rounded-full`}
                            style={{
                                width: `${progressWidth}%`,
                                transition: `width ${duration}ms linear`,
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Alert;
