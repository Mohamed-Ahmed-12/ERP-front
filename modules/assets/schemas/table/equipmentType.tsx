import { ColDef } from "ag-grid-community";
import { EquipmentRead, EquipmentTypeRead } from "../../types/equipment";


export const eqTypeColumns: (ColDef<EquipmentTypeRead>)[] = [
    { field: "guid", headerName: "Id", flex: 1, filter: true },
    { field: "name", headerName: "Name", flex: 1, filter: true },
    { field: "drivable", headerName: "Drivable", flex: 1, filter: true },
    
];
