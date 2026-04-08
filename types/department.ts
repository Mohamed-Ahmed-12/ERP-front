export interface Department {
    guid: string;          // Server-generated
    name: string;
    description: string;
    created_at: string;    // Server-generated
    updated_at: string;    // Server-generated
}

export interface DepartmentCreate {
    name: string;
    description: string;
}

export interface DepartmentUpdate extends Partial<DepartmentCreate> {}