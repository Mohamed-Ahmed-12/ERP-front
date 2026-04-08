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

import { VacancyService } from "@/services/vacancyService";
import { VacancyRead, VacancyWrite } from "@/types/vacancies";
import { vacancyFormFields } from "@/schemas/formSchemas/vacancyForm";
import { vacancyColumns } from "@/schemas/tableSchemas/vacancyColumns";

ModuleRegistry.registerModules([AllCommunityModule]);

export default function VacanciesPage() {
    const { data: vacancies, error, loading, refetch } = useFetch<VacancyRead[]>(`hr/vacancies/`);
    const rowData = vacancies || []; // Use empty array if data is undefined

    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [editingVacancy, setEditingVacancy] = useState<VacancyRead | null>(null);
    const [deletingVacancy, setDeletingVacancy] = useState<VacancyRead | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const openCreateModal = () => {
        setEditingVacancy(null);
        setIsFormModalOpen(true);
    };

    const openEditModal = (vacancy: VacancyRead) => {
        setEditingVacancy(vacancy);
        setIsFormModalOpen(true);
    };

    const closeFormModal = () => {
        setIsFormModalOpen(false);
        setEditingVacancy(null);
    };

    const editInitialValues = useMemo(() => {
        if (!editingVacancy) return undefined;

        return {
            ...editingVacancy,
            // Flatten the vacancy object to just the GUID string for the form input
            position: editingVacancy.position?.guid
        };
    }, [editingVacancy]);

    const handleSubmit = async (payload: any) => {
        console.log("data"  ,payload)
        const position = typeof payload.position === 'object'
            ? payload.position.guid
            : payload.position;

        // Construct the "Write" payload
        const normalizedPayload: VacancyWrite = {
            position: position,
            open_date: payload.open_date,
            close_date: payload.close_date || null, // Handle empty string case
            description: payload.description,
            required_qualifications: payload.required_qualifications,
            responsibilities: payload.responsibilities,
            number_of_positions: payload.number_of_positions,
            is_open: payload.is_open,
        };

        try {
            if (editingVacancy) {
                await VacancyService.updateVacancy(editingVacancy.guid, normalizedPayload);
                toast.success("Updated successfully");
            } else {
                await VacancyService.createVacancy(normalizedPayload);
                toast.success("Created successfully");
            }
            await refetch();
            closeFormModal();
        } catch (err) {
            toast.error("Failed to save vacancy. Check required fields.");
        }
        return payload;
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

    const handleDelete = (data: VacancyRead) => {
        setDeletingVacancy(data);
    };

    const confirmDelete = async () => {
        if (!deletingVacancy) return;
        setDeleteLoading(true);
        try {
            await VacancyService.deleteVacancy(deletingVacancy.guid);
            toast.success("Deleted successfully.");
            await refetch();
            setDeletingVacancy(null);
        } catch (error) {
            toast.error("Failed to delete vacancy.");
            console.error("Deletion error:", error);
        } finally {
            setDeleteLoading(false);
        }
    };

    // --- COLUMNS WITH ACTIONS ---
    const categoryColumnsWithActions = [
        ...vacancyColumns,
        ...actionsColumn<VacancyRead>({
            onEdit: openEditModal,
            onDelete: handleDelete,
        }),
    ];

    // --- INLINE EDITING LOGIC ---



    if (loading && rowData.length === 0) {
        return <div className="text-center pt-8"><Spinner size="xl" /> Loading Vacancies...</div>;
    }

    if (error) {
        return <div className="p-4 text-red-600">Error loading vacancies: {error}</div>;
    }

    return (
        <>
            <DeleteConfirmModal
                isOpen={!!deletingVacancy}
                onClose={() => setDeletingVacancy(null)}
                onConfirm={confirmDelete}
                loading={deleteLoading}
                message={`Delete vacancy "${deletingVacancy?.position?.title}"? This action cannot be undone.`}
            />
            <FormModal
                isOpen={isFormModalOpen}
                onClose={closeFormModal}
                onSubmit={handleSubmit}
                formFields={vacancyFormFields}
                initialValues={editInitialValues}
                isEditing={Boolean(editingVacancy)}
                title={editingVacancy ? "Edit Vacancy" : "Create Vacancy"}
            />
            <PageHeader title={"Vacancies"} >
                <Button onClick={openCreateModal} >
                    Create Vacancy
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