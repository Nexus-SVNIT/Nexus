// components/Modal.jsx
import React, { useEffect } from "react";
import ReactDOM from "react-dom";

const Modal = ({ children, onClose }) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "auto");
  }, []);

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 overflow-y-auto"
      style={{ backdropFilter: "blur(4px)" }}
    >
      <div className="relative w-full max-w-4xl p-4 mx-auto">
        <button
          onClick={onClose}
          className="absolute top-2 right-4 text-white text-3xl font-bold z-10"
          aria-label="Close"
        >
          &times;
        </button>
        {children}
      </div>
    </div>,
    document.body
  );
};

export default Modal;
