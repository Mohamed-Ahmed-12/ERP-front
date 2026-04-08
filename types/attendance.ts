import { Employee } from "./employees";

export interface AttendanceWrite {
    employee: string;    // This is the GUID string
    check_in: string;    // "2026-04-05T09:04"
    check_out: string | null;
    shift_type: 'Day' | 'Night';
    status: 'Present' | 'Absent' | 'Late' | 'Excused';
}

export interface AttendanceRead {
    guid: string;
    employee: Employee;
    check_in: string;
    check_out: string | null;
    shift_type: 'Day' | 'Night';
    status: 'Present' | 'Absent' | 'Late' | 'Excused';
}