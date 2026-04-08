import {Position} from "@/types/position";
import { ColDef } from "ag-grid-community";



// Base Columns configuration
export const positionColumns: (ColDef<Position>)[] = [
    { field: "guid", headerName: "Id", flex: 1, filter: true },
    { field: "title", headerName: "Title", flex: 1, filter: true },
    { field: "seniority_level", headerName: "Level", flex: 1, filter: true },
    { field: "department.name", headerName: "Department", flex: 1, filter: true },
    { field: "base_salary", headerName: "Base Salary", flex: 1, filter: true },
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
