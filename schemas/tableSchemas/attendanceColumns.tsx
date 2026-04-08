import { AttendanceRead } from "@/types/attendance";
import { ColDef } from "ag-grid-community";



// Base Columns configuration
export const attendanceColumns: (ColDef<AttendanceRead>)[] = [
    { field: "guid", headerName: "Id", flex: 1, filter: true },
    { field: "employee.first_name", headerName: "Employee", flex: 1, filter: true },
    {
        field: "check_in",
        headerName: "Check In",
        flex: 1,
        filter: true,
        valueFormatter: (params) => new Date(params.value).toLocaleString(),

    },
    {
        field: "check_out",
        headerName: "Check Out",
        flex: 1,
        filter: true,
        valueFormatter: (params) => {
            if (!params.value) return "—"; // Show a dash or empty string if null
            return new Date(params.value).toLocaleString();
        }
    },
    {
        field: "shift_type",
        headerName: "Shift",
        flex: 1,

    },
    {
        field: "status",
        headerName: "Status",
        flex: 1,
        filter: true,
    }
];
