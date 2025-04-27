import React, { useEffect, useRef } from "react";

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = "md",
  closeOnOverlayClick = true,
}) => {
  const modalRef = useRef(null);

  useEffect(() => {
    // Focus trap
    if (isOpen) {
      // Focus the modal container when opened
      modalRef.current?.focus();

      // Prevent scrolling on the body when modal is open
      document.body.style.overflow = "hidden";

      // Handle escape key
      const handleEscKey = (e) => {
        if (e.key === "Escape") onClose();
      };

      window.addEventListener("keydown", handleEscKey);

      return () => {
        // Cleanup
        document.body.style.overflow = "";
        window.removeEventListener("keydown", handleEscKey);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    full: "max-w-full",
  };

  return (
    <div
      className="fixed top-0 left-0 z-40 overflow-y-auto flex justify-center items-center"
      aria-modal="true"
      role="dialog"
      aria-labelledby={title ? "modal-title" : undefined}
    >
      <div
        className="flex items-center justify-center min-h-screen min-w-screen p-4 text-center sm:p-0"
        style={{
          border: "1px solid red",
          background: `
      linear-gradient(to bottom, rgba(180, 180, 180, 0.7), rgba(150, 150, 150, 0.7)), 
      repeating-linear-gradient(45deg, 
        rgba(100, 130, 80, 0.2) 0px, 
        rgba(100, 130, 80, 0.2) 3px, 
        rgba(120, 145, 100, 0.2) 3px, 
        rgba(120, 145, 100, 0.2) 6px
      )
    `,
          backdropFilter: "blur(3px)",
        }}
      >
        {/* Modal panel */}
        <div
          ref={modalRef}
          className={`inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all duration-300 ease-in-out sm:my-8 sm:align-middle sm:w-full ${sizeClasses[size]}`}
          tabIndex={-1}
        >
          {/* Header */}
          {title && (
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3
                  id="modal-title"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  {title}
                </h3>
                <button
                  type="button"
                  className="text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
                  onClick={onClose}
                  aria-label="Close"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* Body */}
          <div className="px-6 py-4">{children}</div>

          {/* Footer */}
          {footer && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 sm:flex sm:flex-row-reverse">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
