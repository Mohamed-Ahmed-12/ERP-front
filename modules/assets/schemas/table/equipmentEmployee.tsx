import { ColDef } from "ag-grid-community";
import { EquipmentEmployeeRead,} from "../../types/equipment";


export const equipmentEmployeeColumns: (ColDef<EquipmentEmployeeRead>)[] = [
    { field: "guid", headerName: "Id", flex: 1, filter: true },
    { field: "first_name", headerName: "First Name", flex: 1, filter: true },
    { field: "last_name", headerName: "Last Name", flex: 1, filter: true },
    { field: "phone_number", headerName: "Phone Number", flex: 1, filter: true },
    { field: "source", headerName: "Source", flex: 1, filter: true },
    
];
