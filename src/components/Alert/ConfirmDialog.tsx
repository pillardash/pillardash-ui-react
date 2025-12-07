import React from "react";
import { AlertCircle, AlertTriangle, CheckCircle, Info } from "lucide-react";
import { AlertType } from "./Alert";

interface ConfirmDialogProps {
  isOpen: boolean;
  message: string;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  type?: AlertType;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  message,
  title = "Confirm Action",
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "warning",
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  const config = {
    success: {
      icon: <CheckCircle className="h-6 w-6" />,
      iconColor: "text-green-500",
      buttonColor: "bg-green-600 hover:bg-green-700",
    },
    error: {
      icon: <AlertCircle className="h-6 w-6" />,
      iconColor: "text-rose-500",
      buttonColor: "bg-rose-600 hover:bg-rose-700",
    },
    info: {
      icon: <Info className="h-6 w-6" />,
      iconColor: "text-blue-500",
      buttonColor: "bg-blue-600 hover:bg-blue-700",
    },
    warning: {
      icon: <AlertTriangle className="h-6 w-6" />,
      iconColor: "text-amber-500",
      buttonColor: "bg-amber-600 hover:bg-amber-700",
    },
  };

  const { icon, iconColor, buttonColor } = config[type];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onCancel}
      />

      {/* Dialog */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 transform transition-all">
        <div className="p-6">
          <div className="flex items-start">
            <div className={`flex-shrink-0 ${iconColor}`}>{icon}</div>
            <div className="ml-4 flex-1">
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              <div className="mt-2 text-sm text-gray-600">
                <p>{message}</p>
                {description && <p className="mt-2">{description}</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-gray-50 px-6 py-4 flex flex-col-reverse sm:flex-row sm:justify-end gap-3 rounded-b-lg">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${buttonColor}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
