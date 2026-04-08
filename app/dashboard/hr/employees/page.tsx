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
import { Employee, EmployeeWrite } from "@/types/employees";
import { EmployeeService } from "@/services/employeeService";
import { employeeFormFields } from "@/schemas/formSchemas/employeeForm";
import { employeeColumns } from "@/schemas/tableSchemas/employeeColumns";
import { validateFile } from "@/helpers/fileValidation";

ModuleRegistry.registerModules([AllCommunityModule]);

export default function EmployeesPage() {
    const { data: employees, error, loading, refetch } = useFetch<Employee[]>(`hr/employees/`);
    const rowData = employees || []; // Use empty array if data is undefined

    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
    const [deletingEmployee, setDeletingEmployee] = useState<Employee | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const openCreateModal = () => {
        setEditingEmployee(null);
        setIsFormModalOpen(true);
    };

    const openEditModal = (employee: Employee) => {
        setEditingEmployee(employee);
        setIsFormModalOpen(true);
    };

    const closeFormModal = () => {
        setIsFormModalOpen(false);
        setEditingEmployee(null);
    };

    const handleSubmit = async (payload: Employee) => {
        console.log("payload", payload);

        const formData = new FormData();

        // 1. Resolve relation fields to GUIDs
        const positionId = typeof payload.position === 'object'
            ? payload.position.guid
            : payload.position;
        formData.append("position", positionId);

        const departmentId = typeof payload.department === 'object'
            ? payload.department.guid
            : payload.department;
        formData.append("department", departmentId);

        const managerId = typeof payload.manager === 'object'
            ? payload.manager?.guid ?? null
            : payload.manager;
        if (managerId) {
            formData.append("manager", managerId);
        }

        // 2. Append all scalar text fields defined in EmployeeWrite
        const textFields: (keyof EmployeeWrite)[] = [
            "first_name",
            "middle_name",
            "last_name",
            "national_id",
            "phone_number",
            "address",
            "city",
            "country",
            "email",
            "work_email",
            "dob",
            "date_hired",
            "gender",
            "marital_status",
            "military_status",
            "education_level",
        ];

        textFields.forEach((field) => {
            const value = payload[field as keyof Employee];
            if (value !== undefined && value !== null) {
                formData.append(field, String(value));
            }
        });

        // 3. Nullable date field
        if (payload.contract_end_date) {
            formData.append("contract_end_date", payload.contract_end_date);
        }

        // 4. Boolean field — FormData requires strings
        formData.append("is_active", String(payload.is_active));

        // 5. Send formData to the correct service method
        if (editingEmployee) {
            await EmployeeService.updateEmployee(editingEmployee.guid, formData);
            toast.success("Updated successfully");
        } else {
            await EmployeeService.createEmployee(formData);
            toast.success("Created successfully");
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

    const handleDelete = (data: Employee) => {
        setDeletingEmployee(data);
    };

    const confirmDelete = async () => {
        if (!deletingEmployee) return;
        setDeleteLoading(true);
        try {
            await EmployeeService.deleteEmployee(deletingEmployee.guid);
            toast.success("Deleted successfully.");
            await refetch();
            setDeletingEmployee(null);
        } catch (error) {
            toast.error("Failed to delete employee.");
            console.error("Deletion error:", error);
        } finally {
            setDeleteLoading(false);
        }
    };

    // --- COLUMNS WITH ACTIONS ---
    const categoryColumnsWithActions = [
        ...employeeColumns,
        ...actionsColumn<Employee>({
            onEdit: openEditModal,
            onDelete: handleDelete,
        }),
    ];

    // --- INLINE EDITING LOGIC ---

    if (loading && rowData.length === 0) {
        return <div className="text-center pt-8"><Spinner size="xl" /> Loading Employees...</div>;
    }

    if (error) {
        return <div className="p-4 text-red-600">Error loading employees: {error}</div>;
    }

    return (
        <>
            <DeleteConfirmModal
                isOpen={!!deletingEmployee}
                onClose={() => setDeletingEmployee(null)}
                onConfirm={confirmDelete}
                loading={deleteLoading}
                message={`Delete employee "${deletingEmployee?.first_name}"? This action cannot be undone.`}
            />
            <FormModal
                isOpen={isFormModalOpen}
                onClose={closeFormModal}
                onSubmit={handleSubmit}
                formFields={employeeFormFields}
                initialValues={editingEmployee ? editingEmployee : undefined}
                isEditing={Boolean(editingEmployee)}
                title={editingEmployee ? "Edit Employee" : "Create Employee"}
            />
            <PageHeader title={"Employees"} >
                <Button onClick={openCreateModal} >
                    Create Employee
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