import { CandidateRead } from "@/types/candidates";
import { ColDef } from "ag-grid-community";

export const candidateColumns: (ColDef<CandidateRead>)[] = [
    { field: "guid", headerName: "Id", flex: 1, filter: true },
    { field: "first_name", headerName: "First Name" },
    { field: "last_name", headerName: "Last Name" },
    { field: "email", headerName: "Email" },
    { field: "phone_number", headerName: "Phone Number" },
    { field: "status", headerName: "Status" },
    { field: "expected_salary", headerName: "Expected Salary", valueFormatter: (params) => params.value ? `$${params.value}` : "N/A" },
];