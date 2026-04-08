import { Employee } from "@/modules/hr/types/employees";
import { ColDef } from "ag-grid-community";



// Base Columns configuration
export const employeeColumns: (ColDef<Employee>)[] = [
    { field: "guid", headerName: "Id", flex: 1, filter: true },
    { field: "first_name", headerName: "First Name", flex: 1, filter: true },
    { field: "last_name", headerName: "Last Name", flex: 1, filter: true },
    { field: "email", headerName: "Email", flex: 1, filter: true },
    { field: "position.title", headerName: "Position", flex: 1, filter: true },
    { field: "department.name", headerName: "Department", flex: 1, filter: true },
    {
        field: "created_at",
        headerName: "Created At",
        flex: 1,
        filter: true,
        valueFormatter: (params) => new Date(params.value).toLocaleString(),

    },
    {
        field: "updated_at",
        headerName: "Updated At",
        flex: 1,
        filter: true,
        valueFormatter: (params) => new Date(params.value).toLocaleString(),
    }
];
