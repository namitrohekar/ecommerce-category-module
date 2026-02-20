import { useEffect, useCallback, useReducer, useRef } from "react";
import { createPortal } from "react-dom";

/**
 * Production-grade Modal with smooth fade+scale animation.
 *
 * Props
 * 
 * isOpen   {boolean}   Controls open/close state
 * onClose  {function}  Called when user requests close (Escape / backdrop click)
 * onClosed {function?} Called after the exit animation fully completes
 * title    {string}    Modal heading
 * children {ReactNode} Body content
 */

const initialState = { visible: false, animatingIn: false };

function reducer(state, action) {
  switch (action) {
    case "OPEN":     return { visible: true,  animatingIn: false };
    case "ANIM_IN":  return { visible: true,  animatingIn: true  };
    case "ANIM_OUT": return { visible: true,  animatingIn: false };
    case "CLOSE":    return { visible: false, animatingIn: false };
    default:         return state;
  }
}

export default function Modal({ isOpen, onClose, onClosed, title, children }) {
  const [{ visible, animatingIn }, dispatch] = useReducer(reducer, initialState);

  // Stable ref always holds the latest onClosed without being a reactive dep
  const onClosedRef = useRef(onClosed);
  useEffect(() => {
    onClosedRef.current = onClosed;
  }, [onClosed]);

  useEffect(() => {
    if (isOpen) {
      dispatch("OPEN");
      const raf = requestAnimationFrame(() => dispatch("ANIM_IN"));
      return () => cancelAnimationFrame(raf);
    }

    dispatch("ANIM_OUT");
    const timer = setTimeout(() => {
      dispatch("CLOSE");
      onClosedRef.current?.();
    }, 220);
    return () => clearTimeout(timer);
  }, [isOpen]); 

  // Keyboard: Escape to close
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (!isOpen) return;
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleKeyDown]);

  if (!visible) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        transition: "background-color 220ms ease",
        backgroundColor: animatingIn ? "rgba(0,0,0,0.40)" : "rgba(0,0,0,0)",
      }}
    >
      {/* Backdrop click outside to dismiss */}
      <div
        className="absolute inset-0 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className="relative w-full max-w-lg rounded-[var(--radius-lg)] bg-[var(--bg-surface)] p-6"
        style={{
          boxShadow: "0 8px 32px rgba(15,118,110,0.12)",
          transition:
            "opacity 220ms ease, transform 220ms cubic-bezier(0.34,1.2,0.64,1)",
          opacity: animatingIn ? 1 : 0,
          transform: animatingIn
            ? "scale(1) translateY(0)"
            : "scale(0.95) translateY(8px)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2
            id="modal-title"
            className="text-lg font-semibold text-[var(--text-primary)]"
          >
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="flex items-center justify-center w-8 h-8 rounded-full text-[var(--text-muted)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-primary)] transition-colors duration-150"
          >
            ✕
          </button>
        </div>

        {children}
      </div>
    </div>,
    document.body
  );
}
