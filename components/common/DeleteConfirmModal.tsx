"use client";

import React from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";

type DeleteConfirmModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message?: string;
  loading?: boolean;
};

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  message = "Are you sure you want to delete this record? This action cannot be undone.",
  loading = false,
}: DeleteConfirmModalProps) {
  return (
    <Modal show={isOpen} size="md" popup onClose={onClose}>
      <ModalHeader />
      <ModalBody>
        <div className="text-center">
          <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-red-400" />
          <h3 className="mb-2 text-lg font-semibold text-gray-800 dark:text-gray-200">
            Confirm Delete
          </h3>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">{message}</p>
          <div className="flex justify-center gap-3">
            <Button color="red"  onClick={onConfirm} disabled={loading}>
              {loading ? "Deleting..." : "Yes, delete"}
            </Button>
            <Button color="gray" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
}
