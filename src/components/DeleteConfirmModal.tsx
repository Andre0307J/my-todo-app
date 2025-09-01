import styles from '@/styles/DeleteConfirmModal.module.css';

  interface DeleteConfirmModalProps {
      onConfirm: () => void;
      onCancel: () => void;
      itemTitle?: string; // Optional prop
  }

export default function DeleteConfirmModal({ onConfirm, onCancel, itemTitle = 'this item' }: DeleteConfirmModalProps) {
  return (
    <div className={styles.modalOverlay} onClick={onCancel}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h3>Are you sure?</h3>
        <p>You're about to delete <strong>{itemTitle}</strong>. This action cannot be undone.</p>

        <div className={styles.modalActions}>
          <button onClick={onConfirm} className={styles.delete}>Yes, Delete</button>
          <button onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
