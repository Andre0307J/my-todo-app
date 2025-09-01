import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import styles from "@/styles/Modal.module.css";
import { IoClose } from "react-icons/io5";

interface ModalProps {
  title: string;
  children: ReactNode;
  onClose: () => void;
}

export default function Modal({ title, children, onClose }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const firstFocusableRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }

      // Trap focus
      if (e.key === "Tab") {
        if (!modalRef.current) return;

        const focusableElements = modalRef.current.querySelectorAll<
          HTMLElement
        >(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        const first = focusableElements[0];
        const last = focusableElements[focusableElements.length - 1];

        if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          if (first) first.focus();
        } else if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          if (last) last.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    firstFocusableRef.current?.focus();

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div
      className={styles.modalOverlay}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={onClose}
    >
      <div
        className={styles.modalContent}
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
        ref={modalRef}
      >
        <header className={styles.modalHeader}>
          <h3 id="modal-title">{title}</h3>
          <button
            onClick={onClose}
            aria-label="Close modal"
            ref={firstFocusableRef}
          >
            <IoClose size={20} />
          </button>
        </header>
        <div className={styles.modalBody}>{children}</div>
      </div>
    </div>
  );
}
