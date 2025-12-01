import Modal from './Modal';
import Button from './Button';

export default function ConfirmDialog({ open, onClose, onConfirm, title = 'Confirmer', message = 'Êtes-vous sûr ?' }) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <div className="space-y-4">
        <div className="text-gray-700">{message}</div>
        <div className="flex justify-end gap-2">
          <Button variant="secondary" type="button" onClick={onClose}>Annuler</Button>
          <Button type="button" onClick={onConfirm}>Confirmer</Button>
        </div>
      </div>
    </Modal>
  );
}
