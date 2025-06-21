import React, { useEffect, useState } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  const [internalShow, setInternalShow] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // When isOpen becomes true, we want to start the transition.
      // We set internalShow to true after a very brief delay to ensure
      // the initial (opacity-0, scale-95) classes are applied and then transitioned from.
      const timer = setTimeout(() => {
        setInternalShow(true);
      }, 10); // A small delay like 10ms is usually enough for the browser to apply initial styles
      return () => clearTimeout(timer);
    } else {
      // When isOpen becomes false, reset internalShow.
      // This will make it transition out if exit transitions were also handled by these classes.
      setInternalShow(false);
    }
  }, [isOpen]);

  // Conditional rendering of the modal based on isOpen.
  // If the modal is not open, it's not rendered in the DOM.
  if (!isOpen) {
    return null;
  }

  return (
    // Backdrop: fades in
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black transition-opacity duration-300 ease-in-out
                  ${internalShow ? 'bg-opacity-50 opacity-100' : 'bg-opacity-0 opacity-0'}`}
    >
      {/* Modal Dialog: fades in and scales up */}
      <div 
        className={`bg-white rounded-lg shadow-xl p-6 w-full max-w-md transform transition-all duration-300 ease-in-out
                    ${internalShow ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 focus:outline-none"
            aria-label="Close modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        <div className="text-gray-700">
          {children}
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            Đóng
          </button>
        </div>
      </div>
      {/* The <style jsx global> block has been removed as it's not standard React/TSX and caused an error.
          The animation is now handled by Tailwind's transition utilities and conditional classes. */}
    </div>
  );
};

export default Modal;
