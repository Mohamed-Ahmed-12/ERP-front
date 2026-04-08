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

import { JobPositionChangeReqService } from "@/modules/hr/services/jobPositionChangeService";
import { JobChangeRequestRead, JobChangeRequestWrite } from "@/modules/hr/types/jobChangeRequest";
import { jobChangeRequestColumns } from "@/modules/hr/schemas/tableSchemas/jobChangeReqColumns";
import { jobChangeReqFormFields } from "@/modules/hr/schemas/formSchemas/jobChangeReqForm";
ModuleRegistry.registerModules([AllCommunityModule]);

export default function JobChangeReqPage() {
    const { data: requests, error, loading, refetch } = useFetch<JobChangeRequestRead[]>(`hr/job-change-requests/`);
    const rowData = requests || []; // Use empty array if data is undefined

    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [editingChangeReq, setEditingChangeReq] = useState<JobChangeRequestRead | null>(null);
    const [deletingChangeReq, setDeletingChangeReq] = useState<JobChangeRequestRead | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const openCreateModal = () => {
        setEditingChangeReq(null);
        setIsFormModalOpen(true);
    };

    const openEditModal = (vacancy: JobChangeRequestRead) => {
        setEditingChangeReq(vacancy);
        setIsFormModalOpen(true);
    };

    const closeFormModal = () => {
        setIsFormModalOpen(false);
        setEditingChangeReq(null);
    };

    const editInitialValues = useMemo(() => {
        if (!editingChangeReq) return undefined;

        return {
            ...editingChangeReq,

            current_position: editingChangeReq.current_position?.guid,
            desired_position: editingChangeReq.desired_position?.guid,
            employee: editingChangeReq.employee?.guid
        };
    }, [editingChangeReq]);

    const handleSubmit = async (payload: any) => {
        console.log("data", payload)
        const employee = typeof payload.employee === 'object'
            ? payload.employee.guid
            : payload.employee;

        const current_position = typeof payload.current_position === 'object'
            ? payload.current_position.guid
            : payload.current_position;
        const desired_position = typeof payload.current_position === 'object'
            ? payload.current_position.guid
            : payload.current_position;

        // Construct the "Write" payload
        const normalizedPayload: JobChangeRequestWrite = {
            current_position: current_position,
            desired_position: desired_position,
            employee: employee,
            reason: payload.reason,
            request_type: payload.request_type,
            status: payload.status
        };

        try {
            if (editingChangeReq) {
                await JobPositionChangeReqService.updateJobPosition(editingChangeReq.guid, normalizedPayload);
                toast.success("Updated successfully");
            } else {
                await JobPositionChangeReqService.createJobPosition(normalizedPayload);
                toast.success("Created successfully");
            }
            await refetch();
            closeFormModal();
        } catch (err) {
            toast.error("Failed to save requests. Check required fields.");
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

    const handleDelete = (data: JobChangeRequestRead) => {
        setDeletingChangeReq(data);
    };

    const confirmDelete = async () => {
        if (!deletingChangeReq) return;
        setDeleteLoading(true);
        try {
            await JobPositionChangeReqService.deleteJobPosition(deletingChangeReq.guid);
            toast.success("Deleted successfully.");
            await refetch();
            setDeletingChangeReq(null);
        } catch (error) {
            toast.error("Failed to delete job change request.");
            console.error("Deletion error:", error);
        } finally {
            setDeleteLoading(false);
        }
    };

    // --- COLUMNS WITH ACTIONS ---
    const categoryColumnsWithActions = [
        ...jobChangeRequestColumns,
        ...actionsColumn<JobChangeRequestRead>({
            onEdit: openEditModal,
            onDelete: handleDelete,
        }),
    ];

    // --- INLINE EDITING LOGIC ---



    if (loading && rowData.length === 0) {
        return <div className="text-center pt-8"><Spinner size="xl" /> Loading requests...</div>;
    }

    if (error) {
        return <div className="p-4 text-red-600">Error loading requests: {error}</div>;
    }

    return (
        <>
            <DeleteConfirmModal
                isOpen={!!deletingChangeReq}
                onClose={() => setDeletingChangeReq(null)}
                onConfirm={confirmDelete}
                loading={deleteLoading}
                message={`Delete job change request "${deletingChangeReq?.current_position?.title}"? This action cannot be undone.`}
            />
            <FormModal
                isOpen={isFormModalOpen}
                onClose={closeFormModal}
                onSubmit={handleSubmit}
                formFields={jobChangeReqFormFields}
                initialValues={editInitialValues}
                isEditing={Boolean(editingChangeReq)}
                title={editingChangeReq ? "Edit ChangeReq" : "Create Request"}
            />
            <PageHeader title={"Position Change"} >
                <Button onClick={openCreateModal} >
                    Create Request
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
