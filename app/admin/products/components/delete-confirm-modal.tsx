import { Trash2 } from "lucide-react";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteConfirmModal = ({
  isOpen,
  isDeleting,
  onClose,
  onConfirm,
}: DeleteConfirmModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-zinc-900 border border-white/10 w-full max-w-sm rounded-xl overflow-hidden p-6 text-center shadow-2xl">
        <Trash2 size={48} className="mx-auto mb-6 text-red-500/80" />
        <h3 className="text-xl font-display font-bold mb-2">
          Delete Product?
        </h3>
        <p className="text-zinc-400 text-sm mb-8 leading-relaxed">
          Are you sure you want to delete this product? This action cannot
          be undone.
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onClose}
            className="px-6 py-3 text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-colors border border-white/10 hover:bg-white/5 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-6 py-3 text-xs font-bold uppercase tracking-widest border border-red-500/50 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-colors disabled:opacity-50"
          >
            {isDeleting ? "Deleting..." : "Delete Product"}
          </button>
        </div>
      </div>
    </div>
  );
};
