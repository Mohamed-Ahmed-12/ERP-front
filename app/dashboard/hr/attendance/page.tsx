"use client";

import React, { useMemo, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { AllCommunityModule, ModuleRegistry, RowSelectionOptions } from "ag-grid-community";
import { Button, Spinner } from "flowbite-react";
import { toast } from "react-toastify";
import PageHeader from "@/components/common/PageHeader";
import { useFetch } from "@/hooks/useFetch";
import { useAgGridFilter } from "@/hooks/useAgGridFilter";
import { AttendanceRead as Attendance, AttendanceWrite } from "@/modules/hr/types/attendance";
import { attendanceColumns } from "@/modules/hr/schemas/tableSchemas/attendanceColumns";
import { attendanceFormFields } from "@/modules/hr/schemas/formSchemas/attendanceForm";
import { AttendanceService } from "@/modules/hr/services/attendanceService";
import { actionsColumn } from "@components/dashboard/actionsColumn";
import FormModal from "@components/dashboard/FormModal";
import DeleteConfirmModal from "@/components/common/DeleteConfirmModal";

ModuleRegistry.registerModules([AllCommunityModule]);


export default function AttendancePage() {
    const { data: attendanceList, error, loading, refetch } = useFetch<Attendance[]>('hr/attendance/');
    const rowData = attendanceList || [];

    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [editingAttendance, setEditingAttendance] = useState<Attendance | null>(null);
    const [deletingAttendance, setDeletingAttendance] = useState<Attendance | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const openCreateModal = () => {
        setEditingAttendance(null);
        setIsFormModalOpen(true);
    };

    const openEditModal = (attendance: Attendance) => {
        setEditingAttendance(attendance);
        setIsFormModalOpen(true);
    };

    const closeFormModal = () => {
        setIsFormModalOpen(false);
        setEditingAttendance(null);
    };


    const handleSubmit = async (payload: any) => {
        // 1. Extract the GUID regardless of whether 'payload.employee' 
        //    is an object (from initialValues) or a string (from a dropdown)
        const employeeGuid = typeof payload.employee === 'object'
            ? payload.employee.guid
            : payload.employee;

        // 2. Normalize the data for the backend
        const normalizedPayload: AttendanceWrite = {
            employee: employeeGuid,
            check_in: payload.check_in,
            check_out: payload.check_out || null, // Fixes the "" empty string error
            shift_type: payload.shift_type,
            status: payload.status,
        };

        try {
            if (editingAttendance) {
                await AttendanceService.updateAttendance(editingAttendance.guid, normalizedPayload);
                toast.success("Updated successfully");
            } else {
                await AttendanceService.createAttendance(normalizedPayload);
                toast.success("Created successfully");
            }
            await refetch();
            closeFormModal();
        } catch (err) {
            toast.error("Save failed. Check your data format.");
        }
        return normalizedPayload;
    };

    const handleDelete = (data: Attendance) => {
        setDeletingAttendance(data);
    };

    const confirmDelete = async () => {
        if (!deletingAttendance) return;
        setDeleteLoading(true);
        try {
            await AttendanceService.deleteAttendance(deletingAttendance.guid);
            toast.success("Deleted successfully.");
            await refetch();
            setDeletingAttendance(null);
        } catch (error) {
            toast.error("Failed to delete attendance record.");
            console.error("Deletion error:", error);
        } finally {
            setDeleteLoading(false);
        }
    };

    const { handleFilterChange } = useAgGridFilter();

    const defaultColDef = useMemo(() => ({ resizable: true, sortable: true }), []);

    const rowSelection = useMemo<RowSelectionOptions>(() => ({ mode: 'multiRow' }), []);

    const columnsWithActions = [
        ...attendanceColumns,
        ...actionsColumn<Attendance>({
            onEdit: openEditModal,
            onDelete: handleDelete,
        }),
    ];

    const editInitialValues = editingAttendance
        ? {
            employee: editingAttendance.employee,
            check_in: editingAttendance.check_in,
            check_out: editingAttendance.check_out,
            shift_type: editingAttendance.shift_type,
            status: editingAttendance.status,
        }
        : undefined;

    if (loading && rowData.length === 0) {
        return <div className="text-center pt-8"><Spinner size="xl" /> Loading Attendance...</div>;
    }

    if (error) {
        return <div className="p-4 text-red-600">Error loading attendance: {error}</div>;
    }

    return (
        <>
            <DeleteConfirmModal
                isOpen={!!deletingAttendance}
                onClose={() => setDeletingAttendance(null)}
                onConfirm={confirmDelete}
                loading={deleteLoading}
                message={`Delete this attendance record? This action cannot be undone.`}
            />
            <FormModal
                isOpen={isFormModalOpen}
                onClose={closeFormModal}
                onSubmit={handleSubmit}
                formFields={attendanceFormFields}
                initialValues={editInitialValues}
                isEditing={Boolean(editingAttendance)}
                title={editingAttendance ? "Edit Attendance" : "Create Attendance"}
            />
            <PageHeader title="Attendance">
                <Button onClick={openCreateModal}>
                    Create Attendance
                </Button>
            </PageHeader>

            <div className="ag-theme-quartz" style={{ height: "100%", width: "100%" }}>
                <AgGridReact
                    rowData={rowData}
                    columnDefs={columnsWithActions}
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
