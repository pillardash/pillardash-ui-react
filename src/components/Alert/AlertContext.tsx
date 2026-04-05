import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import Alert, { AlertProps, AlertType } from "./Alert";
import ConfirmDialog from "./ConfirmDialog";

export interface AlertContextProps {
  showAlert: (props: Omit<AlertProps, "onClose">) => void;
  success: (message: string, description?: string) => void;
  error: (message: string, description?: string) => void;
  info: (message: string, description?: string) => void;
  warning: (message: string, description?: string) => void;
  confirm: (message: string, options?: ConfirmOptions) => Promise<boolean>;
}

export interface ConfirmOptions {
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  type?: AlertType;
}

interface ConfirmState {
  isOpen: boolean;
  message: string;
  options: ConfirmOptions;
  resolve: (value: boolean) => void;
}

let globalAlertRef: AlertContextProps | null = null;

export const AlertContext = createContext<AlertContextProps | undefined>(undefined);

export interface AlertItem extends AlertProps {
  id: string;
}

export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [confirmState, setConfirmState] = useState<ConfirmState | null>(null);

  const removeAlert = useCallback((id: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  }, []);

  const showAlert = useCallback(
    (props: Omit<AlertProps, "onClose">) => {
      const id = Math.random().toString(36).substring(2, 9);
      setAlerts((prev) => [...prev, { ...props, id, onClose: () => removeAlert(id) }]);
    },
    [removeAlert],
  );

  const success = useCallback(
    (message: string, description?: string) => showAlert({ message, description, type: "success" }),
    [showAlert],
  );
  const error = useCallback(
    (message: string, description?: string) => showAlert({ message, description, type: "error" }),
    [showAlert],
  );
  const info = useCallback(
    (message: string, description?: string) => showAlert({ message, description, type: "info" }),
    [showAlert],
  );
  const warning = useCallback(
    (message: string, description?: string) => showAlert({ message, description, type: "warning" }),
    [showAlert],
  );

  const confirm = useCallback(
    (message: string, options: ConfirmOptions = {}): Promise<boolean> => {
      return new Promise((resolve) => {
        setConfirmState({ isOpen: true, message, options, resolve });
      });
    },
    [],
  );

  const handleConfirmClose = useCallback(
    (result: boolean) => {
      if (confirmState) {
        confirmState.resolve(result);
        setConfirmState(null);
      }
    },
    [confirmState],
  );

  const contextValue = useMemo(
    () => ({ showAlert, success, error, info, warning, confirm }),
    [showAlert, success, error, info, warning, confirm],
  );

  // Side effect outside of render
  useEffect(() => {
    globalAlertRef = contextValue;
  }, [contextValue]);

  return (
    <AlertContext.Provider value={contextValue}>
      {children}
      <div className="fixed right-4 top-4 z-50 flex w-full max-w-sm flex-col gap-2">
        {alerts.map((alert) => (
          <Alert key={alert.id} {...alert} />
        ))}
      </div>
      {confirmState && (
        <ConfirmDialog
          isOpen={confirmState.isOpen}
          message={confirmState.message}
          onConfirm={() => handleConfirmClose(true)}
          onCancel={() => handleConfirmClose(false)}
          {...confirmState.options}
        />
      )}
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
const alert = {
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
  confirm: async (message: string, options?: ConfirmOptions): Promise<boolean> => {
    if (!globalAlertRef) {
      console.warn("AlertProvider not mounted yet");
      return false;
    }
    return globalAlertRef.confirm(message, options);
  },
};

export default alert;
