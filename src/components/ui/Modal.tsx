/**
 * Reusable Modal component with animation and accessibility
 */
import React, { ReactNode, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Modal({ isOpen, onClose, title, children, maxWidth = 'md' }: ModalProps) {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={onClose}
          />
          
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={`relative transform overflow-hidden rounded-lg bg-white p-6 text-left shadow-xl transition-all w-full ${maxWidthClasses[maxWidth]}`}
              onClick={(e) => e.stopPropagation()}
            >
              {title && (
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    aria-label="Close modal"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}
              {children}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}