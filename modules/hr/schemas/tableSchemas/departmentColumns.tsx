import { Department } from "@/modules/hr/types/department";
import { ColDef } from "ag-grid-community";


export const departmentColumns: (ColDef<Department>)[] = [
    { field: "guid", headerName: "Id", flex: 1, filter: true },
    { field: "name", headerName: "Name", flex: 1, filter: true },
    { field: "description", headerName: "Description", flex: 1, filter: true },
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
