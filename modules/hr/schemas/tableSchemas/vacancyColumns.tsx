import { VacancyRead } from "@/modules/hr/types/vacancies";
import { ColDef } from "ag-grid-community";

export const vacancyColumns: (ColDef<VacancyRead>)[] = [
    { field: "guid", headerName: "Id", flex: 1, filter: true },
    { field: "position.title", headerName: "Position", flex: 1, filter: true },
    { field: "number_of_positions", headerName: "Number of Positions", flex: 1, filter: true },
    { field: "is_open", headerName: "Is Open", flex: 1, filter: true },
    {
        field: "open_date",
        headerName: "Open Date",
        flex: 1,
        filter: true,
        valueFormatter: (params) => new Date(params.value).toLocaleString(),

    },
    {
        field: "close_date",
        headerName: "Close Date",
        flex: 1,
        filter: true,
        valueFormatter: (params) => {
            if (!params.value) return "—"; // Show a dash or empty string if null
            return new Date(params.value).toLocaleString();
        }
    }
];
