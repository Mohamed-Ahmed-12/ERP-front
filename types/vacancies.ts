import { Position } from "./position";

export interface VacancyWrite {
    position: string;    // This is the GUID string
    open_date: string;   // "2026-04-05"
    close_date: string;  // "2026-04-05"
    number_of_positions: number;
    description: string;
    required_qualifications: string;
    responsibilities: string;
    is_open: boolean;
}

export interface VacancyRead {
    guid: string;
    position: Position;
    open_date: string;
    close_date: string;
    number_of_positions: number;
    description: string;
    required_qualifications: string;
    responsibilities: string;
    is_open: boolean;
}
