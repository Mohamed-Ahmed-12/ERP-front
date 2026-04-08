import { ColDef } from "ag-grid-community";
import { EquipmentRead, EquipmentStatus } from "../../types/equipment";

export const equipmentColumns: ColDef<EquipmentRead>[] = [
  { field: "guid", headerName: "ID", flex: 1, filter: true },
  { field: "serial_number", headerName: "Serial Number", flex: 1, filter: true },
  { field: "name", headerName: "Name", flex: 1, filter: true },
  { field: "model", headerName: "Model", flex: 1, filter: true },

  {
    field: "status",
    headerName: "Status",
    flex: 1,
    filter: true,
  },

  {
    field: "equipment_type",
    headerName: "Equipment Type",
    flex: 1,
    filter: true,
    valueGetter: (params) => params.data?.equipment_type?.name ?? "—",
  },
  {
    field: "equipment_brand",
    headerName: "Brand",
    flex: 1,
    filter: true,
    valueGetter: (params) => params.data?.equipment_brand?.name ?? "—",
  },

  {
    field: "main_driver",
    headerName: "Main Driver",
    flex: 1,
    filter: true,
    valueGetter: (params) =>
      params.data?.main_driver
        ? `${params.data.main_driver.first_name} ${params.data.main_driver.last_name}`
        : "—",
  },
  {
    field: "sub_driver",
    headerName: "Sub Driver",
    flex: 1,
    filter: true,
    valueGetter: (params) =>
      params.data?.sub_driver
        ? `${params.data.sub_driver.first_name} ${params.data.sub_driver.last_name}`
        : "—",
  },

//   {
//     field: "merchant",
//     headerName: "Merchant",
//     flex: 1,
//     filter: true,
//     valueGetter: (params) => params.data?.merchant?.name ?? "—",
//   },

  {
    field: "created_at",
    headerName: "Created At",
    flex: 1,
    filter: "agDateColumnFilter",
    valueFormatter: (params) =>
      params.value ? new Date(params.value).toLocaleDateString() : "—",
  },
  {
    field: "updated_at",
    headerName: "Updated At",
    flex: 1,
    filter: "agDateColumnFilter",
    valueFormatter: (params) =>
      params.value ? new Date(params.value).toLocaleDateString() : "—",
  },
];