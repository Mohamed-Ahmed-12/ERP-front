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
import { EquipmentTypeRead, EquipmentTypeWrite } from "@/modules/assets/types/equipment";
import { EquipmentTypeService } from "@/modules/assets/services/equipmentTypeService";
import { eqTypeColumns } from "@/modules/assets/schemas/table/equipmentType";
import { equipmentTypeFormFields } from "@/modules/assets/schemas/form/equipmentType";



ModuleRegistry.registerModules([AllCommunityModule]);

export default function EquipmentTypesPage() {
    const { data: objects, error, loading, refetch } = useFetch<EquipmentTypeRead[]>(`equipments/types/`);
    const rowData = objects || []; // Use empty array if data is undefined

    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [editingObject, setEditingObject] = useState<EquipmentTypeRead | null>(null);
    const [deletingObject, setDeletingObject] = useState<EquipmentTypeRead | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const openCreateModal = () => {
        setEditingObject(null);
        setIsFormModalOpen(true);
    };

    const openEditModal = (obj: EquipmentTypeRead) => {
        setEditingObject(obj);
        setIsFormModalOpen(true);
    };

    const closeFormModal = () => {
        setIsFormModalOpen(false);
        setEditingObject(null);
    };

    const editInitialValues = useMemo(() => {
        if (!editingObject) return undefined;

        return {
            ...editingObject,
        };
    }, [editingObject]);

    const handleSubmit = async (payload: any) => {

        try {
            if (editingObject) {
                await EquipmentTypeService.update(editingObject.guid, payload);
                toast.success("Updated successfully");
            } else {
                await EquipmentTypeService.create(payload);
                toast.success("Created successfully");
            }
            await refetch();
            closeFormModal();
        } catch (err) {
            toast.error("Failed to save Object. Check required fields.");
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

    const handleDelete = (data: EquipmentTypeRead) => {
        setDeletingObject(data);
    };

    const confirmDelete = async () => {
        if (!deletingObject) return;
        setDeleteLoading(true);
        try {
            await EquipmentTypeService.delete(deletingObject.guid);
            toast.success("Deleted successfully.");
            await refetch();
            setDeletingObject(null);
        } catch (error) {
            toast.error("Failed to delete object.");
            console.error("Deletion error:", error);
        } finally {
            setDeleteLoading(false);
        }
    };

    // --- COLUMNS WITH ACTIONS ---
    const ColumnsWithActions = [
        ...eqTypeColumns,
        ...actionsColumn<EquipmentTypeRead>({
            onEdit: openEditModal,
            onDelete: handleDelete,
        }),
    ];

    // --- INLINE EDITING LOGIC ---



    if (loading && rowData.length === 0) {
        return <div className="text-center pt-8"><Spinner size="xl" /> Loading Data...</div>;
    }

    if (error) {
        return <div className="p-4 text-red-600">Error loading Data: {error}</div>;
    }

    return (
        <>
            <DeleteConfirmModal
                isOpen={!!deletingObject}
                onClose={() => setDeletingObject(null)}
                onConfirm={confirmDelete}
                loading={deleteLoading}
                message={`Delete Object "${deletingObject?.name}"? This action cannot be undone.`}
            />
            <FormModal
                isOpen={isFormModalOpen}
                onClose={closeFormModal}
                onSubmit={handleSubmit}
                formFields={equipmentTypeFormFields}
                initialValues={editInitialValues}
                isEditing={Boolean(editingObject)}
                title={editingObject ? "Edit Type" : "Create Type"}
            />
            <PageHeader title={"Equipment Types"} >
                <Button onClick={openCreateModal} >
                    Create Type
                </Button>
            </PageHeader>

            <div className="ag-theme-quartz" style={{ height: "100%", width: '100%' }}>
                <AgGridReact
                    rowData={rowData}
                    columnDefs={ColumnsWithActions}
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