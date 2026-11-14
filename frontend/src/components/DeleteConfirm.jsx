import React from "react";
import CustomButton from "./CustomButton";

const DeleteConfirm = ({ isOpen, onClose, onConfirm, message }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="fade-up bg-white border border-[#E4E6EA] rounded-2xl p-8 max-w-sm w-full mx-4 shadow-[0_16px_48px_rgba(16,24,40,0.16)]"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="font-display text-lg font-semibold mb-4 text-[#16181D]">
          Confirm Delete
        </h3>

        <p className="text-[#6E7178] text-sm leading-relaxed mb-6">
          {message ||
            "Are you sure you want to delete this item? This action cannot be undone."}
        </p>

        <div className="flex justify-end gap-4">
          <CustomButton onClick={onClose} variant="secondary">
            Cancel
          </CustomButton>
          <CustomButton onClick={onConfirm} variant="danger">
            Delete
          </CustomButton>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirm;
