// components/Modal.jsx
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";

const Modal = ({ images = [], initialIndex = 0, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "auto");
  }, []);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80"
      style={{ backdropFilter: "blur(4px)" }}
    >
      <div className="relative min-w-72 w-full min-h-72 max-w-4xl px-4 py-8 rounded-lg bg-white shadow-lg flex items-center justify-center">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute text-right right-2 top-1 z-10 text-3xl font-bold text-black"
          aria-label="Close"
        >
          &times;
        </button>

        {/* Prev button */}
        {images.length > 1 && currentIndex > 0 && (
          <button
            onClick={prevImage}
            className="z-10  text-4xl font-bold text-black"
          >
            &#8249;
          </button>
        )}

        {/* Image */}
        <img
          src={`https://lh3.googleusercontent.com/d/${images[currentIndex]}`}
          alt={`Slide ${currentIndex + 1}`}
          className="mx-auto max-h-[80vh] w-auto rounded-md object-contain"
        />

        {/* Next button */}
        {images.length > 1 && currentIndex < images.length - 1 && (
          <button
            onClick={nextImage}
            className="text-4xl font-bold text-black"
          >
            &#8250;
          </button>
        )}
      </div>
    </div>,
    document.body,
  );
};

export default Modal;
