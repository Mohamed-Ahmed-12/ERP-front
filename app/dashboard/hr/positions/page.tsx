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
import { positionColumns } from "@/modules/hr/schemas/tableSchemas/positionColumns";
import { positionFormFields } from "@/modules/hr/schemas/formSchemas/positionForm";
import { actionsColumn } from "@components/dashboard/actionsColumn";
import FormModal from "@components/dashboard/FormModal";
import DeleteConfirmModal from "@/components/common/DeleteConfirmModal";
import { Position, PositionCreate } from "@/modules/hr/types/position";
import { JobPositionService } from "@/modules/hr/services/positionService";

ModuleRegistry.registerModules([AllCommunityModule]);

export default function JobPositionsPage() {
    const { data: positions, error, loading, refetch } = useFetch<Position[]>(`hr/positions/`);
    const rowData = positions || []; // Use empty array if data is undefined

    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [editingDepartment, setEditingDepartment] = useState<Position | null>(null);
    const [deletingPosition, setDeletingPosition] = useState<Position | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const openCreateModal = () => {
        setEditingDepartment(null);
        setIsFormModalOpen(true);
    };

    const openEditModal = (department: Position) => {
        setEditingDepartment(department);
        setIsFormModalOpen(true);
    };

    const closeFormModal = () => {
        setIsFormModalOpen(false);
        setEditingDepartment(null);
    };

    const editInitialValues = useMemo(() => {
        if (!editingDepartment) return undefined;

        return {
            ...editingDepartment,
            // Flatten the department object to just the GUID string for the form input
            department: editingDepartment.department?.guid
        };
    }, [editingDepartment]);

    const handleSubmit = async (payload: any) => {
        console.log("data", payload)
        const departmentGuid = typeof payload.department === 'object'
            ? payload.department.guid
            : payload.department;

        // Construct the "Write" payload
        const normalizedPayload: PositionCreate = {
            title: payload.title,
            base_salary: payload.base_salary,
            department: departmentGuid, // Send the string, not the object
            contract_type: payload.contract_type,
            seniority_level: payload.seniority_level

        };

        try {
            if (editingDepartment) {
                await JobPositionService.updateJobPosition(editingDepartment.guid, normalizedPayload);
                toast.success("Updated successfully");
            } else {
                await JobPositionService.createJobPosition(normalizedPayload);
                toast.success("Created successfully");
            }
            await refetch();
            closeFormModal();
        } catch (err) {
            toast.error("Failed to save position. Check required fields.");
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

    const handleDelete = (data: Position) => {
        setDeletingPosition(data);
    };

    const confirmDelete = async () => {
        if (!deletingPosition) return;
        setDeleteLoading(true);
        try {
            await JobPositionService.deleteJobPosition(deletingPosition.guid);
            toast.success("Deleted successfully.");
            await refetch();
            setDeletingPosition(null);
        } catch (error) {
            toast.error("Failed to delete position.");
            console.error("Deletion error:", error);
        } finally {
            setDeleteLoading(false);
        }
    };

    // --- COLUMNS WITH ACTIONS ---
    const categoryColumnsWithActions = [
        ...positionColumns,
        ...actionsColumn<Position>({
            onEdit: openEditModal,
            onDelete: handleDelete,
        }),
    ];

    // --- INLINE EDITING LOGIC ---



    if (loading && rowData.length === 0) {
        return <div className="text-center pt-8"><Spinner size="xl" /> Loading Positions...</div>;
    }

    if (error) {
        return <div className="p-4 text-red-600">Error loading positions: {error}</div>;
    }

    return (
        <>
            <DeleteConfirmModal
                isOpen={!!deletingPosition}
                onClose={() => setDeletingPosition(null)}
                onConfirm={confirmDelete}
                loading={deleteLoading}
                message={`Delete position "${deletingPosition?.title}"? This action cannot be undone.`}
            />
            <FormModal
                isOpen={isFormModalOpen}
                onClose={closeFormModal}
                onSubmit={handleSubmit}
                formFields={positionFormFields}
                initialValues={editInitialValues}
                isEditing={Boolean(editingDepartment)}
                title={editingDepartment ? "Edit Position" : "Create Position"}
            />
            <PageHeader title={"Job Positions"} >
                <Button onClick={openCreateModal} >
                    Create Position
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