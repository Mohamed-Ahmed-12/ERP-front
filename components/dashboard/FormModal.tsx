"use client";

import React from "react";
import { Button, Modal, ModalBody, ModalHeader } from "flowbite-react";
import FormBuilder from "@/components/dashboard/FormBuilder";
import { FormFieldGroup } from "@/types/formfield";
import { DefaultValues, FieldValues } from "react-hook-form";

type GenericFormModalProps<TFormValues extends FieldValues> = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TFormValues) => Promise<TFormValues>;
  initialValues?: DefaultValues<TFormValues>;
  isEditing?: boolean;
  formFields: FormFieldGroup[];
  title?: string;
  createTitle?: string;
  editTitle?: string;
};

export default function FormModal<TFormValues extends FieldValues>({
  isOpen,
  onClose,
  onSubmit,
  initialValues,
  isEditing = false,
  formFields,
  title,
  createTitle = "Create",
  editTitle = "Edit",
}: GenericFormModalProps<TFormValues>) {
  return (
    <Modal show={isOpen} size="5xl" dismissible popup onClose={onClose} position="center">
      <ModalHeader className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          {title ?? (isEditing ? editTitle : createTitle)}
        </h3>
      </ModalHeader>
      <ModalBody>
        <div className="space-y-6">

          {isOpen && (
            <FormBuilder
              formFields={formFields}
              defaultValues={initialValues}
              onSubmit={onSubmit}
              successRedirect={undefined}
            />
          )}

          {/* <div className="flex justify-end">
            <Button color="gray" onClick={onClose} outline>
              Cancel
            </Button>
          </div> */}
        </div>
      </ModalBody>
    </Modal>
  );
}
