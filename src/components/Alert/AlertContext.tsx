import React, { createContext, useCallback, useContext, useState } from "react";

import Alert, { AlertProps, AlertType } from "./Alert";

export interface AlertContextProps {
    showAlert: (props: Omit<AlertProps, "onClose">) => void;
    success: (message: string, description?: string) => void;
    error: (message: string, description?: string) => void;
    info: (message: string, description?: string) => void;
    warning: (message: string, description?: string) => void;
}

let globalAlertRef: AlertContextProps | null = null;

export const AlertContext = createContext<AlertContextProps | undefined>(undefined);

export interface AlertItem extends AlertProps {
    id: string;
}

export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [alerts, setAlerts] = useState<AlertItem[]>([]);

    const removeAlert = useCallback((id: string) => {
        setAlerts((prevAlerts) => prevAlerts.filter((toast) => toast.id !== id));
    }, []);

    const showAlert = useCallback(
        (props: Omit<AlertProps, "onClose">) => {
            const id = Math.random().toString(36).substring(2, 9);
            const newAlert: AlertItem = {
                ...props,
                id,
                onClose: () => removeAlert(id),
            };
            setAlerts((prevAlerts) => [...prevAlerts, newAlert]);
        },
        [removeAlert]
    );

    const createAlertFn = useCallback(
        (type: AlertType) => (message: string, description?: string) => {
            showAlert({ message, description, type });
        },
        [showAlert]
    );

    const contextValue = {
        showAlert,
        success: createAlertFn("success"),
        error: createAlertFn("error"),
        info: createAlertFn("info"),
        warning: createAlertFn("warning"),
    };

    // Set the global reference when provider mounts
    globalAlertRef = contextValue;

    return (
        <AlertContext.Provider value={contextValue}>
            {children}
            <div className='fixed right-4 top-4 z-50 space-y-2 w-full max-w-xs'>
                {alerts.map((alert, index) => (
                    <div
                        key={alert.id}
                        style={{
                            transform: `translateY(${index * 10}px)`,
                            zIndex: 50 - index,
                        }}
                    >
                        <Alert {...alert} />
                    </div>
            ))}
        </div>
        </AlertContext.Provider>
    );
};

export const useAlert = (): AlertContextProps => {
    const context = useContext(AlertContext);
    if (context === undefined) {
        throw new Error("useAlert must be used within a AlertProvider");
    }
    return context;
};


// Export a global alert function that can be used anywhere
export const alert = {
    success: (message: string, description?: string) => {
        if (!globalAlertRef) {
            console.warn("AlertProvider not mounted yet");
            return;
        }
        globalAlertRef.success(message, description);
    },
    error: (message: string, description?: string) => {
        if (!globalAlertRef) {
            console.warn("AlertProvider not mounted yet");
            return;
        }
        globalAlertRef.error(message, description);
    },
    info: (message: string, description?: string) => {
        if (!globalAlertRef) {
            console.warn("AlertProvider not mounted yet");
            return;
        }
        globalAlertRef.info(message, description);
    },
    warning: (message: string, description?: string) => {
        if (!globalAlertRef) {
            console.warn("AlertProvider not mounted yet");
            return;
        }
        globalAlertRef.warning(message, description);
    },
    show: (props: Omit<AlertProps, "onClose">) => {
        if (!globalAlertRef) {
            console.warn("AlertProvider not mounted yet");
            return;
        }
        globalAlertRef.showAlert(props);
    },
};