import { ColDef } from "ag-grid-community";
import { EquipmentBrandRead,} from "../../types/equipment";


export const eqTypeColumns: (ColDef<EquipmentBrandRead>)[] = [
    { field: "guid", headerName: "Id", flex: 1, filter: true },
    { field: "name", headerName: "Name", flex: 1, filter: true },
    
];
