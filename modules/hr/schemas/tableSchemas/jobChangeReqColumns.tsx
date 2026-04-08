import { JobChangeRequestRead } from "@/modules/hr/types/jobChangeRequest";
import { ColDef } from "ag-grid-community";



// Base Columns configuration
export const jobChangeRequestColumns: (ColDef<JobChangeRequestRead>)[] = [
    { field: "guid", headerName: "Id", flex: 1, filter: true },
    { field: "employee.first_name", headerName: "Employee", flex: 1, filter: true },
    { field: "current_position.title", headerName: "Current Position", flex: 1, filter: true },
    { field: "desired_position.title", headerName: "New Position", flex: 1, filter: true },
    { field: "status", headerName: "Status", flex: 1, filter: true },
    { field: "request_type", headerName: "Type", flex: 1, filter: true },

];
