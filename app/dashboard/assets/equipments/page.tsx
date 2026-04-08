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

import { EquipmentRead, EquipmentWrite } from "@/modules/assets/types/equipment";
import { equipmentFormFields } from "@/modules/assets/schemas/form/equipment";
import { EquipmentService } from "@/modules/assets/services/equipmentService";
import { equipmentColumns } from "@/modules/assets/schemas/table/equipment";



ModuleRegistry.registerModules([AllCommunityModule]);

export default function EquipmentPage() {
    const { data: objects, error, loading, refetch } = useFetch<EquipmentRead[]>(`equipments/equipments/`);
    const rowData = objects || []; // Use empty array if data is undefined

    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [editingObject, setEditingObject] = useState<EquipmentRead | null>(null);
    const [deletingObject, setDeletingObject] = useState<EquipmentRead | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const openCreateModal = () => {
        setEditingObject(null);
        setIsFormModalOpen(true);
    };

    const openEditModal = (obj: EquipmentRead) => {
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
            equipment_type: editingObject.equipment_type?.guid || null,
            equipment_brand: editingObject.equipment_brand?.guid || null,
            main_driver: editingObject.main_driver?.guid || null,
            sub_driver: editingObject.sub_driver?.guid || null,
        };
    }, [editingObject]);

    const handleSubmit = async (payload: any) => {
        try {
            // Normalize dropdown values: either object { guid } or string
            const normalizeGuid = (val: any) => {
                if (!val) return null;
                return typeof val === "string" ? val : val.guid;
            };

            const normalizedPayload: EquipmentWrite = {
                ...payload,
                equipment_type: normalizeGuid(payload.equipment_type),
                equipment_brand: normalizeGuid(payload.equipment_brand),
                main_driver: normalizeGuid(payload.main_driver),
                sub_driver: normalizeGuid(payload.sub_driver),
                model: payload.model || null, // Optional string fields
            };

            if (editingObject) {
                await EquipmentService.update(editingObject.guid, normalizedPayload);
                toast.success("Updated successfully");
            } else {
                await EquipmentService.create(normalizedPayload);
                toast.success("Created successfully");
            }

            await refetch();
            closeFormModal();
        } catch (err: any) {
            console.error("Submit error:", err);
            const msg = err?.response?.data?.detail || "Failed to save object. Check required fields.";
            toast.error(msg);
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

    const handleDelete = (data: EquipmentRead) => {
        setDeletingObject(data);
    };

    const confirmDelete = async () => {
        if (!deletingObject) return;
        setDeleteLoading(true);
        try {
            await EquipmentService.delete(deletingObject.guid);
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
        ...equipmentColumns,
        ...actionsColumn<EquipmentRead>({
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
                formFields={equipmentFormFields}
                initialValues={editInitialValues}
                isEditing={Boolean(editingObject)}
                title={editingObject ? "Edit Equipment" : "Create Equipment"}
            />
            <PageHeader title={"Equipments"} >
                <Button onClick={openCreateModal} >
                    Create Equipment
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