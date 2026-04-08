"use client";

import React, { useMemo, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { RowSelectionOptions } from 'ag-grid-community';
import { Spinner, Button } from "flowbite-react";
import { toast } from "react-toastify";
import PageHeader from "@/components/common/PageHeader";
import { useFetch } from "@/hooks/useFetch";
import { useAgGridFilter } from "@/hooks/useAgGridFilter";
import { actionsColumn } from "@components/dashboard/actionsColumn";
import FormModal from "@components/dashboard/FormModal";
import DeleteConfirmModal from "@/components/common/DeleteConfirmModal";

import { CandidateService } from "@/services/candidateService";
import { CandidateRead, CandidateWrite } from "@/types/candidates";
import { candidateFormFields } from "@/schemas/formSchemas/candidateForm";
import { candidateColumns } from "@/schemas/tableSchemas/candidateColumns";
import { validateFile } from "@/helpers/fileValidation";

ModuleRegistry.registerModules([AllCommunityModule]);

export default function CandidatesPage() {
    const { data: candidates, error, loading, refetch } = useFetch<CandidateRead[]>(`hr/candidates/`);
    const rowData = candidates || []; // Use empty array if data is undefined

    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [editingCandidate, setEditingCandidate] = useState<CandidateRead | null>(null);
    const [deletingCandidate, setDeletingCandidate] = useState<CandidateRead | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const openCreateModal = () => {
        setEditingCandidate(null);
        setIsFormModalOpen(true);
    };

    const openEditModal = (candidate: CandidateRead) => {
        setEditingCandidate(candidate);
        setIsFormModalOpen(true);
    };

    const closeFormModal = () => {
        setIsFormModalOpen(false);
        setEditingCandidate(null);
    };

    const editInitialValues = useMemo(() => {
        if (!editingCandidate) return undefined;

        return {
            ...editingCandidate,
            vacancy: editingCandidate.vacancy?.guid
        };
    }, [editingCandidate]);

    const handleSubmit = async (payload: any) => {
        console.log("payload", payload)

        const formData = new FormData();

        // 1. Handle the Vacancy GUID
        const vacancyId = typeof payload.vacancy === 'object' ? payload.vacancy.guid : payload.vacancy;
        formData.append("vacancy", vacancyId);

        // 2. Append text fields (Standard strings)
        const textFields = [
            "first_name", "last_name", "email",
            "phone_number", "status", "source_channel", "notes", "cover_letter"
        ];

        textFields.forEach(field => {
            if (payload[field] !== undefined && payload[field] !== null) {
                formData.append(field, payload[field]);
            }
        });

        // Handle numbers/salary separately to ensure they are valid
        if (payload.expected_salary) {
            formData.append("expected_salary", String(payload.expected_salary));
        }

        // 3. Handle File Fields (Resume & Cover Letter)
        const fileRequirements = {
            maxSizeMB: 2,
            allowedTypes: ['application/pdf', 'image/jpeg', 'image/png']
        };

        const fileFields = ['resume',] as const;

        for (const field of fileFields) {
            let fileValue = payload[field];

            // collect first file only
            if (fileValue instanceof FileList && fileValue.length > 0) {
                fileValue = fileValue[0];
            }

            if (fileValue instanceof File) {
                // Validate the new file
                const result = validateFile({ file: fileValue, requirements: fileRequirements });

                if (!result.isValid) {
                    toast.error(`${field}: ${result.error}`);
                    return; // Stop the submission
                }
                formData.append(field, fileValue);
            }
            // Note: If fileValue is a string (URL), we do NOT append it.
            // This tells Django "don't change the existing file".
        }

        try {
            if (editingCandidate) {
                await CandidateService.updateCandidate(editingCandidate.guid, formData);
                toast.success("Updated successfully");
            } else {
                await CandidateService.createCandidate(formData);
                toast.success("Created successfully");
            }
            await refetch();
            closeFormModal();
        } catch (err: any) {
            // If your backend returns specific validation errors (like email already exists)
            const errorMsg = err.response?.data?.detail || "Failed to save candidate. Check required fields.";
            toast.error(errorMsg);
        }
    };

    // filtering
    const { handleFilterChange } = useAgGridFilter();

    // --- AG-GRID CONFIGURATION MEMOS ---

    const defaultColDef = useMemo(() => ({ resizable: true, sortable: true }), []);

    const rowSelection = useMemo<RowSelectionOptions>(() => {
        return {
            mode: 'multiRow',
        };
    }, []);

    // --- ACTION HANDLERS ---

    const handleDelete = (data: CandidateRead) => {
        setDeletingCandidate(data);
    };

    const confirmDelete = async () => {
        if (!deletingCandidate) return;
        setDeleteLoading(true);
        try {
            await CandidateService.deleteCandidate(deletingCandidate.guid);
            toast.success("Deleted successfully.");
            await refetch();
            setDeletingCandidate(null);
        } catch (error) {
            toast.error("Failed to delete candidate.");
            console.error("Deletion error:", error);
        } finally {
            setDeleteLoading(false);
        }
    };

    // --- COLUMNS WITH ACTIONS ---
    const categoryColumnsWithActions = [
        ...candidateColumns,
        ...actionsColumn<CandidateRead>({
            onEdit: openEditModal,
            onDelete: handleDelete,
        }),
    ];

    // --- INLINE EDITING LOGIC ---



    if (loading && rowData.length === 0) {
        return <div className="text-center pt-8"><Spinner size="xl" /> Loading Vacancies...</div>;
    }

    if (error) {
        return <div className="p-4 text-red-600">Error loading candidates: {error}</div>;
    }

    return (
        <>
            <DeleteConfirmModal
                isOpen={!!deletingCandidate}
                onClose={() => setDeletingCandidate(null)}
                onConfirm={confirmDelete}
                loading={deleteLoading}
                message={`Delete candidate "${deletingCandidate?.first_name} ${deletingCandidate?.last_name}"? This action cannot be undone.`}
            />
            <FormModal
                isOpen={isFormModalOpen}
                onClose={closeFormModal}
                onSubmit={handleSubmit}
                formFields={candidateFormFields}
                initialValues={editInitialValues}
                isEditing={Boolean(editingCandidate)}
                title={editingCandidate ? "Edit Candidate" : "Create Candidate"}
            />
            <PageHeader title={"Candidates"} >
                <Button onClick={openCreateModal} >
                    Create Candidate
                </Button>
            </PageHeader>

            <div className="ag-theme-quartz" style={{ height: "100%", width: '100%' }}>
                <AgGridReact
                    rowData={rowData}
                    columnDefs={categoryColumnsWithActions}
                    defaultColDef={defaultColDef}
                    rowSelection={rowSelection}
                    onFilterChanged={handleFilterChange}
                    pagination={true}
                    paginationPageSize={10}
                    paginationPageSizeSelector={[10, 20, 50]}
                    domLayout="autoHeight"
                />


            </div>
        </>
    );
}