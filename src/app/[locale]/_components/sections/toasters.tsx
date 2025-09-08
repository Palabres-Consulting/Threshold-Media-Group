"use client";

// Create a ToastContext
import { createContext, useContext, useEffect, useRef, useState } from "react";

type ToastState = {
  error: string;
  success: string;
};

type ToastContextType = {
  toast: ToastState;
  setError: (message: string) => void;
  setSuccess: (message: string) => void;
  removeToast: () => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toast, setToast] = useState<ToastState>({ error: "", success: "" });

  const setError = (message: string) => {
    setToast((prev) => ({ ...prev, error: message }));
  };

  const setSuccess = (message: string) => {
    setToast((prev) => ({ ...prev, success: message }));
  };

  const removeToast = () => {
    setToast({ error: "", success: "" });
  };

  return (
    <ToastContext.Provider value={{ toast, setError, setSuccess, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

export const Toast = () => {
  const { toast, removeToast } = useToast();

  useEffect(() => {
    if (toast.error || toast.success) {
      const timer = setTimeout(() => {
        removeToast();
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [toast, removeToast]);

  return (
    <>
      {toast.error !== "" ? (
        <div className="toasters flex-c-center">{toast.error}</div>
      ) : toast.success !== "" ? (
        <div className="toasters flex-c-center">{toast.success}</div>
      ) : ( 
        <div className=""></div> 
      )}
      </>
   );
};
