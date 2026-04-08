"use client";

import React, { useMemo, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import {Department} from "@/types/department";
import { RowSelectionOptions } from 'ag-grid-community';
import { Spinner, Button } from "flowbite-react";
import { toast } from "react-toastify";
import PageHeader from "@/components/common/PageHeader";
import { useFetch } from "@/hooks/useFetch";
import { useAgGridFilter } from "@/hooks/useAgGridFilter";
import { departmentColumns } from "@/schemas/tableSchemas/departmentColumns";
import { departmentFormFields } from "@/schemas/formSchemas/departmentForm";
import { DepartmentService } from "@/services/departmentService";
import { actionsColumn } from "@components/dashboard/actionsColumn";
import FormModal from "@components/dashboard/FormModal";
import DeleteConfirmModal from "@/components/common/DeleteConfirmModal";

ModuleRegistry.registerModules([AllCommunityModule]);

export default function DepartmentsPage() {
    const { data: departments, error, loading, refetch } = useFetch<Department[]>(`hr/departments/`);
    const rowData = departments || []; // Use empty array if data is undefined

    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
    const [deletingDepartment, setDeletingDepartment] = useState<Department | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const openCreateModal = () => {
        setEditingDepartment(null);
        setIsFormModalOpen(true);
    };

    const openEditModal = (department: Department) => {
        setEditingDepartment(department);
        setIsFormModalOpen(true);
    };

    const closeFormModal = () => {
        setIsFormModalOpen(false);
        setEditingDepartment(null);
    };

    const handleSubmit = async (payload: { name: string; description?: string }) => {
        if (editingDepartment) {
            await DepartmentService.updateDepartment(editingDepartment.guid, payload);
        } else {
            await DepartmentService.createDepartment(payload);
        }
        await refetch();
        closeFormModal();
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

    const handleDelete = (data: Department) => {
        setDeletingDepartment(data);
    };

    const confirmDelete = async () => {
        if (!deletingDepartment) return;
        setDeleteLoading(true);
        try {
            await DepartmentService.deleteDepartment(deletingDepartment.guid);
            toast.success("Deleted successfully.");
            await refetch();
            setDeletingDepartment(null);
        } catch (error) {
            toast.error("Failed to delete department.");
            console.error("Deletion error:", error);
        } finally {
            setDeleteLoading(false);
        }
    };

    // --- COLUMNS WITH ACTIONS ---
    const departmentColumnsWithActions = [
        ...departmentColumns,
        ...actionsColumn<Department>({
            onEdit: openEditModal,
            onDelete: handleDelete,
        }),
    ];

    // --- INLINE EDITING LOGIC ---

   

    if (loading && rowData.length === 0) {
        return <div className="text-center pt-8"><Spinner size="xl" /> Loading Departments...</div>;
    }

    if (error) {
        return <div className="p-4 text-red-600">Error loading departments: {error}</div>;
    }

    return (
        <>
            <DeleteConfirmModal
                isOpen={!!deletingDepartment}
                onClose={() => setDeletingDepartment(null)}
                onConfirm={confirmDelete}
                loading={deleteLoading}
                message={`Delete department "${deletingDepartment?.name}"? This action cannot be undone.`}
            />
            <FormModal
                isOpen={isFormModalOpen}
                onClose={closeFormModal}
                onSubmit={handleSubmit}
                formFields={departmentFormFields}
                initialValues={editingDepartment ? editingDepartment : undefined}
                isEditing={Boolean(editingDepartment)}
                title={editingDepartment ? "Edit Department" : "Create Department"}
            />
            <PageHeader title={"Departments"} >
                <Button onClick={openCreateModal} >
                    Create Department
                </Button>
            </PageHeader>

            <div className="ag-theme-quartz" style={{ height: "100%", width: '100%' }}>
                <AgGridReact
                    rowData={rowData}
                    columnDefs={departmentColumnsWithActions}
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