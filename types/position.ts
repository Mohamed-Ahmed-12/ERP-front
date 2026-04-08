import { Department } from "./department";

export interface Position {
    guid: string;
    title: string;
    base_salary: string;
    department: Department;
    contract_type: 'Full-time' | 'Part-time' | 'Contract';
    seniority_level:'entry' | 'mid' | 'senior' | 'director' | 'vp' | 'c_suite'

    created_at: string;
    updated_at: string;
}

export interface PositionCreate {
    title: string;
    base_salary: string;
    department: string;
    contract_type: 'Full-time' | 'Part-time' | 'Contract';
    seniority_level: 'entry' | 'mid' | 'senior' | 'director' | 'vp' | 'c_suite'
}


// For Updates (PATCH), all fields become optional
export type PositionUpdate = Partial<PositionCreate>;